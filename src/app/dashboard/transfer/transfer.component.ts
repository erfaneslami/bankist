import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserService } from 'src/app/entrance/user.service';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss'],
})
export class TransferComponent implements OnInit {
  constructor(private userService: UserService) {}
  transferForm: FormGroup;

  ngOnInit(): void {
    this.transferForm = new FormGroup({
      receiverCard: new FormControl(null),
      transferAmount: new FormControl(null),
      transferDesc: new FormControl(null),
    });
  }

  onTransfer() {
    const form = this.transferForm.value;
    if (!this.transferForm.valid) {
      this.transferForm.markAllAsTouched();
      return;
    }
    this.userService.transfer(
      form.receiverCard,
      form.transferAmount,
      form.transferDesc
    );
  }
}
