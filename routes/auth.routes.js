const router = require("express").Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// const jwt = require("jsonwebtoken");

// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

const nodemailer = require("nodemailer");
require("dotenv/config");

///////////////////////////////////////////////////////////////////////
/////////////////////////// SIGN UP ///////////////////////////////////
///////////////////////////////////////////////////////////////////////
router.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", isLoggedOut, (req, res) => {
  const { username, password, email } = req.body;
  // const token = jwt.sign({ id: User._id }, process.env.JWT_SECRET, {
  //   expiresIn: process.env.JWT_EXPIRES_IN},
  // });
  if (!username) {
    return res.status(400).render("auth/signup", {
      errorMessage: "Please provide your username.",
    });
  }
  if (password.length < 8) {
    return res.status(400).render("auth/signup", {
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }
  // Search the database for a user with the username submitted in the form
  User.findOne({ username }).then((found) => {
    // If the user is found, send the message username is taken
    if (found) {
      return res
        .status(400)
        .render("authsignup", { errorMessage: "Username already taken." });
    }
    // if user is not found, create a new user - start with hashing the password
    return bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        const characters =
          "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let token = "";
        for (let i = 0; i < 25; i++) {
          token += characters[Math.floor(Math.random() * characters.length)];
        }
        console.log(token);
        // Create a user and save it in the database
        return User.create({
          username,
          password: hashedPassword,
          email,
          confirmationCode: token,
        });
      })
      .then((user) => {
        console.log(user);
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
            text: `HI ${user.username} this is your confirmation token`,
            html: `<!doctype html>
            <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
              <head>
                <title>
                </title>
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style type="text/css">
                  #outlook a{padding: 0;}
                        .ReadMsgBody{width: 100%;}
                        .ExternalClass{width: 100%;}
                        .ExternalClass *{line-height: 100%;}
                        body{margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;}
                        table, td{border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;}
                        img{border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic;}
                        p{display: block; margin: 13px 0;}
                </style>
                <!--[if !mso]><!-->
                <style type="text/css">
                  @media only screen and (max-width:480px) {
                              @-ms-viewport {width: 320px;}
                              @viewport {	width: 320px; }
                          }
                </style>
                <!--<![endif]-->
                <!--[if mso]>
                <xml>
                  <o:OfficeDocumentSettings>
                    <o:AllowPNG/>
                    <o:PixelsPerInch>96</o:PixelsPerInch>
                  </o:OfficeDocumentSettings>
                </xml>
                <![endif]-->
                <!--[if lte mso 11]>
                <style type="text/css">
                  .outlook-group-fix{width:100% !important;}
                </style>
                <![endif]-->
                <style type="text/css">
                  @media only screen and (max-width:480px) {
      
                          table.full-width-mobile { width: 100% !important; }
                          td.full-width-mobile { width: auto !important; }
      
                  }
                  @media only screen and (min-width:480px) {
                  .dys-column-per-100 {
                    width: 100.000000% !important;
                    max-width: 100.000000%;
                  }
                  }
                </style>
              </head>
              <body>
                <div>
                  <!--[if mso | IE]>
            <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
            <![endif]-->
                  <div style='background:#4DBFBF;background-color:#4DBFBF;margin:0px auto;max-width:600px;'>
                    <table align='center' border='0' cellpadding='0' cellspacing='0' role='presentation' style='background:#4DBFBF;background-color:#4DBFBF;width:100%;'>
                      <tbody>
                        <tr>
                          <td style='direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;'>
                            <!--[if mso | IE]>
            <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:600px;">
            <![endif]-->
                            <div class='dys-column-per-100 outlook-group-fix' style='direction:ltr;display:inline-block;font-size:13px;text-align:left;vertical-align:top;width:100%;'>
                              <table border='0' cellpadding='0' cellspacing='0' role='presentation' style='vertical-align:top;' width='100%'>
                                <tr>
                                  <td align='center' style='font-size:0px;padding:10px 25px;word-break:break-word;'>
                                    <div style="color:#FFFFFF;font-family:'Droid Sans', 'Helvetica Neue', Arial, sans-serif;font-size:36px;line-height:1;text-align:center;">
                                    Ironhack Confirmation Email
                                    Hello ${username}!!!!!
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td align='center' style='font-size:0px;padding:10px 25px;word-break:break-word;'>
                                    <table border='0' cellpadding='0' cellspacing='0' role='presentation' style='border-collapse:collapse;border-spacing:0px;'>
                                      <tbody>
                                        <tr>
                                          <td style='width:216px;'>
                                            <img alt='Descriptive Alt Text' height='189' src='https://assets.opensourceemails.com/imgs/neopolitan/robot-happy.png' style='border:none;display:block;font-size:13px;height:189px;outline:none;text-decoration:none;width:100%;' width='216' />
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                                <tr>
                                  <td align='center' style='font-size:0px;padding:10px 25px;word-break:break-word;'>
                                    <div style="color:#187272;font-family:'Droid Sans', 'Helvetica Neue', Arial, sans-serif;font-size:16px;line-height:20px;text-align:center;">
                                    Thanks for join to our community! Please confirm your account clicking on the following link:  <b>http://localhost:3000/confirm/${user.confirmationCode}</b>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td align='center' style='font-size:0px;padding:10px 25px;word-break:break-word;' vertical-align='middle'>
                                    <table border='0' cellpadding='0' cellspacing='0' role='presentation' style='border-collapse:separate;line-height:100%;width:200px;'>
                                      <tr>
                                        <td align='center' bgcolor='#178F8F' role='presentation' style='background-color:#178F8F;border:none;border-radius:4px;cursor:auto;padding:10px 25px;' valign='middle'>
                                          <a href='http://localhost:3000/confirm/${user.confirmationCode}' style="background:#178F8F;color:#ffffff;font-family:'Droid Sans', 'Helvetica Neue', Arial, sans-serif;font-size:16px;font-weight:bold;line-height:30px;margin:0;text-decoration:none;text-transform:none;" target='_blank'>
                                            My Account
                                          </a>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </div>
                            <!--[if mso | IE]>
            </td></tr></table>
            <![endif]-->
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <!--[if mso | IE]>
            </td></tr></table>
            <![endif]-->
                </div>
              </body>
            </html>`,
          })
          .then((user) => {
            req.session.user = user;
            res.render("auth/waiting-confirmation");
          })
          .catch((error) => {
            if (error instanceof mongoose.Error.ValidationError) {
              return res
                .status(400)
                .render("auth/signup", { errorMessage: error.message });
            }
            if (error.code === 11000) {
              return res.status(400).render("auth/signup", {
                errorMessage:
                  "Username need to be unique. The username you chose is already in use.",
              });
            }
            return res
              .status(500)
              .render("auth/signup", { errorMessage: error.message });
          });
      });
  });
});

