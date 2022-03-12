import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';
import { AuthService } from './auth.service';
import { Card } from './models/card.model';
import { User } from './models/user.model';

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
            `https://bankist-api-default-rtdb.asia-southeast1.firebasedatabase.app/users/${user.id}/${user.DBuserId}/card.json`,
            { ownerName, cardNumber, cvv2, exp }
          )
          .subscribe();

        console.log(user);
        this.newUser = new User(
          user.name,
          user.email,
          user.id,
          user.DBuserId,
          { ownerName, cardNumber, cvv2, exp },
          null,
          user.token,
          user.expireDate
        );
      },
    });

    this.authService.user.next(this.newUser);
  }
}
