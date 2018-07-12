const nodemailer = require("nodemailer");
module.exports = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "nkouuuIronhack@gmail.com",
    pass: "1234567890a."
  }
});
