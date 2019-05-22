require("dotenv").config()
const nodemailer= require("nodemailer")

let connectEmailtoServer = nodemailer.createTransport({
    service:"Gmail",
    auth:{
        user: process.env.USERNAME,
        pass: process.env.PASSWORD
    }
})
module.exports = connectEmailtoServer;