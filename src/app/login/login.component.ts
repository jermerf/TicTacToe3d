import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { GameMode, GameService } from '../game.service';
import server from '../server'

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  showRegistration = false
  formUsername = ""
  formPassword = ""
  loggedIn = false
  loginChecked = false
  username = ""

  //dev
  modeName

  constructor(private game: GameService) { }

  async register() {
    let { formUsername, formPassword } = this
    let res = await server.$post("/auth/register", {
      username: formUsername,
      password: formPassword
    })
    if (res.success) {
      this.game.loggedIn(res.username, res.gameInProgress)
    } else {
      console.log(`Registration Failed`, res)
    }
  }

  async login() {
    let { formUsername, formPassword } = this
    let res = await server.$post("/auth/login", {
      username: formUsername,
      password: formPassword
    })
    if (res.success) {
      this.game.loggedIn(res.username, res.gameInProgress)
    } else {
      console.log(`Login Failed`, res)
    }
  }
  async logout() {
    let res = await server.$post("/auth/logout")
    if (res.success) {
      this.game.logout()
    }
  }

  async ngOnInit() {
    this.game.mode.subscribe((mode: GameMode) => {
      this.loggedIn = (mode !== GameMode.LOGGED_OUT)
      // devonly
      this.modeName = GameMode[mode]
    })
    this.game.username.subscribe(username => this.username = username)

    // Check if logged in
    let res = await server.$get("/auth/check")
    if (res.success) {
      this.game.loggedIn(res.username, res.gameInProgress)
    } else {
      console.log(`Login check false`, res)
    }
    this.loginChecked = true
  }

}
