import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-addcart',
  templateUrl: './addcart.component.html',
  styleUrls: ['./addcart.component.scss'],
})
export class AddcartComponent implements OnInit {
  cardForm: FormGroup;
  constructor() {}

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

  onSubmit() {}
}
