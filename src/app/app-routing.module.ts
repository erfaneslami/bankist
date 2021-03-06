import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './dashboard/home/home.component';
import { TransferComponent } from './dashboard/transfer/transfer.component';
import { AddcartComponent } from './entrance/addcart/addcart.component';
import { EntranceComponent } from './entrance/entrance.component';
import { LoginComponent } from './entrance/login/login.component';
import { SignupComponent } from './entrance/signup/signup.component';

const routes: Routes = [
  {
    path: '',
    component: EntranceComponent,
    children: [
      { path: '', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
      { path: 'signup/add-card', component: AddcartComponent },
    ],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'transfer', component: TransferComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
