const jwt = require('jsonwebtoken')
const User = require('../../model/User.js')

const UNAUTHORIZED = () => ({ success: false, error: "Unauthorized" })

module.exports = async (req, res, next) => {
  const token = req.cookies.jwt
  if (!token) {
    res.send(UNAUTHORIZED())
    return
  }
  try {
    var payload = jwt.verify(token, process.env.JWT_SECRET)
  } catch (err) {
    res.send(UNAUTHORIZED())
    return
  }


  req.user = await User.findOne({ _id: payload._id })
  if (!req.user) {
    res.send(UNAUTHORIZED())
    return
  }
  next()
}