const nodemailer = require('nodemailer');

const host = process.env.HOST || 'http://localhost:3000';
const user = process.env.NM_USER || 'dev';

const transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: user,
        pass: process.env.NM_PASS
    }
});

module.exports.sendValidationEmail = (email, activationToken) => {
    transport.sendMail({
        from: user,
        to: email,
        subject: 'Validate your email',
        html: `<h1>Click <a href="${host}/auth/activate/${activationToken}">here</a> to validate your email</h1>`
    })
    .then(info => console.log(info))
    .catch(e => console.error(e));
};