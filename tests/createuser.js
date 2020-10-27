const mongoose = require('mongoose')
const User = require('../model/User')

const MONGO_URL = "mongodb+srv://jermerf:vrDvZcHuyPIKQ3K4@teaching.z6kbj.gcp.mongodb.net/ttt?retryWrites=true&w=majority"

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

async function testUser() {
  var user = new User({
    username: "Test Edison",
    password: "SuperSecret"
  })
  try {
    await user.save()
    console.log(user.giveDescriptionToYouLongNameSoYouKnowItsCustom())
    console.log("Test complete")
  } catch (err) {
    console.log(err)
  }
}

testUser()