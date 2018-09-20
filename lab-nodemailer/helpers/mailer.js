const nodemailer = require ('nodemailer')


const transporter = nodemailer.createTransport ({
  service:'Gmail',
  auth:{
    user:'andrewvalenciamunoz@gmail.com',
    pass:'ironhack2018'
  }
})


exports.sendMail = (email,username,confimationCode)=>{
  transporter.sendMail({
    from:'Nueva App',
    to:email,
    subject:'Bienvenido a nuestra app',
    text:'lorem ipsum',
    html:`

    <img src="https://joseramonsahuquillo.com/wp-content/uploads/2016/10/ironhack.png">
    
        <h1>Ironhack confirmation Email</h1>
        
        <h3>Hello ${username} </h3>
        
        <p>Thanks to join, please confirm your account clicking on the following link:</p>
        
        
        <a href='http://localhost:3000/auth/confirm/${confimationCode}'>http://localhost:3000/auth/confirm/${confimationCode}</a>
        
        <h2>Great to see you creating awesome webpages with us ! :)</h2>`
  })
  .then (info => console.log (info))
  .catch (e=>console.log (e))
}