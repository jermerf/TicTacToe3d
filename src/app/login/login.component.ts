import { Component, OnInit } from '@angular/core';
import ajax from '../ajax'

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  ajax = ajax

  showRegistration = false
  username = ""
  password = ""

  constructor() { }

  register() {
    let { username, password } = this
    this.ajax.post("/auth/register", {
      username, password
    })
  }

  login() {

  }

  ngOnInit(): void {
  }

}
