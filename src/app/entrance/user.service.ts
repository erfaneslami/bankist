import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Card } from './models/card.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  addCard() {
    this.authService.user.subscribe({
      next: (user) => {
        console.log(user);
      },
    });
  }
}
