import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  errorMessage: string = null;
  user = new BehaviorSubject<User>(null);

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      fullName: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.minLength(6),
        Validators.required,
      ]),
    });

    this.email;
  }

  get email() {
    return this.signupForm.get('email');
  }
  get password() {
    return this.signupForm.get('password');
  }

  onSignup() {
    console.log(this.signupForm);
    if (!this.signupForm.valid) {
      this.signupForm.markAllAsTouched();
      return;
    }
    const form = this.signupForm.value;
    this.authService.signup(form.email, form.password).subscribe({
      next: (response) => {
        const newUser = new User(
          form.fullName,
          response.email,
          response.localId,
          [],
          response.idToken,
          new Date(
            new Date().getTime() +
              new Date(+response.expiresIn * 1000).getTime()
          )
        );

        this.user.next(newUser);
      },
      error: (errorMessage) => {
        console.log(errorMessage);
        this.errorMessage = errorMessage;
      },
    });
  }
}
