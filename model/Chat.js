const { Schema, model } = require('mongoose')

const ChatSchema = new Schema({
  content: String,
  sentOn: { type: Date, default: Date.now },
  sender: Schema.Types.ObjectId
})

const Chat = model("Chat", ChatSchema)

module.exports = Chat