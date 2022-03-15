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
  isLoading = false;

  ngOnInit(): void {
    this.transferForm = new FormGroup({
      receiverCard: new FormControl(null),
      transferAmount: new FormControl(null),
      transferDesc: new FormControl(null),
    });
  }

  onTransfer() {
    this.isLoading = true;
    const form = this.transferForm.value;
    if (!this.transferForm.valid) {
      this.transferForm.markAllAsTouched();
      this.isLoading = false;
      return;
    }
    this.userService
      .transfer(form.receiverCard, form.transferAmount, form.transferDesc)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          console.log(error);
        },
      });
  }
}
