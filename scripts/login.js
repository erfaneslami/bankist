"use strict";

const inputEmail = document.querySelector(".enter__form-input--email");
const inputPassword = document.querySelector(".enter__form-input--password");
const btnLogin = document.querySelector(".enter__form-btn");

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

    console.log(inputEmail.value);
    console.log(inputPassword.value);
    const currentUser = this.#accounts.find(
      (acc) =>
        acc.email === inputEmail.value && acc.password === inputPassword.value
    );

    if (!currentUser) {
      alert("Wrong username or password !");
      return;
    }

    localStorage.setItem("currentAcc", JSON.stringify(currentUser));
    window.location.href = "../app.html";
  }
}

const init = new LoginApp();

// btnLogin.addEventListener("click", function (e) {
//   localStorage.setItem("currentAcc", JSON.stringify(account1));

//   window.location.href = "../home.html";
//   console.log("clicked");
// });
