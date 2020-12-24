const hbs = require('hbs');
const favicon = require('serve-favicon');
const express = require('express');
const path = require('path');
const app = express();
//app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

app.use(express.static(path.join(__dirname, 'public')));

hbs.registerHelper('ifUndefined', (value, options) => {
    if (arguments.length < 2)
        throw new Error("Handlebars Helper ifUndefined needs 1 parameter");
    if (typeof value !== undefined) {
        return options.inverse(this);
    } else {
        return options.fn(this);
    }
});

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
