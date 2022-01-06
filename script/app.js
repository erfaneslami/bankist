"use strict";

document
  .querySelector(".login__box_btn")
  .addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "../home.html";
    console.log("clicked");
  });
