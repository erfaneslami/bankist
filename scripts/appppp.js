"use strict";

const inputUsername = document.querySelector(".login__box_input--username");
const inputPassword = document.querySelector(".login__box_input--password");
const btnLogin = document.querySelector(".login__box_btn");

class LoginApp {
  #accounts = [];
  constructor() {
    this._getLocalStorage();
    // EVENT HANDLERS
    btnLogin.addEventListener("click", this._logIn.bind(this));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("accounts"));
    this.#accounts = data;
  }

  _logIn(e) {
    e.preventDefault();

    console.log(inputUsername.value);
    console.log(inputPassword.value);
    const currentUser = this.#accounts.find(
      (acc) =>
        acc.username === inputUsername.value &&
        acc.password === inputPassword.value
    );

    if (!currentUser) {
      alert("Wrong username or password !");
      return;
    }

    localStorage.setItem("currentAcc", JSON.stringify(currentUser));
    window.location.href = "../home.html";
  }
}

const init = new LoginApp();

// btnLogin.addEventListener("click", function (e) {
//   localStorage.setItem("currentAcc", JSON.stringify(account1));

//   window.location.href = "../home.html";
//   console.log("clicked");
// });
