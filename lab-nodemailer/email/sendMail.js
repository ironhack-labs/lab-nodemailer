const transporter = require('./transport');
const fs = require('fs');
const path = require('path');
const hbs = require('handlebars');

const templateFile = path.join(__dirname,'./templates/email_template.html');
const htmlstr = fs.readFileSync(templateFile).toString();
var template = hbs.compile(htmlstr);

const sendMail = (to, subject, name, code) => {
  return transporter.sendMail({
    from: process.env.GMAIL_USER,
    to,
    subject,
    text: subject,
    html: template({
      username: name,
      token: code
    })
  })
  .then(info => {
    console.log(info, "Mail sent")
  })
  .catch(error => console.log("Error sending mail", error));
}


module.exports = sendMail;
