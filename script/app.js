"use strict";

const inputUsername = document.querySelector(".login__box_input--username");
const inputPassword = document.querySelector(".login__box_input--password");
const btnLogin = document.querySelector(".login__box_btn");

class LoginApp {
  constructor() {
    // EVENT HANDLERS
    btnLogin.addEventListener("click", this._logIn.bind(this));
  }

  _logIn(e) {
    e.preventDefault();

    const currentUser = accounts.find(
      (acc) =>
        acc.username === inputUsername.value && acc.pin === inputPassword.value
    );

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
