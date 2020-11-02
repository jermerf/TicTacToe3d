const ws = require('ws')
const cookie = require('cookie')

const Client = require('./socket/Client')
const GameManager = require('./socket/GameManager')
const { getUserForJwt } = require('./auth')

var wss = new ws.Server({ noServer: true, path: '/socket' })

function setup(server) {

  wss.on('connection', socket => {
    console.log(`New socket connected`)

    let client = new Client(socket)

    client.on('createGame', data => {
      GameManager.create(data.name, client)
    })

    client.on('joinGame', data => {
      GameManager.join(data.gameId, client)
    })

    client.on('rejoinGame', data => {
      GameManager.rejoin(client)
    })

    client.on('observeGame', data => {
      let { gameId } = data
      GameManager.observe(gameId, client)
    })

  })

  server.on("upgrade", async (req, socket, head) => {
    try {
      if (!req.headers.cookie) throw new Error("no auth token")
      let cookies = cookie.parse(req.headers.cookie)
      if (!cookies.jwt) throw new Error("no auth token")
      let user = await getUserForJwt(cookies.jwt)
      wss.handleUpgrade(req, socket, head, ws => {
        ws.user = user
        wss.emit('connection', ws, req);
      })
    } catch (err) {
      console.log("upgrade exception", err)
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n")
      socket.destroy()
      return;
    }
  })

}

module.exports = setup