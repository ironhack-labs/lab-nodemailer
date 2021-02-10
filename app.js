require('dotenv').config();

const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const session = require("./configs/sesion.config")
const sessionMiddleware = require ('./middlewares/session.middleware')

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// require database configuration
require('./configs/db.config');

// Middleware Setup
app.use(logger('dev'));
app.use(express.json()); // Usar esto o body parser, que ya esta incluido en express.
app.use(express.urlencoded({ extended: false })); // en peticiones post nos da la info como el req.body
app.use(session)

// Express View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + "/views/partials")
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));


// default value for title local
app.locals.title = 'Ironhack, Lab-Nodemailer';

app.use(sessionMiddleware.findUSer)

const index = require('./routes/index.routes');
app.use('/', index);

module.exports = app;
