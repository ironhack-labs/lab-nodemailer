const Email = require("../models/Email.model");
const nodemailer = require('nodemailer');
// const templates = require("../config/templates/templates");

module.exports.home = (req, res, next) => {
	res.render("home");
};