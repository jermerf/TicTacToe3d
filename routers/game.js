const Router = require('express').Router

const auth = require('../modules/auth.js').middleware
const GameManager = require('../modules/socket/GameManager.js')

const router = Router()

router.get('/', auth, async (req, res) => {
  res.send(GameManager.getPublicGames())
})

module.exports = router