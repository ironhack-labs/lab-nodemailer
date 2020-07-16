  
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
    <table cellpadding="60" cellspacing="0" border="0" width="100%">
      <tr bgcolor="#f3f3f3">
        <td align="center">
        <p style="padding-bottom:60px">Ironhack-Lab-Nodemailer</p>
          <table cellpadding="60" cellspacing="0" border="0" width="50%" align="center">
            <tr bgcolor="#fff">
              <td align="center">
              <img src="https://www.fundacionuniversia.net/wp-content/uploads/2017/09/ironhack_logo.jpg" width="200">
              <h1>Ironhack Confirmation Email</h1>
              <h4>Hello ${username}!</h4>
              <p>Thanks to join our community! Please confirm your account clicking on the following link:</p>
              <a href="${host}/auth/confirm/${confirmationCode}">${host}/auth/confirm/${confirmationCode}</a>
              <h4>Great to see you creating awesome webpages you with us! 😎</h4>
              </td>
            </tr>
          </table>
          <p style="padding-top: 40px; font-size: 20px">You are doing awesome! 💙</p>
        </td>
      </tr>
    </table>
		`
  })
}