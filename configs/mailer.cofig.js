const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.NM_USER,
        pass: process.env.NM_PASSWORD
    }
})

module.exports.sendActivationEmail = (email, code) => {
	transporter.sendMail({
		from: `"Ironhack, Lab-Nodemailer" <${process.env.NM_USER}>`,
		to: email,
		subject: "Thanks for joining us!",
        html: `
            <h1>Thanks for joining us!</h1>
            <a href="${process.env.HOST || `http://localhost:${process.env.PORT || 3000}`}/activate/${code}">Click here</a>`
            //generateTemplate(token)
	})
}