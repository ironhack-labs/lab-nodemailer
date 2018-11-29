const nodemailer = require("nodemailer")

const transport = nodemailer.createTransport({
    service: "Gmail",
    auth:{
        user: "fire.foxyafi@gmail.com",
        pass: "classified"
    }
})

function welcomeMail(email, name) {
    return transport.sendMail({
        to: email,
        subject: "Ejemplo",
        from: "example@ejeje.com",
        html:`
        <h1>Bienvenido ${name}</h1>
        <p> gracias por tu info </p>`
    })
    .then(res =>{
        console.log(res)
    })
    .catch( e=> console.log(e))
}

module.exports = { welcomeMail}