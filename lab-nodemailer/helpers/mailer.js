const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.gmail,
        pass: process.env.gmailPass
    }
})

exports.sendWelcomeMail = (user) => {
    const data = {
        from: ' "PP lab-Mailer", mabvmex@gmail.com ',
        to: user.email,
        subject: 'PP > lab-mailer',
        html: `<a href="http://localhost:3000/confirm/${user.confirmationCode}"> Confirma correo</a>`
    }
    transporter.sendMail(data)
    .then(info=>{
        console.log(info);
    })
    .catch(error =>{
        console.log(error);
    } )
}

