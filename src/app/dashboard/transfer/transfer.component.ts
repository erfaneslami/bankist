import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  errorMessage = null;

  ngOnInit(): void {
    this.transferForm = new FormGroup({
      receiverCard: new FormControl(null, [
        Validators.required,
        Validators.minLength(16),
        Validators.maxLength(16),
      ]),
      transferAmount: new FormControl(null, [
        Validators.required,
        Validators.min(1),
      ]),
      transferDesc: new FormControl(null),
    });
  }

  get card() {
    return this.transferForm.get('receiverCard');
  }
  get amount() {
    return this.transferForm.get('transferAmount');
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
          this.errorMessage = error.message;
        },
      });
  }
}
