const transporter = require("./transporterGmail");
const path = require("path");


const sendAwesomeMail = (to, mens, from = "myawesome@project.com") => {
   return transporter.sendMail({
          from: `"My Awesome Project 👻" <${from}>`,
          to,
          subject: "Awesome Subject", // Asunto
          html: mens
        })
        .then(info => console.log(info));
    
};
module.exports = sendAwesomeMail;