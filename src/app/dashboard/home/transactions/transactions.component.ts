import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/entrance/auth.service';
import { User } from 'src/app/entrance/models/user.model';
import * as moment from 'moment';
import { Subscription, take } from 'rxjs';
import { UserService } from 'src/app/entrance/user.service';
@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit, OnDestroy {
  user: User;
  moment = moment; // TODO use pipe
  userSub: Subscription;
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userSub = this.authService.user.pipe(take(1)).subscribe({
      next: (user) => {
        this.user = user;
      },
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
