"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////

/////////////////////////////////////////////////
const labelBalanceHeader = document.querySelector(".header__balance_amount");
const labelBalanceSummery = document.querySelector(".balance-sammery__balance");
const labelBalanceDetail = document.querySelector(
  ".card-detail__value--balance"
);

const labelFullNameCard = document.querySelector(".card__owner");
const labelFullNameHeader = document.querySelector(
  ".header__profile_info_name"
);

const labelCardNumberCard = document.querySelector(".card__number");
const labelCardNumberDetail = document.querySelector(
  ".card-detail__value--card-number"
);

const labelBankName = document.querySelector(".card__bank-name");

const labelIncome = document.querySelector(".balance-sammery__income");
const labelExpense = document.querySelector(".balance-sammery__expense");

const containerTransaction = document.querySelector(".transaction__container");

// TODO
// const btnSort = document.querySelector(".sort");
// TODO
// const btnTransfer = document.querySelector(".operations__btn--transfer");
// TODO
// const btnClose = document.querySelector(".operations__btn--close");
// TODO
// const btnLoan = document.querySelector(".operations__btn--loan");
// TODO
// const inputTransferAccount = document.querySelector(
//   ".input--transfer-to-account"
// );
// TODO
// const inputTransferAmount = document.querySelector(".input--transfer-amount");
// TODO
// const inputCloseUsername = document.querySelector(".input--close-account");
// TODO
// const inputClosePin = document.querySelector(".input--close-pin");
// TODO
// const inputLoanAmount = document.querySelector(".input--loan-amount");
/////////////////////////////////////////////////

