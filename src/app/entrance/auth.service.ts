import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  API_KEY = 'AIzaSyDcloVBMNtVEejTLfNVLRiJbKKWUfjgUmI';
  SIGNUP_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=';
  errorMessage;
  constructor(private http: HttpClient) {}

  signup(email: string, password: string) {
    return this.http
      .post(`${this.SIGNUP_URL + this.API_KEY}`, {
        email: email,
        password: password,
        returnSecureToken: true,
      })
      .pipe(
        catchError((error) => {
          return throwError(() => {
            switch (error?.error?.error?.message) {
              case 'EMAIL_EXISTS':
                return (this.errorMessage =
                  'this email is Already available, try Login or rest password');
            }
            return this.errorMessage;
          });
        })
      );
  }
}
