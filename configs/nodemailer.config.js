const nodemailer = require ("nodemailer");

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.NN_USER,
      pass: process.env.NN_PWD 
    }
  });


  module.exports.sendMail = (email,token) =>{

    transporter.sendMail({
        from: `"LAB-NODEMAILER " <${process.env.NNUSER}>`,
        to: email, 
        subject: 'Confirm signation', 
        text: 'Please confirm signation',
        html: `
        <h1> sign confirmation</h1>
        <b>Please confirm signation</b>
        <a href="${process.env.HOST || `http://localhost:${process.env.PORT || 3000}`}/activate/${token}">Click Here </a>
        `
        
      })
      .then(info => console.log(info))
      .catch(error => console.log(error))
      
  }
  
