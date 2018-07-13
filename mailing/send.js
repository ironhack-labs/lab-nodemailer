const dotenv=require('dotenv');
dotenv.config();
dotenv.config({path: './env.private'});
const {transporter} =require('../mailing/transporter.js');



let sendMail = (to,message)=>{

    return transporter.sendMail({
        from: "Hola,te has registrado",
        to:to,
        subject: "Nuevo email de confirmación",
        text : message,
        html:`<b>${message}</b>`

    })

    .then(info =>console.log(info))
    .catch(e => console.log(e));
}

module.exports=sendMail;
