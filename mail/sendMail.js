const {transport} = require('./transporter')

const sendMail = (user) => {
  return transport.sendMail({
    to: user.email,
    subject: "Activate your account",
    html: `<a href="http://localhost:3000/confirm/${user.confirmationCode}"> Click to activate</a>`
  }) 
    .then(info => console.log(info))
    .catch(error => console.log(error));
};

module.exports = { sendMail };
