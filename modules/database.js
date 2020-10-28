const mongoose = require('mongoose')
const User = require('../model/User')

const MONGO_URL = process.env.MONGO_URL

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

mongoose.connection.once("open", function () {
  console.log("** MongoDB database connection established successfully **");
});