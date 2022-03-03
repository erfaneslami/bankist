import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EntranceComponent } from './entrance/entrance.component';
import { LoginComponent } from './entrance/login/login.component';
import { SignupComponent } from './entrance/signup/signup.component';

@NgModule({
  declarations: [
    AppComponent,
    EntranceComponent,
    LoginComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
