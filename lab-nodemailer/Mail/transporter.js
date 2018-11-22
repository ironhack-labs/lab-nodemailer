const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");






let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'your email address',
    pass: 'your email password' 
  }
});