const User = require("../models/User");
// Retrieve the config transporter from nodemail
const { transporter } = require("../controllers/email");
//tocken gen
const tokenGen = () => {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length )];
  }
  return token;
}
//Set the routes
exports.signupGet = (_, res) => res.render("passport/signup");
exports.signupPost = (req, res) => {
  const {username, password, email} = req.body
  if (username === "" || password === "") {
    res.render("passport/signup", { message: "Indicate username and password" });
    return;
  }
  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("passport/signup", { message: "The username already exists" });
      return;
    }
  });
  //Register the user and track its session
  const token = tokenGen();
  User.register({
    username:username,
    confirmationCode: token,
    email:email
  }, password)
  .then(async () => {
      await transporter.sendMail({
          from:"B-E team <B-E@gmail.com>",
          to:email,
          subject:"Confirm your account",
          text:"The confirmation code is",
          html:`
          <a href="http://localhost:3000/passport/confirm/${token}"> Confirmation Code </a>`
      })
    res.redirect("/");
  })
  .catch(err => {
    if (err.email === "UserExistsError") {
      return res.render("passport/signup", {
        msg: "Mail already register"
      })
    } else {
      console.log(err)
    }
    res.render("passport/signup", { message: "Something went wrong" });
  })
};

exports.loginGet = async (req, res) => {
  res.render("passport/login", { msg: "Error" });
};

exports.confirmAccount = async (req, res) => {
  const { confirmationCode } = req.params
  const user = await User.findOneAndUpdate({confirmationCode}, 
    {
    status: "Active"
    }, 
    {
      new: true
    })
  res.render("passport/confirmation", {user})
}