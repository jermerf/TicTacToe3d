const Game = require('./Game')
const MSG = require('./MSG')
const games = []

function getPublicGames() {
  return games
    .filter(g => !g.model.winner)
    .map(g => ({
      id: g.model.id,
      name: g.model.name,
      startedOn: g.model.startedOn,
      // Must have p1
      p1: g.p1.user.username,
      // May have p2
      p2: (g.p2
        ? g.p2.user.username
        : undefined)
    }))
}

function create(name, p1) {
  let game = new Game(name, p1)
  games.push(game)
  return game
}

async function join(gameId, p2) {
  let game = await games.find(g => g.model.id == gameId)
  if (!game) {
    p2.send(MSG.gameNotFound())
    return
  }
  if (game.p2) {
    p2.send(MSG.gameFull())
    return
  }
  game.start(p2)
  return game
}

async function rejoin(player) {
  let game = gameByUserId(player.user.id)
  if (!game) {
    p2.send(MSG.gameNotFound())
    return
  }
  return game.rejoin(player)

}


async function observe(gameId, client) {
  let game = await games.find(g => g.model.id == gameId)
  if (!game) {
    client.send(MSG.gameNotFound)
    return
  }

  games.push(this)
  return game
}

function gameByUserId(userId) {
  if (typeof (userId) !== 'string') {
    userId = userId.toString()
  }
  return games.find(g => (g.p1 && (g.p1.user.id == userId)) || (g.p2 && (g.p2.user.id == userId)))
}



module.exports = {
  getPublicGames,
  create,
  join,
  rejoin,
  observe,
  gameByUserId
}