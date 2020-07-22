require("dotenv").config();
const nodemailer = require("nodemailer");

const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: user,
    pass: pass,
  },
});

module.exports.handleForm = (name, email, confirmationCode) => {
  transport.sendMail({
    to: email,
    from: `Por favor confirma tu email! <${user}>`,
    subject: "Hemos recibido tu solicitud!",
    html: `<h1>Confirmar tu Email!</h1>
        <h2>Hola ${name}</h2>
        <p> Gracias por perternecer a nuestra comunidad ahora haz clic en el enlace para confirmar</p>
        <a href=http://localhost:3000/auth/confirm/${confirmationCode}> Haz click aqui</a>
        </div>`,
  });
};
