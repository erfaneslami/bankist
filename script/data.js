"use strict";

const account1 = {
  owner: "Erfan eslami",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: "erfan123",
  cardNumber: `6219 6426 1325 9988`,
  movementsDates: [
    "2022-02-01T11:36:39+03:30",
    "2022-01-31T09:36:39+03:30",
    "2022-01-31T07:30:39+03:30",
    "2022-01-25T10:30:39+03:30",
    "2022-01-25T07:30:39+03:30",
    "2022-01-25T13:30:39+03:30",
    "2021-12-10T13:30:39+03:30",
    "2021-12-9T13:30:39+03:30",
  ],
};

const account2 = {
  owner: "Alireza eslami",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: "alireza123",
  cardNumber: `5024 5644 5236 9956`,
  movementsDates: [
    "2022-02-01T11:36:39+03:30",
    "2022-01-31T09:36:39+03:30",
    "2022-01-31T07:30:39+03:30",
    "2022-01-25T10:30:39+03:30",
    "2022-01-25T07:30:39+03:30",
    "2022-01-25T13:30:39+03:30",
    "2021-12-10T13:30:39+03:30",
    "2021-12-9T13:30:39+03:30",
  ],
};

const account3 = {
  owner: "Nioofar najafi",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: "niloo123",
  cardNumber: `6037 1236 8526 1235`,
  movementsDates: [
    "2022-02-01T11:36:39+03:30",
    "2022-01-31T09:36:39+03:30",
    "2022-01-31T07:30:39+03:30",
    "2022-01-25T10:30:39+03:30",
    "2022-01-25T07:30:39+03:30",
    "2022-01-25T13:30:39+03:30",
    "2021-12-10T13:30:39+03:30",
    "2021-12-9T13:30:39+03:30",
  ],
};

const account4 = {
  owner: "Mohammad Najafi",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: "mohammad123",
  cardNumber: `6219 6512 9845 3215`,
  movementsDates: [
    "2022-02-01T11:36:39+03:30",
    "2022-01-31T09:36:39+03:30",
    "2022-01-31T07:30:39+03:30",
    "2022-01-25T10:30:39+03:30",
    "2022-01-25T07:30:39+03:30",
    "2022-01-25T13:30:39+03:30",
    "2021-12-10T13:30:39+03:30",
    "2021-12-9T13:30:39+03:30",
  ],
};

const account5 = {
  owner: "Ali tehrani",
  movements: [300, -250, 390, -1000, -20, 50, 485, -460],
  interestRate: 0.7,
  pin: "ali123",
  cardNumber: `6037 1212 3596 3535`,
  movementsDates: [
    "2022-02-01T11:36:39+03:30",
    "2022-01-31T09:36:39+03:30",
    "2022-01-31T07:30:39+03:30",
    "2022-01-25T10:30:39+03:30",
    "2022-01-25T07:30:39+03:30",
    "2022-01-25T13:30:39+03:30",
    "2021-12-10T13:30:39+03:30",
    "2021-12-9T13:30:39+03:30",
  ],
};
const accounts = [account1, account2, account3, account4, account5];

const creatUserName = function (accounts) {
  accounts.forEach(
    (acc) =>
      (acc.username = acc.owner
        .toLowerCase()
        .split(" ")
        .reduce((acc, word, i, arr) => (acc = arr[0][0] + arr[1]), " "))
  );
};

creatUserName(accounts);

const _setLocalStorageDatabase = function () {
  const data = localStorage.getItem("accounts");
  if (data) return;
  localStorage.setItem("accounts", JSON.stringify(accounts));
};

_setLocalStorageDatabase();
