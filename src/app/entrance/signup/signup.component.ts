import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      fullName: new FormControl(null),
      email: new FormControl(null),
      password: new FormControl(null),
    });
  }

  onSignup() {
    console.log(this.signupForm.value);
    const form = this.signupForm.value;
    this.authService.signup(form.email, form.password).subscribe((response) => {
      console.log(response);
    });
  }
}