///////////////////////////////////////////////////////////////////////
////////////////////////  CONFIRMATION ////////////////////////////////
///////////////////////////////////////////////////////////////////////

router.get("/confirm/:confirmCode", (req, res, next) => {
  const userToken = req.params.confirmCode;
  console.log(userToken);
  // const userId = req.session.currentUser._id;
  User.findOneAndUpdate(
    { confirmationCode: userToken },
    {
      status: "Active",
    }
  )
    .then((userData) => {
      if (!userData) {
        return res.status(400).render("auth/login", {
          errorMessage: "Wrong credentials.",
        });
      } else if (userData) {
        console.log(userData.status);
        req.session.user = userData;
        return res.render("auth/confirmation", {
          username: userData.username,
          status: userData.status,
        });
      }
    })
    .catch((err) => {
      next(err);
    });
});

///////////////////////////////////////////////////////////////////////
/////////////////////////// LOGIN /////////////////////////////////////
///////////////////////////////////////////////////////////////////////
router.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login");
});

router.post("/login", isLoggedOut, (req, res, next) => {
  const { username, password } = req.body;
  if (!username) {
    return res.status(400).render("auth/login", {
      errorMessage: "Please provide your username.",
    });
  }
  // Here we use the same logic as above
  // - either length based parameters or we check the strength of a password
  if (password.length < 8) {
    return res.status(400).render("auth/login", {
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }
  // Search the database for a user with the username submitted in the form
  User.findOne({ username })
    .then((user) => {
      // If the user isn't found, send the message that user provided wrong credentials
      if (!user) {
        return res.status(400).render("auth/login", {
          errorMessage: "Wrong credentials.",
        });
      }
      // If user is found based on the username, check if the in putted password matches the one saved in the database
      bcrypt.compare(password, user.password).then((isSamePassword) => {
        if (!isSamePassword) {
          return res.status(400).render("auth/login", {
            errorMessage: "Wrong credentials.",
          });
        }
        req.session.user = user;
        // req.session.user = user._id; // ! better and safer but in this case we saving the entire user object
        return res.redirect("/userProfile");
      });
    })

    .catch((err) => {
      next(err);
    });
});

///////////////////////////////////////////////////////////////////////
////////////////////waiting cofirmation   ////////////////////////////
///////////////////////////////////////////////////////////////////////

router.get("/waitingConfirmation", (req, res) => {
  res.render("auth/waiting-confirmation");
});
///////////////////////////////////////////////////////////////////////
///////////////////////////////LOGOUT//////////////////////////////////
///////////////////////////////////////////////////////////////////////

router.post("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .render("auth/logout", { errorMessage: err.message });
    }
    res.redirect("/");
  });
});

module.exports = router;
