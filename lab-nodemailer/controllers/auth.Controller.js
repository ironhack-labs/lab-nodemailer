require("dotenv").config();
const User = require("../models/User");
const { sendEmail } = require("../controllers/email")
 
exports.signupGet = (_, res) => res.render("auth/signup");

exports.signupPost = (req, res, next) => {
    const { email, username, password, passwordrepeat } = req.body;
    if (password !== passwordrepeat) {
      return res.render("auth/signup", {
        msg: "Password must be the same"
      });
    }
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length )];
    }
    User.register({email, username, token}, password)
      .then(async (user) => {
        await sendEmail(user.email, `Hi ${username}`, `<a href="http://localhost:3000/confirm/${token}">Bienvenido, por favor activa tu cuenta</a>`);
        res.redirect("/");
      })
      .catch(err => {
        console.log(err)
        if(err.name === "UserExistError"){
          return res.render("auth/signup", {
            msg: "You are already registered"
          });
        }
      });
};

exports.userToken = (req,res) => {
  const {token} = req.params;
  console.log(token)
  User.findOneAndUpdate(
    {token},
    {
      $set: {status: 'Active'}
    },
    {
      new: true
    }
  )
  .then(()=> res.redirect(`/`))
  .catch(err => console.log(err));
}

exports.loginGet = async(req, res) => {
  res.render("auth/login");
}

exports.profileGet = (req, res) => {
  res.render("auth/profile", {user: req.user});
}


