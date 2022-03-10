import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  errorMessage: string = null;

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
    const form = this.signupForm.value;
    this.authService.signup(form.email, form.password).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
        this.errorMessage = error.error.error.message;
      },
    });
  }
}
