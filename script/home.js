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
/////////////////////////////////////////////////

/////////////////////////////////////////////////
class App {
  constructor(account) {
    this.account = account;

    this._updateUI(this.account);
  }

  _updateUI(acc) {
    this._displayMovements(acc);
    this._displayCard(acc);
    this._displayWelcomeName(acc);
    this._calcDisplaySummery(acc);
  }

  //  Display Movements
  _displayMovements(acc) {
    containerMovementsInner.innerHTML = "";
    acc.movements.forEach((mov, i) => {
      const type = mov > 0 ? `deposit` : `withdrawal`;

      containerMovementsInner.insertAdjacentHTML(
        "afterbegin",
        `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}"> ${
          i + 1
        } - ${type}</div>
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

    // * Display Balance
    labelBalance.textContent =
      acc.movements.reduce((acc, mov) => {
        return acc + mov;
      }, 0) + `$`;
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

const currentAcc = JSON.parse(localStorage.getItem("currentAcc"));
const init = new App(currentAcc);
