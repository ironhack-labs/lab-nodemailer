const nodemailer = require("nodemailer");
const hbs = require("hbs");
const fs = require("fs");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

// filename sera la vista a compilar por handle bars
// options sera un objeto que recibira para que sean interpretados
// al compilar el archivo con handle bars
const generateHTML = (filename, options) => {
  const html = hbs.compile(
    fs.readFileSync((__dirname, `./views/mail/${filename}.hbs`), "utf-8")
  );
  // al compilado de handlebars, le mandamos un objeto que
  //sera interpretado y sustituyendo atributos
  return html(options);
};

exports.send = options => {
  const html = generateHTML(options.filename, options);
  const mailOptions = {
    from: "Lab Nodemailer", 
    to: options.email,
    subject: options.subject,
    confirmationUrl: options.confirmationUrl,
    html
  }
  return transporter.sendMail(mailOptions);
};
