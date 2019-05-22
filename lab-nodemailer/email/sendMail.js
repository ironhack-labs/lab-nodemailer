const transporter = require("./transporte");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const User = require("../models/User");

const sendMail = (username, email, code) =>
  transporter
    .sendMail({
      from: "The best Ironhackers",
      to: email,
      subject: "Confirmation email",
      text: `Hi${username},
      This is your confirmation code:${code}`,
      html: `<b>Hi${username},<br>This is your confirmation code:${code}</b>`
    })
    .then(info => {
      return info.accepted;
    });

module.exports = sendMail;
