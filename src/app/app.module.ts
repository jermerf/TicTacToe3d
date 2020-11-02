import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'

import { AppComponent } from './app.component';
import { GameviewComponent } from './game/gameview.component';
import { LoginComponent } from './login/login.component';
import { GamechooserComponent } from './gamechooser/gamechooser.component';
import { ChatComponent } from './chat/chat.component';

@NgModule({
  declarations: [
    AppComponent,
    GameviewComponent,
    LoginComponent,
    GamechooserComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
