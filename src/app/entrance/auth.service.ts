import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { User } from './models/user.model';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  API_KEY = 'AIzaSyDcloVBMNtVEejTLfNVLRiJbKKWUfjgUmI';
  SIGNUP_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=';
  LOGIN_URL =
    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=';
  errorMessage;
  user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient) {}

  signup(email: string, password: string, fullName: string) {
    return this.http
      .post<AuthResponseData>(`${this.SIGNUP_URL + this.API_KEY}`, {
        email: email,
        password: password,
        returnSecureToken: true,
      })
      .pipe(
        catchError((error) => {
          return this.handleError(error);
        }),
        tap((response) => {
          console.log(fullName);
          this.handleSignup(
            fullName,
            response.email,
            response.localId,
            {
              name: 'null',
              number: 'null',
              cvv2: 'null',
              exp: 'null',
            },
            response.idToken,
            +response.expiresIn
          );
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

  private handleSignup(
    fullName: string,
    email: string,
    id: string,
    cards,
    token: string,
    expiresIn: number
  ) {
    const expireDate = new Date(new Date().getTime() + expiresIn * 1000);
    const newUser = new User(fullName, email, id, cards, token, expireDate);
    this.user.next(newUser);

    this.http
      .post(
        `https://bankist-api-default-rtdb.asia-southeast1.firebasedatabase.app/users/${id}.json`,
        {
          fullName,
          email,
          id,
          cards,
        }
      )
      .subscribe();
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
