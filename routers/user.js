const Router = require('express').Router
const jwt = require('jsonwebtoken')

const auth = require('./middleware/auth.js')
const User = require('../model/User.js')
const Log = require('../model/Log.js')

const MSG = {
  regDuplicate: () => ({ success: false, error: "Username taken" }),
  loginSuccess: () => ({ success: true, username: "" }),
  badCred: () => ({ success: false, error: "Bad Credentials" })
}

const router = Router()

async function Register(req, res, next) {
  var { username, password } = req.body
  var user = new User({ username, password })
  try {
    await user.save()
    next()
  } catch (err) {
    console.log(err)
    res.send(MSG.regDuplicate())
  }
}

async function Login(req, res) {
  const { username, password } = req.body
  let user = await User.findOne({ username })
  if (!user) {
    res.send(MSG.badCred())
    return
  }
  if (user.authenticate(password)) {
    var resData = MSG.loginSuccess()
    resData.username = username
    var payload = {
      _id: user._id,
      username
    }
    var token = jwt.sign(payload, process.env.JWT_SECRET)
    res.cookie('jwt', token)
    res.send(resData)
  } else {
    res.send(MSG.badCred())
  }
}
async function CheckLogin(req, res) {
  if (req.user) {
    res.send({ success: true, username: req.user.username })
  }
}

async function Logout(req, res) {
  res.cookie('jwt', null, { maxAge: 0 });
  await new Log({ content: `${req.user.username} logged out` }).save()
  res.send({ success: true })
}

router.post('/register', Register, Login)
router.post('/login', Login)
router.post('/logout', auth, Logout)
router.get('/check', auth, CheckLogin)

module.exports = router