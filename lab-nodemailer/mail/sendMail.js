const transporter = require("./transporter");

transporter.sendMail({
    from: '"My Awesome Project 👻" <myawesome@project.com>',
    to: 'receiver@myawesomereceiver.com', 
    subject: 'Prueba Risto', 
    text: 'Awesome Message',
    html: '<b>Awesome Message</b>'
})
.then(info => console.log(info))
.catch(error => console.log(error))


module.exports = transporter;