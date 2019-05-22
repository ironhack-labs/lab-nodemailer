require("dotenv").config()
const nodemailer = require("nodemailer")
console.log(process.env.PEPE);
let transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.PEPE,
    pass: process.env.PASSWORD
  }
})

module.exports = transporter