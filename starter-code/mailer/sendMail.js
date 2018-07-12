//const mjml = require("mjml")
const transporter = require("./transporter")
const  hbs = require("hbs")
const fs = require("fs")
const path = require("path")
module.exports = (to,template,obj)=>{
    const template2 = hbs.compile(fs.readFileSync(path.join(__dirname,template),"UTF8"))
    const result = template2(obj)

    transporter.sendMail({
        to, 
        subject: 'Awesome Subject', 
        html: result
      })
      .then(info => console.log(info))
      .catch(error => console.log(error))
}