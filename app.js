require('dotenv').config();

const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);
const session = require('./configs/session.config')
const sessionMiddleware = require('./middlewares/session.middleware')
const app = express();

// require database and session config
require('./configs/db.config');


// Middleware Setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));  
app.use(session)                         

// Express View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');                           
app.use(express.static(path.join(__dirname, 'public'))); 
hbs.registerPartials(__dirname + "/views/partials");
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// middlerware de sesion
app.use(sessionMiddleware.registeredUser)

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

// middleware de rutas
const index = require('./configs/routes/index.routes')
const user = require('./configs/routes/user.routes')
app.use('/', index); 
app.use('/', user)

module.exports = app;
