import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { GameService, GameMode } from '../game.service';
import Game from './tictactoe/Game'

@Component({
  selector: 'gameview',
  templateUrl: './gameview.component.html',
  styleUrls: ['./gameview.component.scss']
})
export class GameviewComponent implements OnInit, AfterViewInit {
  @ViewChild('threecan') canvas: ElementRef;
  game = null
  status = ""
  mode = GameMode.LOGGED_OUT
  loggedIn = false
  inGame = false
  started = false


  constructor(private gameService: GameService) {
    window['game'] = this
  }

  modeChanged(mode: GameMode) {
    this.loggedIn = true
    this.mode = mode
    switch (mode) {
      case GameMode.LOGGED_OUT:
        this.loggedIn = false
        this.inGame = false
        break
      case GameMode.LOBBY:
        this.inGame = false
        break
      case GameMode.PLAYER_PLAYING:
        this.status = "Your turn"
      case GameMode.PLAYER_WAITING:
      case GameMode.OBSERVER:
        this.inGame = true
        break
    }
  }

  ngOnInit() {
    this.gameService.mode.subscribe(mode => {
      this.mode = mode
      this.modeChanged(mode)
    })
    this.gameService.letter.subscribe(letter => {
      this.started = (letter != '-')
    })
  }
  ngAfterViewInit() {
    this.game = new Game(this.gameService, this.canvas.nativeElement)
  }

}
