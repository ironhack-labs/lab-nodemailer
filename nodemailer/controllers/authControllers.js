const User = require("../models/User");
const { sendMail } = require("../config/nodemailer");

function code() {
  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let token = "";
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token;
}

exports.postSignup = async (req, res) => {
  let { username, password, email, confirmationCode } = req.body;
  confirmationCode = code();

  await User.register(
    new User({ username }),
    password,
    email,
    confirmationCode
  );
  await sendMail(email, confirmationCode);
  res.redirect("/");
};

//incompleta
exports.getConfirm = async (req, res) => {
  const { confirmationCode } = req.params;

  await User.findOne({ confirmationCode });
  res.render("auth/confirmation");
};
