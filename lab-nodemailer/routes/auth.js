const nodemailer =require("nodemailer");
const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.gmail_user,
    pass: process.env.gmail_pass
  }
});

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const rol = req.body.role;
  const status = req.body.status;

  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const hashLink = bcrypt.hashSync(username, salt);



    const newUser = new User({
      username,
      password: hashPass,
      role:"teacher",
      email,
      status,
      confirmationCode: hashLink

    });
    
    transport.sendMail({
      from: "Your website <website@example.com>",
      to: `${email}`,
      subject: `${username} is trying to contact you`,
      text: `
        Name: ${username}
        Email: ${email}
       
      `,
      html: `
        <h1>Click On the link to activate your signup</h1>
        <p>Name: <b>${username}</b></p>
        <p>Email: ${email}</p>
        <p>${hashLink}</p>
        <button><a href="http://localhost:3000/auth/confirm/:confirmCode">Click On This Link</a></button>
        
      `
    })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      next(err);
    });
    


    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  });
});

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});


authRoutes.get("confirm/:confirmId", (req, res, next) => {
  User.findById(req.params.confirmId)

  const { hashLink } = userDetails;
    if (!bcrypt.compareSync (username, hashLink)) {
        res.redirect("/login");
        return;
    } 
    userDetails.status = "Active";
    res.render("auth/confirm/:confirmId");
    }); 
 


module.exports = authRoutes;
