const User = require('../models/User.model');

module.exports.isAuthenticated = (req, res, next) => {
    User.findById(req.session.id)
}