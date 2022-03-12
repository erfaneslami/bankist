import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/entrance/auth.service';
import { User } from 'src/app/entrance/models/user.model';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
  user: User;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user.subscribe({
      next: (user) => {
        this.user = user;
      },
    });
  }
}
