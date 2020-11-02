import { Engine } from './engine'
import Board from './Board.js'
import { GameMode, GameService } from 'src/app/game.service'
import SelectGrid from './SelectGrid'
import WinLine from './WinLine'

export default class Game {
  service: GameService
  engine: Engine
  boardModel: Board = new Board()
  winLine: WinLine = new WinLine()
  selectGrid: SelectGrid = null
  board = "---------"

  constructor(service: GameService, canvas) {
    this.service = service
    this.engine = new Engine(canvas)
    this.selectGrid = new SelectGrid(this.engine.camera)
    this.add(this.boardModel)
    this.add(this.winLine)
    this.add(this.selectGrid)
    service.mode.subscribe(mode => {
      this.boardModel.setMode(mode)
      switch (mode) {
        case GameMode.LOBBY:
          this.winLine.hide()
          break
        case GameMode.PLAYER_PLAYING:
          this.selectGrid.show(this.board)
          break
      }
    })
    service.board.subscribe(board => {
      this.board = board
      this.boardModel.setBoard(board)
    })
    service.winCombo.subscribe(combo => {
      if (combo >= 0) this.winLine.show(combo)
      else this.winLine.hide()
    })

    this.selectGrid.onSelect(position => {
      service.playAt(position)
    })
  }

  add(mesh, animated = true) {
    this.engine.add(mesh, animated)
  }

}
