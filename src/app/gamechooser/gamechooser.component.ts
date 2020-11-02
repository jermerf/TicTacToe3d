import { Component, OnInit } from '@angular/core';
import { GameMode, GameService } from '../game.service';
import server from '../server';

const REFRESH_INTERVAL = 3000

@Component({
  selector: 'gamechooser',
  templateUrl: './gamechooser.component.html',
  styleUrls: ['./gamechooser.component.scss']
})
export class GamechooserComponent implements OnInit {
  games = []
  error = null
  showNewGame = false
  newGameName = ""
  joiningGame = false
  private refresherHandle = null

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.gameService.mode.subscribe(mode => {
      if (mode == GameMode.LOBBY) {
        this.refreshGames()
        this.startRefresher()
      } else {
        this.stopRefresher()
      }
    })
  }

  createGame() {
    server.send({
      action: 'createGame',
      name: this.newGameName
    })
  }

  joinGame(gameId) {
    this.joiningGame = true
    server.send({
      action: 'joinGame',
      gameId
    })
  }


  toggleNewGame() {
    this.showNewGame = !this.showNewGame
    if (this.showNewGame) {
      this.stopRefresher()
      setTimeout(() => {
        (document.querySelector('input#newGame') as HTMLInputElement).focus()
      }, 50)
    } else {
      this.startRefresher()
    }
  }

  startRefresher() {
    this.refresherHandle = setInterval(() => this.refreshGames(), REFRESH_INTERVAL)
  }
  stopRefresher() {
    clearInterval(this.refresherHandle)
  }

  async refreshGames() {
    this.games = await server.$get('/game')
  }

}
