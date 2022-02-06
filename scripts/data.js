"use strict";

class Movement {
  date = moment().format();
  constructor(amount, accountID, receiver = accountID, sender = "Bank") {
    this.amount = amount;
    this.accountID = accountID;
    this.sender = sender;
    this.receiver = receiver;
  }
}

class Account {
  date = moment().format();
  id = (Math.random() * 10 + " ").slice(-8);
  movements = [];

  constructor(owner, username, password, cardNumber, balance) {
    this.owner = owner;
    this.username = username;
    this.password = password;
    this.cardNumber = cardNumber;
    this.balance = balance;

    this._firstIncome();
  }

  _firstIncome() {
    this.movements.push(new Movement(2000, this.id, this.owner));
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
      "eeslami",
      "erfan123",
      `6219 6426 1325 9988`
    );

    const account02 = new Account(
      "Alireza eslami",
      "aeslami",
      "alireza123",
      `5024 5644 5236 9956`
    );

    const account03 = new Account(
      "Nioofar najafi",
      "nnajafi",
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
