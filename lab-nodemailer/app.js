require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
// El que acabo de configurar, no el plano sin anabolicos de node_modules
const passport = require("./config/passport");
const session = require("express-session");

mongoose
  .connect("mongodb://localhost/passport-class", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(x =>
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  )
  .catch(err => console.error("Error connecting to mongo", err));

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();

// Session Config
app.use(
  session({
    secret: process.env.SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60
    },
    resave: false,
    saveUninitialized: true
  })
  );
  
  //  Passport initialization
  app.use(passport.initialize());
  app.use(passport.session());
  
  app.use(logger("dev"));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  
  
  // Middleware Setup
  app.use(
    require("node-sass-middleware")({
      src: path.join(__dirname, "public"),
      dest: path.join(__dirname, "public"),
      sourceMap: true
    })
    );
    
    // Express View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// default value for title local
app.locals.title = "Express - Generated with IronGenerator";


// Routes middleware goes here
const index = require('./routes/index');
app.use('/', index);
const passportRouter = require("./routes/passportRouter");
app.use('/', passportRouter);


module.exports = app;
