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
import { Movements } from './models/movement.model';
import { User } from './models/user.model';
import * as moment from 'moment';

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
  token = new BehaviorSubject<string>(null);
  isLoading = new Subject<boolean>();
  isSignup = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  signup(email: string, password: string, fullName: string) {
    this.isLoading.next(true);

    return this.http
      .post<AuthResponseData>(`${this.SIGNUP_URL + this.API_KEY}`, {
        email: email,
        password: password,
        returnSecureToken: true,
      })
      .pipe(
        catchError((error) => {
          this.isLoading.next(false);

          return this.handleError(error);
        }),
        tap((response) => {
          console.log(fullName);
          this.handleSignup(
            fullName,
            response.email,
            response.localId,
            {},
            [
              new Movements(
                'initial bank',
                moment().format(),
                'Deposit',
                50000
              ),
            ],
            50000,
            response.idToken,
            +response.expiresIn
          );
        })
      );
  }

  private handleSignup(
    fullName: string,
    email: string,
    id: string,
    card,
    movements: Movements[],
    balance,
    token: string,
    expiresIn: number
  ) {
    const expireDate = new Date(new Date().getTime() + expiresIn * 1000);

    this.http
      .put(
        `https://bankist-api-default-rtdb.asia-southeast1.firebasedatabase.app/users/${id}.json`,
        {
          fullName,
          email,
          id,
          card,
          movements,
          balance,
        }
      )
      .subscribe({
        next: (response) => {
          console.log(response);
          const newUser = new User(
            fullName,
            email,
            id,
            card,
            movements,
            balance,
            token,
            expireDate
          );
          this.user.next(newUser);
          this.isLoading.next(false);
          this.router.navigate(['/signup/add-card']);
          this.isSignup.next(true);
        },
      });
  }

  login(email: string, password: string) {
    this.isLoading.next(true);

    return this.http
      .post<AuthResponseData>(`${this.LOGIN_URL + this.API_KEY} `, {
        email: email,
        password: password,
        returnSecureToken: true,
      })
      .pipe(
        catchError((error) => {
          this.isLoading.next(false);

          return this.handleError(error);
        }),
        tap((response) => {
          // this.isLoading.next(true);
          this.token.next(response.idToken);
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
      .get<{ balance; card; email; fullName; id; movements }>(
        `https://bankist-api-default-rtdb.asia-southeast1.firebasedatabase.app/users/${id}.json`
      )
      .subscribe({
        next: (responseData) => {
          console.log(responseData);

          const newUser = new User(
            responseData.fullName,
            responseData.email,
            responseData.id,
            responseData.card,
            responseData.movements,
            responseData.balance,
            token,
            expireDate
          );

          this.user.next(newUser);
          localStorage.setItem('userState', JSON.stringify(newUser));
          this.isLoading.next(false);
          this.router.navigate(['/dashboard']);
        },
      });
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => {
      console.log(error);
      if (!error.error || !error.error.error) {
        this.errorMessage = 'something went wrong please try again!';
      }
      switch (error?.error?.error?.message) {
        case 'EMAIL_EXISTS':
          this.errorMessage =
            'this email is Already available, try Login or rest password';
          break;
        case 'EMAIL_NOT_FOUND':
          this.errorMessage = 'Wrong Username or Password !';
          break;
        case 'INVALID_PASSWORD':
          this.errorMessage = 'Wrong Username or Password !';
          break;
      }

      return this.errorMessage;
    });
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/']);
    localStorage.clear();
  }

  autoLogin() {
    const userState = JSON.parse(localStorage.getItem('userState'));
    if (!userState) return;
    console.log(userState);
    const newUser = new User(
      userState.name,
      userState.email,
      userState.id,
      userState.card,
      userState.movements,
      userState.balance,
      userState._token,
      new Date(userState._expireDate)
    );

    if (!newUser.token) return;

    this.token.next(userState._token);
    this.user.next(newUser);
  }
}
