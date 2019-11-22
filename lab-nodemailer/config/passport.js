const passport = require("passport");
const User = require("../models/User");
passport.initialize()
passport.session()
passport.use(User.createStrategy())

passport.serializeUser(User.serializeUser())

passport.deserializeUser(User.deserializeUser())

module.exports = passport;