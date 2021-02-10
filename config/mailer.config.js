const nodemailer = require ('nodemailer')
const { generateTemplate } = require ('./mailtemplate')

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.NM_USER,
        pass: process.env.NM_PASSWORD
    }
});

module.exports.sendActivationEmail = (email, token)=>{
    transporter.sendMail({
        from: `"CarlosJavier" <${process.env.NM_USER}>`,
        to: email,
        subject: "¡Gracias por unirte!",
        html: generateTemplate(token)
    })
}