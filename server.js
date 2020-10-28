require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const database = require('./modules/database.js')
const Log = require('./model/Log.js')

const user = require('./routers/user.js')
const game = require('./routers/game.js')

const PORT = process.env.PORT || 3000

var app = express()

// Access cookies
app.use(cookieParser())

// For axios POST requests
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(async (req, res, next) => {
  next()
  await new Log({ content: req.baseUrl }).save()
})

//Routes
app.use('/auth', user)
app.use('/game', game)

app.use(express.static('tests'))

app.listen(PORT, () => console.log(`Listening on port [ ${PORT} ]`))