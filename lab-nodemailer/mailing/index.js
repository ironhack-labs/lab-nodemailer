
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

const options = {
    viewEngine: {
        extname: '.hbs',
        layoutsDir: 'views/mailTemplates',
        partialsDir : 'views/partials/'
    },
    viewPath: 'views/mailTemplates',
    extName: '.hbs'
};

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: "pepe04444@gmail.com", 
        pass: "m20684-m20684"
    }
});

transporter.use('compile', hbs(options));

const sendMail = (user) => {
    let mail = {
        to: user.email, 
        subject: 'Confirmate Your Account!',
        template: 'index',
        context: {user}
    };
    return transporter.sendMail(mail)
}

module.exports = sendMail;