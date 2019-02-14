let nodemailer = require('nodemailer')
let hbs = require('hbs')
let fs = require('fs')

let transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "ca.ortiz.pacheco@gmail.com",
    pass: "29041985solrac"
  }
})

const accountCreated = hbs.compile(fs.readFileSync((__dirname, './views/mail/accountCreated.hbs'), 'utf8'));

exports.sendWelcomeMail = function(name, email){

  transport.sendMail({
    from: "🤨",
    bcc: email,
    subject: "Bienvenido " + name,
    html: accountCreated({name})
    // html: `
    //   <h2>Hola ${name}</h2>
    //   <p>Como andas, mijo?, bienvenido al tu spam favorito</p>
    //   <a href="www.fixter.camp" >Dejar de recibir estos correos</a>
    // `
  })
  .then(r=>console.log(r))
  .catch(e=>console.log(e))

}