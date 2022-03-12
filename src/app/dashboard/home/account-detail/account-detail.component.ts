import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/entrance/auth.service';
import { User } from 'src/app/entrance/models/user.model';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.scss'],
})
export class AccountDetailComponent implements OnInit {
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
