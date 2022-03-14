import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss'],
})
export class TransferComponent implements OnInit {
  constructor() {}
  transferForm: FormGroup;

  ngOnInit(): void {
    this.transferForm = new FormGroup({
      receiverCard: new FormControl(null),
      transferAmount: new FormControl(null),
    });
  }

  onTransfer() {
    if (!this.transferForm.valid) {
      this.transferForm.markAllAsTouched();
      return;
    }
  }
}
