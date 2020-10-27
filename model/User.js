const { Schema, model } = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new Schema({
  username: { type: String, unique: true, index: true },
  password: String,
  lastLogin: {
    on: { type: Date, default: Date.now },
    from: String
  }
})

UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next()
  var salt = bcrypt.genSaltSync(10)
  this.password = bcrypt.hashSync(this.password, salt)
  return next()
})

UserSchema.methods.authenticate = function (password) {
  return bcrypt.compareSync(password, this.password)
}

const User = model("User", UserSchema)

module.exports = User