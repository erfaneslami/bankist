import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-entrance',
  templateUrl: './entrance.component.html',
  styleUrls: ['./entrance.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EntranceComponent implements OnInit {
  isLoading = false;
  isSignup = false;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.isLoading.subscribe({
      next: (isLoading) => {
        this.isLoading = isLoading;
      },
    });

    this.authService.isSignup.subscribe({
      next: (isSignup) => {
        console.log(isSignup);
        this.isSignup = isSignup;
      },
    });
  }
}
