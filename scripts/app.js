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
const labelEmailHeader = document.querySelector(".header__profile_info_email");
const labelCardNumberCard = document.querySelector(".card__number");
const labelCardNumberDetail = document.querySelector(
  ".card-detail__value--card-number"
);
const labelIdDetail = document.querySelector(".card-detail__value--ID");
const labelBankName = document.querySelector(".card__bank-name");
const labelIncome = document.querySelector(".balance-sammery__income");
const labelExpense = document.querySelector(".balance-sammery__expense");

const btnFilterWeek = document.querySelector(".filter--week");
const btnFilterMonth = document.querySelector(".filter--month");
const btnFilterYear = document.querySelector(".filter--year");

const filtersContainer = document.querySelector(".filters");

const ctx = document.getElementById("myChart").getContext("2d");

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
  #myChart;
  sorted;
  constructor() {
    this._getLocalStorage();
    this._getCurrentUser();
    this._updateUI(this.#currentUser);

    // EVENT HANDLERS

    filtersContainer.addEventListener("click", this._filterChart.bind(this));

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
    this._displayProfileInfo(acc);
    this._displayCardDetails(acc);
    this._calcDisplaySummery(acc.movements);
    this._calcDisplayChart(acc.movements);
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

    // * Display Card Number
    labelCardNumberCard.textContent = acc.cardNumber;

    // TODO
    // * Calculate and Display Balance
    acc.balance = this._calcBalance(acc.movements);

    labelBalanceHeader.textContent = acc.balance + `R`;
  }

  _displayProfileInfo(acc) {
    // * Display Full name
    labelFullNameHeader.textContent = acc.fullName;
    // * Display Email
    labelEmailHeader.textContent = acc.email;
  }

  _displayCardDetails(acc) {
    acc.balance = this._calcBalance(acc.movements);
    labelCardNumberDetail.textContent = acc.cardNumber;
    labelBalanceDetail.textContent = acc.balance + `R`;
    labelIdDetail.textContent = acc.id;
  }

  //  DISPLAY SUMMERY
  _calcDisplaySummery(movements) {
    const income = this._calcIncome(movements);
    const expense = Math.abs(this._calcExpense(movements));
    const balance = this._calcBalance(movements);
    //  INCOME
    labelIncome.textContent = income + `R`;

    //  EXPENSES
    labelExpense.textContent = expense + `R`;

    //  BALANCE
    labelBalanceSummery.textContent = balance + `R`;
  }

  _calcDisplayChart(movements) {
    const income = this._calcIncome(movements);
    const expense = Math.abs(this._calcExpense(movements));
    this._creatChart(income, expense);
  }

  _filterChart(e) {
    const now = moment();
    if (e.target.classList.contains("filter--week")) {
      const lastWeek = moment().subtract(7, "days");

      const movements = this.#currentUser.movements.filter((mov) => {
        return moment(mov.date).isBetween(lastWeek, now);
      });

      const income = this._calcIncome(movements);
      const expense = this._calcExpense(movements);

      this._calcDisplaySummery(movements);
      this.#myChart.destroy();
      this._creatChart(income, expense);
    }

    if (e.target.classList.contains("filter--month")) {
      const lastWeek = moment().subtract(30, "days");

      const movements = this.#currentUser.movements.filter((mov) => {
        return moment(mov.date).isBetween(lastWeek, now);
      });

      const income = this._calcIncome(movements);
      const expense = this._calcExpense(movements);

      this._calcDisplaySummery(movements);
      this.#myChart.destroy();
      this._creatChart(income, expense);
    }
    if (e.target.classList.contains("filter--year")) {
      const lastWeek = moment().subtract(365, "days");

      const movements = this.#currentUser.movements.filter((mov) => {
        return moment(mov.date).isBetween(lastWeek, now);
      });

      const income = this._calcIncome(movements);
      const expense = this._calcExpense(movements);

      this._calcDisplaySummery(movements);
      this.#myChart.destroy();
      this._creatChart(income, expense);
    }
  }

  _creatChart(income, expense) {
    this.#myChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Income", "Expense"],
        datasets: [
          {
            label: "# of Votes",
            data: [income, expense],
            backgroundColor: ["#ba66f9", "#03a9f4"],
            borderColor: ["#ba66f9", "#03a9f4"],
            borderWidth: 1,
            spacing: 5,
            cutout: "80%",
            borderRadius: 30,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }

  _calcBalance(movements) {
    return movements.reduce((acc, mov) => acc + mov.amount, 0);
  }

  _calcIncome(movements) {
    return movements
      .filter((mov) => mov.amount > 0)
      .reduce((acc, deposit) => acc + deposit.amount, 0);
  }

  _calcExpense(movements) {
    return movements
      .filter((mov) => mov.amount < 0)
      .reduce((acc, deposit) => acc + deposit.amount, 0);
  }
}
/////////////////////////////////////////////////

// const currentAcc = JSON.parse(localStorage.getItem("currentAcc"));

// const test = accounts.find((acc) => (acc = currentAcc));
const init = new App();
