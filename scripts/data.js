"use strict";

class Movement {
  date = moment().format();
  status;
  constructor(amount, accountID, description) {
    this.amount = amount;
    this.accountID = accountID;
    this.description = description;
  }
}

class Account {
  date = moment().format();
  id = (Math.random() * 10 + " ").slice(-8);
  movements = [];

  constructor(fullName, email, password, cardNumber) {
    this.fullName = fullName;
    this.email = email;
    this.password = password;
    this.cardNumber = cardNumber;
    this.balance;

    this._firstIncome();
  }

  _firstIncome() {
    this.movements.push(new Movement(2000, this.id, "Bank gift"));
  }
}

class DataBase {
  #accounts = [];
  constructor() {
    this._newAccount();
    this._setLocalStorageDatabase(this.#accounts);
  }

  _newAccount() {
    //  ------------- TEST DATA -----------------
    const account01 = new Account(
      "erfan eslami",
      "erfan_eslami@icloud.com",
      "erfan123",
      `6219 6426 1325 9988`
    );

    const account02 = new Account(
      "Alireza eslami",
      "alireza.eslami23@gmail.com",
      "alireza123",
      `5024 5644 5236 9956`
    );

    const account03 = new Account(
      "Nioofar najafi",
      "niloofar_najafi@icloud.com",
      "niloo123",
      `6037 1236 8526 1235`
    );

    this.#accounts.push(account01, account02, account03);
  }

  _setLocalStorageDatabase(accounts) {
    const data = localStorage.getItem("accounts");
    if (data) return;
    localStorage.setItem("accounts", JSON.stringify(accounts));
  }
}

const run = new DataBase();
