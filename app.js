// PAQUETES NPM
// ========================================================================================
require('dotenv').config() // Env variables
const cookieParser = require('cookie-parser') // Cookie parser
const express = require('express'); // Express
const favicon = require('serve-favicon'); // Favicon
const hbs = require('hbs'); // Handlebars
const mongoose = require('mongoose'); // Mongoose
const logger = require('morgan');
const path = require('path');
const http = require('http');

// ARCHIVOS
// ========================================================================================
const session = require('./configs/session.config');
const routes = require('./routes/index.routes');
const User = require('./models/User.model');
const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

// EXPRESS APP
// ========================================================================================
const app = express();

// require database configuration
require('./configs/db.config');

// MIDDLEWARES
// ========================================================================================
app.use(logger('dev')); // Use morgan - Line 7
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); // Use cookie parser - Line 2
app.use(session); // usar sessions - Line 13

// HBS
// ========================================================================================
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
hbs.registerPartials(__dirname + "/views/partials");
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// DEFAULT TITLE
app.locals.title = 'Express App - Manuel Carrillo';

// CARGAR EL USUARIO DE LA SESION
// ========================================================================================
app.use((req, res, next) => {
    if(req.session.currentUserId){
        User.findById(req.session.currentUserId)
            .then(user => {
                if(user){
                    req.currentUser = user
                    res.locals.currentUser = user
                    next()
                }
            })
    } else {
        next()
    }
})

// RUTAS
// ========================================================================================
app.use('/', routes);


// PARA MANEJAR ERRORES 
// ========================================================================================
app.use((req, res, next) => {
    res.status(404);
    res.render('not-found');
});

app.use((err, req, res, next) => {
    // always log the error
    console.error('ERROR', req.method, req.path, err);

    // only render if the error ocurred before sending the response
    if (!res.headersSent) {
        res.status(500);
        res.render('error');
    }
});

let server = http.createServer(app);

server.on('error', error => {
    if (error.syscall !== 'listen') { throw error }
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(`Port ${process.env.PORT} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`Port ${process.env.PORT} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
});

// LISTEN ON PORT X 
// ========================================================================================
server.listen(process.env.PORT || 3001, () => {
    console.log(`Listening on http://localhost:${process.env.PORT}`);
});
