require('dotenv').config()
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'SendGrid',
    auth: {
        user: process.env.SGUSER,
        pass: process.env.SGPASSWORD
    }
})

exports.sendRe = (email, name, confirmationCode) => {
    return transporter.sendMail({
        from: '"Ironhack México" <contacto@ironhack.com>',
        to: email,
        subject: 'Ironhack Confirmation email',
        html: `<img src="https://www.fundacionuniversia.net/wp-content/uploads/2017/09/ironhack_logo.jpg" />
        <h1>Ironhack Confirmation email</h1>
               <h2>Hello ${name}</h2> 
               <p>Thanks to join our community! Please confirm your clicking
               on the following link
               </p>
               <h3>http://localhost:3000/auth/confirm/${confirmationCode}</h3>
               <h2>Great to see you creating awesome webpages you whit us</h2>
          `

    })
}