const router = require("express").Router();
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const nodemailer = require("nodemailer");
require("dotenv/config");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

///////////////////////////////////////////////////////////////////////
//////////////////////////////Profile//////////////////////////////////
///////////////////////////////////////////////////////////////////////

router.get("/userProfile", isLoggedIn, (req, res) => {
  res.render("profile", { username, status });
});

router.post("/send-email", (req, res, next) => {
  let { email, username } = req.body;
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAILUSER,
      pass: process.env.EMAILPASSWORD,
    },
  });
  transporter
    .sendMail({
      from: '"My Awesome Project " <antonio.django80@gmail.com>',
      to: email,
      subject: "Confirmation token",
      text: `Hay ${username} this is your confirmation token`,
      html: `<b>${message}  </b>`,
    })
    .then((info) => res.render("message", { email, subject, message, info }))
    .catch((error) => console.log("Error Occurs!"));
});

module.exports = router;
