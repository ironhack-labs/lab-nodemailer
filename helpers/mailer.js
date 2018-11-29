const nodemailer = require("nodemailer")
const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user:"pilymdm@bu.edu",
    pass:"KUROnuma01"
  }
});

function welcomeMail(email,name,confirmationCode){
  transport.sendMail({
    to:email,
    subject: "Bienvenido!",
    from: "estemailsesustituyeporelanterior@gmail.com",
    html: `
    <h1>Bienvenido ${name}</h1>
    <p>Da click a tu código de confirmación:</p>
    <p>${confirmationCode}</p>
    <p>http://localhost:5000/auth/confirm/THE-CONFIRMATION-CODE-OF-THE-USER</p>

    `
  
  })
  .then(res => {
    console.log(res)
  }).catch (e => {
    console.log(e);
  })
}

module.exports = {welcomeMail}