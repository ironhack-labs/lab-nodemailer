const transport = require("./transport")



const sendMail= (email,message) => transport.sendMail({
    from: '"María la mejor" <m>',
    to: email,
    subject: "",
    text: message,
    html: `${message}`
})

module.exports = sendMail