import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exhaustMap, Observable, take } from 'rxjs';
import { AuthService } from '../entrance/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.authService.token.pipe(
      take(1),
      exhaustMap((token) => {
        if (!token) {
          console.log('no user');
          return next.handle(req);
        }
        const modifiedReq = req.clone({
          params: new HttpParams().set('auth', token),
        });
        return next.handle(modifiedReq);
      })
    );
  }
}
