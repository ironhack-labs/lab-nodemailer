const transport = require("./transport");

/* let { email, subject, message } = req.body; */

const sendMail = (email, content) => {
  console.log(email, content, "holaaaaaaaa");
  return transport
    .sendMail({
      to: email,
      subject: "Mate's mail",
      html: `<b>${content}</b>`
    })
    .then(info => console.log(info))
    .catch(error => console.log(error));
};

module.exports = sendMail;
