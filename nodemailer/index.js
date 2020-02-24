const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "americazurita@gmail.com",
    pass: ""
  }
});

function sendMail({ to, confirmationCode }) {
  const html = `
    <b>Please verify!</b>
    <a href="http://localhost:3000/auth/confirm/${confirmationCode}"> Verificar! </a>
`;

  console.log(html);

  transporter
    .sendMail({
      to,
      html,

      from: '"cofficlass" <myawesome@project.com>',
      subject: "Awesome Subject",
      text: "Awesome Message"
    })
    .then(info => console.log("infoooo", info))
    .catch(error => console.log("erroooor", error));
}

module.exports = {
  sendMail
};
