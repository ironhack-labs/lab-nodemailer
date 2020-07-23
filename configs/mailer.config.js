require('dotenv');
const nodemailer = require('nodemailer');

const host = process.env.HOST || 'http://localhost:3000';
const user = process.env.NM_USER || 'dev';

console.log('username: ' + user);
console.log('password: ' + process.env.NM_PASS);

const transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: user,
        pass: process.env.NM_PASS
    }
});

module.exports.sendValidationEmail = (email) => {
    transport.sendMail({
        from: user,
        to: email,
        subject: 'This is fine',
        text: 'Hello world',
        html: '<h1>Skere</h1>'
    })
    .then(info => console.log(info))
    .catch(next);
};