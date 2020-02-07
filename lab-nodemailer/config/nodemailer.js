require('dotenv').config()

const fs=require('fs')
const path=require('path')
const hbs=require('hbs')
const nodemailer=require('nodemailer')

const welcomeTemplate=hbs.compile(
  fs.readFileSync((__dirname,'./views/template-email.hbs'),'utf8')
)

const transporter=nodemailer.createTransport({
  service:'Gmail',
  auth:{
    user:process.env.SENDGRID_USERNAME,
    pass:process.env.SENDGRID_PASSWORD
  }
})

exports.confirmAccount=async (to,endpoint)=>{
  return await transporter.sendMail({
    from: "'Lic. Arturo Araujo'<contacto@bbva.com>",
    to,
    subject:'Confirm your account',
    html: welcomeTemplate({endpoint})
  })
}