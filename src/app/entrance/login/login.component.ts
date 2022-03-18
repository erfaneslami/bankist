import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = null;
  isLoading = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.email, Validators.required]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
    });

    this.authService.isLoading.subscribe({
      next: (isLoading) => {
        this.isLoading = isLoading;
      },
    });
  }

  get password() {
    return this.loginForm.get('password');
  }

  get email() {
    return this.loginForm.get('email');
  }

  onLogin() {
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    // this.isLoading = true;
    const form = this.loginForm.value;

    this.authService.login(form.email, form.password).subscribe({
      next: (response) => {
        // this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error;
      },
    });
  }
}
