import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  API_KEY = 'AIzaSyDcloVBMNtVEejTLfNVLRiJbKKWUfjgUmI';
  SIGNUP_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=';
  LOGIN_URL =
    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=';
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
          return this.handleError(error);
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post(`${this.LOGIN_URL + this.API_KEY} `, {
        email: email,
        password: password,
        returnSecureToken: true,
      })
      .pipe(
        catchError((error) => {
          return this.handleError(error);
        })
      );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => {
      if (!error.error || !error.error.error) {
        this.errorMessage = 'something went wrong please try again!';
      }
      switch (error?.error?.error?.message) {
        case 'EMAIL_EXISTS':
          this.errorMessage =
            'this email is Already available, try Login or rest password';
          console.log(this.errorMessage);
      }

      return this.errorMessage;
    });
  }
}
