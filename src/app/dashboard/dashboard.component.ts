import { Component, OnInit } from '@angular/core';
import { AuthService } from '../entrance/auth.service';
import { User } from '../entrance/models/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
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
