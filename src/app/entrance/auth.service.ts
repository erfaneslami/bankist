import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  map,
  Subject,
  tap,
  throwError,
} from 'rxjs';
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
  isLoading = new Subject<boolean>();
  isSignup = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

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
          this.isLoading.next(true);

          console.log(fullName);
          this.handleSignup(
            fullName,
            response.email,
            response.localId,
            {},
            response.idToken,
            +response.expiresIn
          );
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(`${this.LOGIN_URL + this.API_KEY} `, {
        email: email,
        password: password,
        returnSecureToken: true,
      })
      .pipe(
        catchError((error) => {
          return this.handleError(error);
        }),
        tap((response) => {
          this.isLoading.next(true);
          this.handleLogin(
            response.localId,
            response.idToken,
            +response.expiresIn
          );
        })
      );
  }

  private handleLogin(id: string, token: string, expiresIn: number) {
    const expireDate = new Date(new Date().getTime() + expiresIn * 1000);

    this.http
      .get(
        `https://bankist-api-default-rtdb.asia-southeast1.firebasedatabase.app/users/${id}.json`
      )
      .subscribe({
        next: (responseData) => {
          Object.entries(responseData).map(([key, value]) => {
            console.log(value);

            const newUser = new User(
              value.fullName,
              value.email,
              value.id,
              key,
              value.card,
              token,
              expireDate
            );

            this.user.next(newUser);

            this.isLoading.next(false);
          });
        },
      });
  }

  private handleSignup(
    fullName: string,
    email: string,
    id: string,
    card,
    token: string,
    expiresIn: number
  ) {
    const expireDate = new Date(new Date().getTime() + expiresIn * 1000);

    this.http
      .post(
        `https://bankist-api-default-rtdb.asia-southeast1.firebasedatabase.app/users/${id}.json`,
        {
          fullName,
          email,
          id,
          card,
        }
      )
      .subscribe({
        next: (response) => {
          Object.entries(response).map(([key, value]) => {
            const newUser = new User(
              fullName,
              email,
              id,
              value,
              card,
              token,
              expireDate
            );
            this.user.next(newUser);
            this.isLoading.next(false);
            this.router.navigate(['/signup/add-card']);
            this.isSignup.next(true);
          });
        },
      });
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

  submitUser(id) {}
}
