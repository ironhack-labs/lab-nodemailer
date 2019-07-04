const User = require("../models/User");

exports.getConfirmCode = (req, res, next) => {
  User.findOneAndUpdate(
    { confirmationCode: req.params.confirmCode },
    { $set: { status: "Active" } },
    { new: true }
  )
    .then(user => {
      res.render("auth/confirmed", user);
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProfileByCode = (req, res, next) => {
  User.findOne({ confirmationCode: req.params.confirmCode })
    .then(user => {
      res.render("auth/profile", user);
    })
    .catch(err => {
      res.render("auth/profile", err);
    });
};
