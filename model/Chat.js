const { Schema, model } = require('mongoose')

const ChatSchema = new Schema({
  content: String,
  sentOn: { type: Date, default: Date.now },
  sender: { type: Schema.Types.ObjectId, ref: "User" },
})

const Chat = model("Chat", ChatSchema)

module.exports = Chat