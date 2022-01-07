"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data
const account1 = {
  owner: "Erfan eslami",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: "erfan123",
  cardNumber: `6219 6426 1325 9988`,
};

const account2 = {
  owner: "Alireza eslami",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: "alireza123",
  cardNumber: `5024 5644 5236 9956`,
};

const account3 = {
  owner: "Nioofar najafi",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: "niloo123",
  cardNumber: `6037 1236 8526 1235`,
};

const account4 = {
  owner: "Mohammad Najafi",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: "mohammad123",
  cardNumber: `6219 6512 9845 3215`,
};

const account5 = {
  owner: "Ali tehrani",
  movements: [300, -250, 390, -1000, -20, 50, 485, -460],
  interestRate: 0.7,
  pin: "ali123",
  cardNumber: `6037 1212 3596 3535`,
};

const accounts = [account1, account2, account3, account4, account5];

const labelBalance = document.querySelector(".card__balance_value");
const labelOwner = document.querySelector(".card__owner");
const labelCardNumber = document.querySelector(".card__number");
const labelBankName = document.querySelector(".card__name");
const labelWelcome = document.querySelector(".header__welcome");
const labelIncome = document.querySelector(".summery__value--in");
const labelOutcome = document.querySelector(".summery__value--out");
const labelInterest = document.querySelector(".summery__value--interest");

const containerMovements = document.querySelector(".movements");
const containerMovementsInner = document.querySelector(".movContainer");

const btnSort = document.querySelector(".sort");

// ! Display Movements
const displayMovements = function (acc) {
  containerMovementsInner.innerHTML = "";
  acc.movements.forEach((mov, i) => {
    const type = mov > 0 ? `deposit` : `withdrawal`;

    btnSort.insertAdjacentHTML(
      "afterend",
      `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}"> ${
        i + 1
      } - ${type}</div>
      <div class="movements__value">${mov}</div>
    </div>`
    );
  });
};

// ! DISPLAY CARD
const displayCard = function (acc) {
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
};

const displayWelcomeName = (acc) =>
  (labelWelcome.textContent = `Hi ${acc.owner.split(" ")[0]} !`);

// ! DISPLAY SUMMERY
const calcDisplaySummery = function (acc) {
  // * INCOME
  labelIncome.textContent =
    acc.movements
      .filter((mov) => mov > 0)
      .reduce((acc, deposit) => acc + deposit, 0) + `$`;

  // * OUT COME
  labelOutcome.textContent =
    Math.abs(
      acc.movements
        .filter((mov) => mov < 0)
        .reduce((acc, deposit) => acc + deposit, 0)
    ) + `$`;

  // * INTEREST
  labelInterest.textContent =
    acc.movements
      .filter((mov) => mov > 0)
      .map((deposit) => (deposit * acc.interestRate) / 100)
      .filter((int) => int > 1)
      .reduce((acc, int) => acc + int, 0) + `$`;
};

const updateUI = function (acc) {
  displayMovements(acc);
  calcDisplaySummery(acc);
  displayCard(acc);
};

calcDisplaySummery(account2);

displayBankName(account1);
displayMovements(account1.movements);
displayName(account1);
displayCardNumber(account1);
displayWelcomeName(account1);
calcDisplayBalance(account1.movements);
