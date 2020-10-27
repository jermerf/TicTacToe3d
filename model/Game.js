const { Schema, model } = require('mongoose')
const Chat = require('./Chat.js')

const GameSchema = new Schema({
  name: String,
  board: { type: String, default: "000000000" },
  startedOn: { type: Date, default: Date.now },
  p1: Schema.Types.ObjectId,
  p2: Schema.Types.ObjectId,
  currentPlayer: { type: Number, default: 1 },
  winner: { type: Number, default: 0 },
  chat: [Chat.schema]
})

const Game = model("Game", GameSchema)

module.exports = Game