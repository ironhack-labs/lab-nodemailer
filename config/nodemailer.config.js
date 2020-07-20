const nodemailer = require('nodemailer')

const host = process.env.HOST || 'http://localhost:3000'

const user = process.env.NM_USER
const pass = process.env.NM_PASS

const transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: user,
    pass: pass
  }
})
module.exports.sendValidationEmail = (username, email, confirmationCode) => {
  transport.sendMail({
    to: email,
    from: `Nodemailer Lab <${username}>`,
    subject: 'Activate your account',
    html: `
              <h1>Ironhack Confirmation Email</h1>
              <h4>Hello ${username}!</h4>
              <p>Thanks to join our community! Please confirm your account clicking on the following link:</p>
              <a href="${host}/auth/confirm/${confirmationCode}">${host}/auth/confirm/${confirmationCode}</a>
              <h4>Great to see you creating awesome webpages you with us!</h4>
		`
  })
}