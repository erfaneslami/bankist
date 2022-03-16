import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Injectable } from '@angular/core';

import { catchError, take, tap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { Card } from './models/card.model';
import { Movements } from './models/movement.model';
import { User } from './models/user.model';
import * as moment from 'moment';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  newUser;
  constructor(private http: HttpClient, private authService: AuthService) {}

  addCard(ownerName, cardNumber, cvv2, exp) {
    this.authService.user.pipe(take(1)).subscribe({
      next: (user) => {
        this.http
          .put(
            `https://bankist-api-default-rtdb.asia-southeast1.firebasedatabase.app/users/${user.id}/card.json`,
            // { ownerName, cardNumber, cvv2, exp }
            new Card(ownerName, cardNumber, cvv2, exp)
          )
          .subscribe();

        console.log(user);
        this.newUser = new User(
          user.name,
          user.email,
          user.id,
          new Card(ownerName, cardNumber, cvv2, exp),
          user.movements,
          user.balance,
          user.token,
          user.expireDate
        );
      },
    });

    this.authService.user.next(this.newUser);
  }

  getIncome() {
    let income: number;
    this.authService.user.pipe(take(1)).subscribe({
      next: (user) => {
        if (!user.movements) {
          income = 0;
          return;
        }
        income = user.movements
          ?.map((move) => move.amount)
          .filter((amount) => amount > 0)
          .reduce((sum, income) => {
            return sum + income;
          }, 0);
      },
    });
    return income;
  }

  getExpense() {
    let expense: number;
    this.authService.user.pipe(take(1)).subscribe({
      next: (user) => {
        if (!user.movements) {
          expense = 0;
          return;
        }
        expense = user.movements
          ?.map((move) => move.amount)
          .filter((amount) => amount < 0)
          .reduce((sum, expense) => {
            return sum + expense;
          }, 0);
      },
    });
    return expense;
  }

  transfer(cardNumber, amount, description) {
    let balance;
    this.authService.user.pipe(take(1)).subscribe({
      next: (user) => (balance = user.balance),
    });
    return this.http
      .get(
        `https://bankist-api-default-rtdb.asia-southeast1.firebasedatabase.app/users.json?orderBy="card/cardNumber"&equalTo=${+cardNumber}`
      )
      .pipe(
        tap((response) => {
          if (Object.keys(response).length === 0) {
            console.log('tes');
            throw new Error('wrong card number');
          }

          if (balance < amount) {
            throw new Error('Balance is not enough');
          }
          this.submitWithdrawal(description, amount);
          Object.entries(response).map(([_, value]) => {
            this.submitDeposit(description, amount, value);
          });
        }),
        catchError((error) => {
          return throwError(() => {
            console.log(error);
            return error;
          });
        })
      );
  }

  submitDeposit(description, amount, user) {
    user.movements.push(
      new Movements(description, moment().format(), 'Deposit', amount)
    );

    user.balance = user.movements
      .map((mov) => mov.amount)
      .reduce((sum, amount) => sum + amount, 0);

    this.http
      .put(
        `https://bankist-api-default-rtdb.asia-southeast1.firebasedatabase.app/users/${user.id}/movements.json`,
        user.movements
      )
      .subscribe();

    this.http
      .patch(
        `https://bankist-api-default-rtdb.asia-southeast1.firebasedatabase.app/users/${user.id}.json`,
        { balance: user.balance }
      )
      .subscribe();
  }

  submitWithdrawal(description: string, amount: number) {
    this.authService.user.pipe(take(1)).subscribe({
      next: (user) => {
        user.movements.push(
          new Movements(description, moment().format(), 'Withdrawal', -amount)
        );

        user.balance = user.movements
          .map((mov) => mov.amount)
          .reduce((sum, amount) => sum + amount, 0);

        this.http
          .put(
            `https://bankist-api-default-rtdb.asia-southeast1.firebasedatabase.app/users/${user.id}/movements.json`,
            user.movements
          )
          .subscribe();

        this.http
          .patch(
            `https://bankist-api-default-rtdb.asia-southeast1.firebasedatabase.app/users/${user.id}.json`,
            { balance: user.balance }
          )
          .subscribe();
      },
    });
  }
}
