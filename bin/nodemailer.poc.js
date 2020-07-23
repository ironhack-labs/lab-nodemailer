const nodemailer = require('../configs/mailer.config');
const nodemailerAPI = require('../models/User.model');


nodemailerAPI.sendValidationEmail('tomas.bl.garcia@gmail.com');