const expressSession = require("express-session");
const MongoStore = require("connect-mongo");
const { DB } = require("./db.config");

const sessionMaxAge = process.env.SESSION_AGE || 7; // days

const sessionConfig = expressSession({
  secret: process.env.COOKIE_SECRET || "Super secret (change it!)",
  resave: true,
  saveUninitialized: false,
  cookie: {
    secure: process.env.COOKIE_SECURE === "true" || false,
    maxAge: 24 * 60 * 60 * 1000 * sessionMaxAge, // 1 week
    httpOnly: true,
  },
  store: new MongoStore({
    mongoUrl: DB,
    ttl: 24 * 60 * 60 * sessionMaxAge, // 1 week
  }),
});

module.exports = sessionConfig;