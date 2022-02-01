"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////

/////////////////////////////////////////////////
const labelBalance = document.querySelector(".card__balance_value");
const labelOwner = document.querySelector(".card__owner");
const labelCardNumber = document.querySelector(".card__number");
const labelBankName = document.querySelector(".card__name");
const labelWelcome = document.querySelector(".header__welcome");
const labelIncome = document.querySelector(".summery__value--in");
const labelOutcome = document.querySelector(".summery__value--out");
const labelInterest = document.querySelector(".summery__value--interest");

const containerMovements = document.querySelector(".movements");
const containerMovementsInner = document.querySelector(".movements__container");

const btnSort = document.querySelector(".sort");
const btnTransfer = document.querySelector(".operations__btn--transfer");
const btnClose = document.querySelector(".operations__btn--close");
const btnLoan = document.querySelector(".operations__btn--loan");

const inputTransferAccount = document.querySelector(
  ".input--transfer-to-account"
);
const inputTransferAmount = document.querySelector(".input--transfer-amount");
const inputCloseUsername = document.querySelector(".input--close-account");
const inputClosePin = document.querySelector(".input--close-pin");
const inputLoanAmount = document.querySelector(".input--loan-amount");
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
    btnTransfer.addEventListener("click", this._transferMoney.bind(this));
    btnClose.addEventListener("click", this._closeAccount.bind(this));
    btnLoan.addEventListener("click", this._getLoan.bind(this));
    btnSort.addEventListener("click", this._toggleSort.bind(this));
  }

  // ------------ LOCAL STORAGE ------------

  _getCurrentUser() {
    const account = JSON.parse(localStorage.getItem("currentAcc"));
    const currentUser = this.#accounts.find(
      (acc) => acc.username === account.username
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
      !this.#currentUser.movements.some((mov) => mov >= amount * 0.1)
    ) {
      alert("we Are very Sorry , we cant Loan you this much money");
      return;
    }

    this.#currentUser.movements.push(amount);
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
    if (accPin !== this.#currentUser.pin) {
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

    this.#currentUser.movements.push(-amount);
    receiverAccount.movements.push(amount);
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
    this._displayWelcomeName(acc);
    this._calcDisplaySummery(acc);
  }

  //  Display Movements
  _displayMovements(movements) {
    containerMovementsInner.innerHTML = "";
    movements.forEach((mov, i) => {
      const type = mov > 0 ? `deposit` : `withdrawal`;

      containerMovementsInner.insertAdjacentHTML(
        "afterbegin",
        `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}"> ${
          i + 1
        } - ${type}</div>
        <div class="movements__date">01/01/2021</div>

      <div class="movements__value">${mov}</div>
    </div>`
      );
    });
  }

  //  DISPLAY CARD
  _displayCard(acc) {
    // * Display Bank Name
    labelBankName.textContent =
      acc.cardNumber.slice(0, 4) === `6219`
        ? `Saman Bank`
        : acc.cardNumber.slice(0, 4) === `5024`
        ? `Pasargad Bank`
        : acc.cardNumber.slice(0, 4) === `6037`
        ? `Saderat Bank`
        : `un known Bank`;

    // * Display Owner Name
    labelOwner.textContent = acc.owner;

    // * Display Card Number
    labelCardNumber.textContent = acc.cardNumber;

    // * Calculate and Display Balance
    acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
    labelBalance.textContent = acc.balance + `$`;
  }

  //  Display Welcome name
  _displayWelcomeName(acc) {
    labelWelcome.textContent = `Hi ${acc.owner.split(" ")[0]} !`;
  }

  //  DISPLAY SUMMERY
  _calcDisplaySummery(acc) {
    //  INCOME
    labelIncome.textContent =
      acc.movements
        .filter((mov) => mov > 0)
        .reduce((acc, deposit) => acc + deposit, 0) + `$`;

    //  OUT COME
    labelOutcome.textContent =
      Math.abs(
        acc.movements
          .filter((mov) => mov < 0)
          .reduce((acc, deposit) => acc + deposit, 0)
      ) + `$`;

    //  INTEREST
    labelInterest.textContent =
      acc.movements
        .filter((mov) => mov > 0)
        .map((deposit) => (deposit * acc.interestRate) / 100)
        .filter((int) => int > 1)
        .reduce((acc, int) => acc + int, 0) + `$`;
  }
}
/////////////////////////////////////////////////

// const currentAcc = JSON.parse(localStorage.getItem("currentAcc"));

// const test = accounts.find((acc) => (acc = currentAcc));
const init = new App();
