import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

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
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { AddcartComponent } from './entrance/addcart/addcart.component';
import { AuthService } from './entrance/auth.service';
import { TransferComponent } from './dashboard/transfer/transfer.component';
import { AuthInterceptor } from './services/auth.interceptor.service';

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
    LoadingSpinnerComponent,
    AddcartComponent,
    TransferComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    IonicModule.forRoot(),
  ],
  providers: [
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
