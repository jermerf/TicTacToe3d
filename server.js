require('dotenv').config()
const path = require('path')
const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const database = require('./modules/database.js')
const Log = require('./model/Log.js')
const socketServer = require('./modules/socket-server.js')

const user = require('./routers/user.js')
const game = require('./routers/game.js')

const PORT = process.env.PORT || 3000

var app = express()
var server = http.createServer(app)
socketServer(server)

if (process.env.NODE_ENV != 'production') {
  console.log(`DEV: Using cors()`)
  app.use(require('cors')())
}

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

if (process.env.NODE_ENV == 'production') {
  app.use(express.static('tests'))
} else {
  app.use(express.static(path.join(__dirname, 'dist')))
}

server.listen(PORT, () => console.log(`Listening on port [ ${PORT} ]`))