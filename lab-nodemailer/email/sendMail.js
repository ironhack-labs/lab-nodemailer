const transporter = require('./transport');
const fs = require('fs');
const path = require('path');
const hbs = require('handlebars');

const templateFile = path.join(__dirname,'./templates/mail_template.html');
const htmlstr = fs.readFileSync(templateFile).toString();
var template = hbs.compile(htmlstr);

const sendMail = (to, name, confirmationCode, code) => {
  return transporter.sendMail({
    from: "nadal084@protonmail.com",
    to,
    subject: "user confirmation", 
    html: template({
      username: name,
      confirmationCode:confirmationCode,
      token:code
      
    })
  })

  .then(info =>{
     console.log(info, "Mail sent")
 })
}

module.exports = sendMail;