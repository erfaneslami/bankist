import {
  ChangeDetectorRef,
  Component,
  DoCheck,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { AuthService } from '../entrance/auth.service';
import { User } from '../entrance/models/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, DoCheck {
  user: User;
  constructor(
    private authService: AuthService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.authService.user.subscribe({
      next: (user) => {
        this.user = user;
        this.cd.detectChanges();
        console.log('test');
      },
    });
  }
  ngDoCheck(): void {}
}
