const Router = require('express').Router

const auth = require('./middleware/auth.js')
const Game = require('../model/Game.js')

const router = Router()

router.get('/', async (req, res) => {
  let games = await Game.find({ winner: 0 }).populate('p1')
  let publicGames = games.map(el => ({
    _id: el._id,
    name: el.name,
    startedOn: el.startedOn,
    p1: el.p1.username
  }))
  res.send(publicGames)
})

router.post('/', auth, async (req, res) => {
  let { name } = req.body
  let game = new Game({ name, p1: req.user._id })
  try {
    await game.save()
    res.send({
      success: true,
      gameId: game._id
    })
  } catch (error) {
    res.send({ success: false, error })
  }
})

router.post('/join/:gameId', auth, async (req, res) => {
  let gameId = req.params.gameId
  let game = await Game.findOne({ _id: gameId })
  if (!game) {
    res.send({ success: false, error: "No game found" })
    return
  }
  if (game.p2) {
    res.send({ success: false, error: "The game is full" })
    return
  }
  game.p2 = req.user._id
  try {
    await game.save()
    await game.populate('p1', 'p2')
    let publicGame = {
      _id: game._id,
      name: game.name,
      startedOn: game.startedOn,
      p1: game.p1.username,
      p2: game.p2.username,
    }
    res.send({ success: true, game: publicGame })
  } catch (error) {
    res.send({ success: false, error })
  }
})


module.exports = router