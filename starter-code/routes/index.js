const express = require("express");
const router = express.Router();
// const mailer = require('../config/nodemailer');
/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});
//email form
// router.get("/emailsend", (req, res, next) => res.render("emailsend"));

// router.post("/emailsend", (req, res) => {
//   let {
//     email,
//     subject,
//     message
//   } = req.body;

//   mailer
//     .sendMail({
//       from: '"Ironhacker Email 👻" <myawesome@project.com>',
//       to: email,
//       subject: subject,
//       text: message,
//       html: `<b>${message}</b>`
//     })
//     .then(info =>
//       res.render("emailsend", {
//         email,
//         subject,
//         message,
//         info
//       })
//     )
//     .catch(error => console.log(error));
// });
module.exports = router;