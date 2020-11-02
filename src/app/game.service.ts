import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'
import server from './server'

export enum GameMode {
  LOGGED_OUT, LOBBY, PLAYER_WAITING, PLAYER_PLAYING, OBSERVER
}

const DEFAULT_USERNAME = " - not logged in -"
@Injectable({
  providedIn: 'root'
})
export class GameService {
  private currentMode = new BehaviorSubject(GameMode.LOGGED_OUT)
  private currentUsername = new BehaviorSubject(DEFAULT_USERNAME)
  private currentBoard = new BehaviorSubject('---------')
  private currentLetter = new BehaviorSubject('-')
  private currentWinner = new BehaviorSubject('-')
  private currentWinCombo = new BehaviorSubject(-1)
  mode = this.currentMode.asObservable()
  username = this.currentUsername.asObservable()
  board = this.currentBoard.asObservable()
  letter = this.currentLetter.asObservable()
  winner = this.currentWinner.asObservable()
  winCombo = this.currentWinCombo.asObservable()

  gameId = null

  constructor() {
    server.setGameService(this)
  }

  loggedIn(username, gameInProgress) {
    console.log(`LOGGED IN AS ${username}`)

    this.currentUsername.next(username)
    if (gameInProgress) {
      this.rejoinGame()
    } else {
      this.backToLobby()
    }
  }
  logout() {
    console.log(`LOGGED OUT`)

    this.currentUsername.next(DEFAULT_USERNAME)
    this.currentMode.next(GameMode.LOGGED_OUT)
  }

  setLetter(letter) {
    this.currentLetter.next(letter)
  }

  backToLobby() {
    this.currentMode.next(GameMode.LOBBY)
  }

  joinGame(gameId) {
    server.send({ action: 'joinGame', gameId })
  }

  joinedGame(gameId) {
    this.gameId = gameId
    this.currentMode.next(GameMode.PLAYER_WAITING)
  }

  rejoinGame() {
    this.currentMode.next(GameMode.PLAYER_WAITING)
    server.send({ action: 'rejoinGame' })
  }

  observeGame(gameId) {
    this.gameId = gameId
    this.currentMode.next(GameMode.OBSERVER)
    server.send({ action: 'observeGame', gameId })
  }

  setBoard(board) {
    this.currentBoard.next(board)
  }

  myTurn() {
    this.currentMode.next(GameMode.PLAYER_PLAYING)
  }

  playAt(position) {
    server.send({ action: "play", position })
  }

  gameOver(winner, winCombo) {
    this.currentWinner.next(winner)
    this.currentWinCombo.next(winCombo)
  }

}

