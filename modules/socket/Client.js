const clients = []

const TYPES = {
  player: "Player",
  observer: "Observer"
}

class SocketClient {
  socket = null
  type = TYPES.observer
  handlers = {}
  user = null

  constructor(socket) {
    this.socket = socket
    this.user = socket.user
    socket.on('message', msg => {
      this.gotMessage(msg)
    })
    socket.on('close', () => this.socketClosed(socket))
    clients.push(this)
  }

  send(obj) {
    this.socket.send(JSON.stringify(obj))
  }

  gotMessage(message) {
    var data = JSON.parse(message)
    var handler = this.handlers[data.action]
    if (handler) {
      for (var l of handler.listeners) {
        l(data)
      }
    }
  }

  on(msgType, callback) {
    let handler = this.handlers[msgType]
    if (!handler) {
      handler = { msgType, listeners: [] }
      this.handlers[msgType] = handler
    }
    handler.listeners.push(callback)
  }

  socketClosed(socket) {
    // TODO make this allow the user to reconnect within 30s
    var clientIndex = clients.indexOf(clients.find(c => c.socket == socket))
    clients.splice(clientIndex, 1)
  }
}

module.exports = SocketClient