/////////////////////////////////////////////////
class App {
  #accounts = [];
  #currentUser;
  sorted;
  constructor() {
    this._getLocalStorage();
    this._getCurrentUser();
    this._updateUI(this.#currentUser);

    // EVENT HANDLERS
    //TODO
    // btnTransfer.addEventListener("click", this._transferMoney.bind(this));
    //TODO
    // btnClose.addEventListener("click", this._closeAccount.bind(this));
    //TODO
    // btnLoan.addEventListener("click", this._getLoan.bind(this));
    //TODO
    // btnSort.addEventListener("click", this._toggleSort.bind(this));
  }

  // ------------ LOCAL STORAGE ------------

  _getCurrentUser() {
    const account = JSON.parse(localStorage.getItem("currentAcc"));
    const currentUser = this.#accounts.find(
      (acc) => acc.email === account.email
    );

    this.#currentUser = currentUser;
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("accounts"));
    this.#accounts = data;
  }

  // ------------ SORT ------------

  _toggleSort() {
    if (!this.sorted) {
      const sortMov = this.#currentUser.movements.slice().sort((a, b) => a - b);
      this._displayMovements(sortMov);
      this.sorted = true;
      return;
    }
    if (this.sorted) {
      this._displayMovements(this.#currentUser.movements);
      this.sorted = false;
      return;
    }
  }

  _setLocalStorage() {
    localStorage.setItem("accounts", JSON.stringify(this.#accounts));
  }

  // ------------ LOAN ------------

  _getLoan(e) {
    e.preventDefault();
    const amount = +inputLoanAmount.value;

    if (
      !(amount > 0) ||
      !this.#currentUser.movements.some((mov) => mov.amount >= amount * 0.1)
    ) {
      alert("we Are very Sorry , we cant Loan you this much money");
      return;
    }

    const loan = new Movement(
      amount,
      this.#currentUser.id,
      this.#currentUser.fullName
    );

    this.#currentUser.movements.push(loan);
    this._updateUI(this.#currentUser);
    this._clearInputsEl(inputLoanAmount);

    this._setLocalStorage();
  }

  // ------------ CLOSE ACCOUNT ------------

  _closeAccount(e) {
    e.preventDefault();
    const accUsername = inputCloseUsername.value;
    const accPin = inputClosePin.value;
    if (!this._allFieldsFill(inputCloseUsername, inputClosePin)) {
      alert("Please Compleat all the fields");
      return;
    }

    if (accUsername !== this.#currentUser.username) {
      alert("Please Enter correct username");
      return;
    }
    if (accPin !== this.#currentUser.password) {
      alert("Wrong password ! try again");
      return;
    }

    const accountIndex = this.#accounts.findIndex(
      (acc) => acc.username === accUsername
    );
    this.#accounts.splice(accountIndex, 1);
    this._clearInputsEl(inputCloseUsername, inputClosePin);
    this._setLocalStorage();

    window.location.href = "../index.html";
  }

  // ------------ TRANSFER ------------
  _transferMoney(e) {
    e.preventDefault();
    const receiverAccount = this._findAccount(inputTransferAccount.value);
    const amount = +inputTransferAmount.value;

    if (!this._allFieldsFill(inputTransferAccount, inputTransferAmount)) {
      alert("Please Compleat all the fields");
      return;
    }
    if (!receiverAccount) {
      alert("Can not Find user");
      return;
    }

    if (!this._ValidateTransferAmount(amount)) {
      alert("Not Enough Balance");
      return;
    }

    const senderMovement = new Movement(
      -amount,
      this.#currentUser.id,
      receiverAccount.fullName,
      this.#currentUser.fullName
    );
    const receiverMovement = new Movement(
      amount,
      receiverAccount.id,
      receiverAccount.fullName,
      this.#currentUser.fullName
    );

    this.#currentUser.movements.push(senderMovement);
    receiverAccount.movements.push(receiverMovement);
    this._updateUI(this.#currentUser);
    this._clearInputsEl(inputTransferAccount, inputTransferAmount);
    this._setLocalStorage();
  }

  _allFieldsFill(...inputsEl) {
    return inputsEl.every((input) => input.value);
  }
  _clearInputsEl(...inputsEl) {
    inputsEl.forEach((input) => (input.value = ""));
  }

  _ValidateTransferAmount(amount) {
    return this.#currentUser.balance > amount && amount > 0 ? true : false;
  }
  _findAccount(account) {
    return this.#accounts.find((acc) => acc.username === account);
  }

  // ------------ UPDATE UI ------------
  _updateUI(acc) {
    this._displayMovements(acc.movements);
    this._displayCard(acc);

    this._calcDisplaySummery(acc);
  }

  //  Display Movements
  _displayMovements(movements) {
    containerTransaction.innerHTML = "";
    movements.forEach((mov, i) => {
      const date = moment(mov.date).calendar();

      containerTransaction.insertAdjacentHTML(
        "afterbegin",
        `            
        <li>
          <span class="transaction__descrption">${mov.description}</span>
          <span class="transaction__time">${date}</span>
          <span class="transaction__status">${mov.status}</span>
          <span class="transaction__amount">${mov.amount} R</span>
        </li>`
      );
    });
  }

  //  DISPLAY CARD
  _displayCard(acc) {
    // * Display Bank Name
    labelBankName.textContent =
      acc.cardNumber.slice(0, 4) === `6219`
        ? `Saman`
        : acc.cardNumber.slice(0, 4) === `5024`
        ? `Pasargad `
        : acc.cardNumber.slice(0, 4) === `6037`
        ? `Saderat `
        : `un known Bank`;

    // * Display fullName Name
    labelFullNameCard.textContent = acc.fullName;
    labelFullNameHeader.textContent = acc.fullName;

    // * Display Card Number
    labelCardNumberCard.textContent = acc.cardNumber;
    labelCardNumberDetail.textContent = acc.cardNumber;

    // * Calculate and Display Balance
    acc.balance = acc.movements.reduce((acc, mov) => acc + mov.amount, 0);
    labelBalanceSummery.textContent = acc.balance + `R`;
    labelBalanceHeader.textContent = acc.balance + `R`;
    labelBalanceDetail.textContent = acc.balance + `R`;
  }

  //  DISPLAY SUMMERY
  _calcDisplaySummery(acc) {
    //  INCOME
    labelIncome.textContent =
      acc.movements
        .filter((mov) => mov.amount > 0)
        .reduce((acc, deposit) => acc + deposit.amount, 0) + `R`;

    //  OUT COME
    labelExpense.textContent =
      Math.abs(
        acc.movements
          .filter((mov) => mov.amount < 0)
          .reduce((acc, deposit) => acc + deposit.amount, 0)
      ) + `R`;
  }
}
/////////////////////////////////////////////////

// const currentAcc = JSON.parse(localStorage.getItem("currentAcc"));

// const test = accounts.find((acc) => (acc = currentAcc));
const init = new App();
