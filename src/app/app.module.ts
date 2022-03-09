import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EntranceComponent } from './entrance/entrance.component';
import { LoginComponent } from './entrance/login/login.component';
import { SignupComponent } from './entrance/signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IonicModule } from '@ionic/angular';
import { HomeComponent } from './dashboard/home/home.component';
import { BalanceChartComponent } from './dashboard/home/balance-chart/balance-chart.component';
import { TransactionsComponent } from './dashboard/home/transactions/transactions.component';
import { CardComponent } from './dashboard/home/card/card.component';
import { AccountDetailComponent } from './dashboard/home/account-detail/account-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    EntranceComponent,
    LoginComponent,
    SignupComponent,
    DashboardComponent,
    HomeComponent,
    BalanceChartComponent,
    TransactionsComponent,
    CardComponent,
    AccountDetailComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    IonicModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
