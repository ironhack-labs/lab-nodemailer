let nodemailer = require ('nodemailer')
let hbs = require('hbs')
let fs = require('fs')

let transport = nodemailer.createTransport({
  service:"Gmail",
  auth:{
    user:"danielazr2589@gmail.com",
    pass:"Mojo2511"
  }
},)

const accountCreated = hbs.compile(fs.readFileSync((__dirname, './views/mail/accountCreated.hbs'), 'utf8'));

exports.sendWelcomeMail = function (username, email,confirmationCode){
  transport.sendMail({
    from:"Daniela from Winterfell",
    bcc: email,
    subject: "Welcome" + username,
    html: `
    <h2>Hello ${username}</h2>
    <p>Confirm your email account<a href="http://localhost:3000/auth/confirm/${confirmationCode}"> and...Winterfell is yours!</a></p>`
  })
  .then(r=>console.log(r))
  .catch(e=>console.log(e))
}
