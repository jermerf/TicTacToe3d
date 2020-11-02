const jwt = require('jsonwebtoken')
const User = require('../model/User.js')

const UNAUTHORIZED = () => ({ success: false, error: "Unauthorized" })

async function middleware(req, res, next) {
  const token = req.cookies.jwt
  if (!token) {
    res.send(UNAUTHORIZED())
    return
  }
  let user = await getUserForJwt(token)
  if (!user) {
    res.send(UNAUTHORIZED())
    return
  }
  req.user = user
  next()
}

async function getUserForJwt(token) {
  try {
    var payload = jwt.verify(token, process.env.JWT_SECRET)
  } catch (err) {
    // bad token, return nothing
    return
  }
  return await User.findOne({ _id: payload.id })
}


module.exports = {
  middleware,
  getUserForJwt
}