const mongoose = require('mongoose');
const expressSession = require("express-session");
const MongoStore = require('connect-mongo')(expressSession);

const session = (expressSession({
    secret: 'irongenerator',
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}));