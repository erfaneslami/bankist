import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/entrance/auth.service';
import { User } from 'src/app/entrance/models/user.model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit, OnDestroy {
  user: User;
  userSub: Subscription;
  bankName: string;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe({
      next: (user) => {
        this.user = user;
      },
    });

    this.bankName =
      `${this.user.card.cardNumber}`.slice(0, 4) === `6219`
        ? `Saman`
        : `${this.user.card.cardNumber}`.slice(0, 4) === `5022`
        ? `Pasargad `
        : `${this.user.card.cardNumber}`.slice(0, 4) === `6037`
        ? `Saderat `
        : `un known Bank`;
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
