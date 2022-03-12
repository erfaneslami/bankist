import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Card } from './models/card.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  addCard(ownerName, cardNumber, cvv2, exp) {
    this.authService.user.subscribe({
      next: (user) => {
        this.http
          .put(
            `https://bankist-api-default-rtdb.asia-southeast1.firebasedatabase.app/users/${user.id}/${user.DBuserId}/card.json`,
            { ownerName, cardNumber, cvv2, exp }
          )
          .subscribe();
        console.log(user);
      },
    });
  }
}
