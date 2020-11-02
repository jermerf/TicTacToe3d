import { environment } from 'src/environments/environment';
import Axios from 'axios'
import { GameService } from './game.service';

const SERVER_URL = (environment.production
  ? "/api"
  : "/")

const ajax = Axios.create({ baseURL: SERVER_URL })

var socket = null
var game: GameService = null

async function $get(url, dataToSend?) {
  let res = await ajax.get(url, { params: dataToSend })
  return res.data
}

async function $post(url, dataToSend?) {
  let res = await ajax.post(url, dataToSend)
  return res.data
}

async function send(obj) {
  let sock = await getSocket()
  sock.send(JSON.stringify(obj))
}

function setGameService(gameService) {
  game = gameService
}

async function getSocket() {
  if (!socket) {
    await initSocket()
  }
  return socket
}

function initSocket() {
  if (environment.production) {
    socket = new WebSocket(`wss://${location.host}/socket`)
  } else {
    socket = new WebSocket(`ws://${location.host}/socket`)
  }
  socket.addEventListener('close', () => {
    console.log(`SOCKET CLOSED ***---___`)
    socket = null
    game.backToLobby()
  })
  socket.addEventListener('message', message => {
    console.log("Socket says", message.data)
    let data = JSON.parse(message.data)

    switch (data.action) {
      case "gameNotFound":
        game.backToLobby()
        break
      case "gameFull":
        game.backToLobby()
        break
      case "joinedGame":
        game.joinedGame(data.gameId)
        break
      case "playerLetter":
        game.setLetter(data.letter)
        break
      case "board":
        game.setBoard(data.board)
        break
      case "yourTurn":
        game.myTurn()
        break
      case "notYourTurn":
        break
      case "invalidMove":
        break
      case "gameOver":
        game.gameOver(data.winner, data.winCombo)
        break
      case "chat":
        break
    }
  })
  return new Promise(resolve => socket.addEventListener('open', resolve))
}

const server = {
  $get, $post, send, setGameService
}
window['server'] = server
export default server