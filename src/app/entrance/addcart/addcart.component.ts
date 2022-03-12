import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-addcart',
  templateUrl: './addcart.component.html',
  styleUrls: ['./addcart.component.scss'],
})
export class AddcartComponent implements OnInit {
  cardForm: FormGroup;
  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.cardForm = new FormGroup({
      ownerName: new FormControl(null, [Validators.required]),
      cardNumber: new FormControl(null, [
        Validators.required,
        Validators.minLength(12),
        Validators.maxLength(12),
      ]),
      cvv2: new FormControl(null, Validators.required),
      exp: new FormControl(null, [
        Validators.required,
        Validators.pattern('[0-9][0-9]/[0-9][0-9]'),
      ]),
    });
  }

  onSubmit() {
    const form = this.cardForm.value;
    this.userService.addCard(
      form.ownerName,
      form.cardNumber,
      form.cvv2,
      form.exp
    );

    this.router.navigate(['/dashboard']);
  }
}
