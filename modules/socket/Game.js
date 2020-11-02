const GameModel = require('../../model/Game.js')
const MSG = require('./MSG')

const X = 'x'
const O = 'o'

class Game {
  // Get a list of games with public details
  model = null

  // Client sockets
  p1 = null
  p2 = null
  observers = []

  constructor(name, p1) {
    this.p1 = p1
    this.model = new GameModel({
      name,
      p1: p1.user.id
    })
    this.model.save().then(() => this.setupClient(p1))
  }

  async setupClient(client) {
    client.socket.on('disconnect', this.disconnected)
    client.on('chat', this.chat)
    client.send(MSG.joinedGame(this.model.id))
  }

  // TODO FINISH
  disconnected(clientSocket) {
    if (clientSocket === this.p1.socket) {

    } else if (clientSocket === this.p2.socket) {

    } else {
      let client = this.observers.find(o => o.socket = clientSocket)
      this.removeObserver(client)
    }
  }

  observe(client) {
    this.removeObserver(client)
    this.observers.push(client)
    this.setupClient(client)
  }
  removeObserver(client) {
    let i = this.observers.indexOf(client)
    if (i < 0) return
    this.observers.splice(i, 1)
  }

  announce(msg) {
    this.p1.send(msg)
    this.p2.send(msg)
    for (let o of this.observers) {
      o.send(msg)
    }
  }

  async chat(msg) {
    this.announce(MSG.chat(msg))
  }

  async start(p2) {
    let { p1 } = this
    this.model.p2 = p2.user.id
    this.p2 = p2
    this.setupClient(p2)

    // Listen for 'play' once game has started
    p1.on('play', data => this.play(p1, data.position))
    p2.on('play', data => this.play(p2, data.position))

    this.announce(MSG.board(this.model.board))
    // Start game
    p1.send(MSG.playerLetter(X))
    p2.send(MSG.playerLetter(O))
    this.nextPlayer()
  }


  async rejoin(player) {
    if (this.model.winner) {
      this.observe(player)
      player.send(MSG.board(this.model.board))
      player.send(MSG.gameOver(this.model.winner, this.model.winCombo))
      this.kickEveryoneInSeconds(3)
      return
    }
    if (this.p1 && this.p1.user.id == player.user.id) {
      this.p1 = player
    } else if (this.p2 && this.p2.user.id == player.user.id) {
      this.p2 = player
    } else return

    this.setupClient(player)
    // If the game has started then 
    if (this.p1 && this.p2) {
      player.send(MSG.playerLetter(this.p1 == player ? X : O))
      player.send(MSG.board(this.model.board))
      if (this.model.currentPlayer && this.p1 == player) player.send(MSG.yourTurn())
      if (!this.model.currentPlayer && this.p2 == player) player.send(MSG.yourTurn())
    }

    player.on('play', data => this.play(player, data.position))

    return this
  }

  endingGame = false

  kickEveryoneInSeconds(sec) {
    this.announce(MSG.chat(`Game closing in ${sec}s`))
    if (this.endingGame) return
    this.endingGame = setTimeout(() => {
      if (this.p1) {
        this.p1.socket.terminate()
        this.p1 = null
      }
      if (this.p2) {
        this.p2.socket.terminate()
        this.p2 = null
      }
      for (var i = this.observers.length - 1; i >= 0; i--) {
        let observer = this.observers[i]
        if (observer) {
          observer.socket.terminate()
          this.observers.splice(i, 1)
        }
      }
    }, sec * 1000)
  }

  // Game Logic
  async nextPlayer() {
    this.model.currentPlayer = !this.model.currentPlayer
    await this.model.save()

    if (this.model.currentPlayer) {
      this.p1.send(MSG.yourTurn())
    } else {
      this.p2.send(MSG.yourTurn())
    }
  }

  async play(player, position) {
    let model = this.model
    let { currentPlayer } = model
    let letter = (player == this.p1 ? X : O)

    // Make sure it's this player's turn
    if ((!currentPlayer && player === this.p1) || (currentPlayer && player === this.p2)) {
      player.send(MSG.notYourTurn())
      return
    }
    // Make sure you can play there
    if (model.playAt(position, letter)) {
      await model.save()
      this.announce(MSG.board(model.board))
    } else {
      player.send(MSG.invalidMove())
      return
    }

    if (model.winner) {
      this.announce(MSG.gameOver(model.winner, model.winCombo))
      this.kickEveryoneInSeconds(10)
    } else {
      this.nextPlayer()
    }
  }

}

module.exports = Game