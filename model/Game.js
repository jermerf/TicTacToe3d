const { Schema, model } = require('mongoose')
const Chat = require('./Chat.js')

// Add function to replace a location in a string with something else
String.prototype.replaceAt = function (index, replacement) {
  return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

const winningCombos = [
  // Horizontal Lines   Left-Right
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  // Vertical Lines     Top-Bottom
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  // Diagizontal Lines  
  [0, 4, 8], [2, 4, 6]
]

const GameSchema = new Schema({
  name: { type: String, default: "New Game" },
  board: { type: String, default: "---------" },
  startedOn: { type: Date, default: Date.now },
  p1: { type: Schema.Types.ObjectId, ref: "User" },
  p2: { type: Schema.Types.ObjectId, ref: "User" },
  currentPlayer: { type: Boolean, default: () => Math.random() < 0.5 },
  winner: { type: String, default: null },
  winCombo: { type: Number, default: -1 },
  chat: [Chat.schema]
})

GameSchema.methods.playAt = function (position, letter) {
  let { board } = this
  if (board[position] != '-') {
    return false
  }
  board = board.replaceAt(position, letter)
  this.board = board
  for (var i = 0; i < winningCombos.length; i++) {
    let combo = winningCombos[i]
    var i0 = combo[0]
    var i1 = combo[1]
    var i2 = combo[2]
    if (board[i0] == board[i1] && board[i1] == board[i2]) {
      if (board[i0] != '-') {
        this.winner = board[i0]
        this.winCombo = i
      }
    }
  }
  return this
}

const Game = model("Game", GameSchema)

module.exports = Game