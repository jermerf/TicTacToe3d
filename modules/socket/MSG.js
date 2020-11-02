module.exports = {
  gameNotFound: () => ({ action: 'gameNotFound' }),
  gameFull: () => ({ action: 'gameFull' }),
  joinedGame: (gameId) => ({ action: 'joinedGame', gameId }),
  playerLetter: (letter) => ({ action: 'playerLetter', letter }),
  yourTurn: () => ({ action: 'yourTurn' }),
  notYourTurn: () => ({ action: 'notYourTurn' }),
  invalidMove: () => ({ action: 'invalidMove' }),
  gameOver: (winner, winCombo) => ({ action: 'gameOver', winner, winCombo }),
  board: (board) => ({ action: 'board', board }),
  chat: (msg) => ({ action: 'chat', msg })
}