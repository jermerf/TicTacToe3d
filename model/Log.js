const { Schema, model } = require('mongoose')

const LogSchema = new Schema({
  content: String,
  loggedOn: { type: Date, default: Date.now }
})

const Log = model("Log", LogSchema)

module.exports = Log