const User = require("../models/User");

exports.editStatus = (req, res) => {
  User.findOneAndUpdate({ token: req.params.token }, {$set: { status: 'Active' }},  { new: true })
    .then(user => res.render("profile"))
    .catch(err => console.error(err));
}
