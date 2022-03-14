import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/entrance/auth.service';
import { User } from 'src/app/entrance/models/user.model';
import * as moment from 'moment';
import { take } from 'rxjs';
import { UserService } from 'src/app/entrance/user.service';
@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
  user: User;
  moment = moment; // TODO use pipe
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.authService.user.pipe(take(1)).subscribe({
      next: (user) => {
        this.user = user;
      },
    });
  }
}
