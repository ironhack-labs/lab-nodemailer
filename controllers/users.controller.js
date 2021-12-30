const User = require('../models/User.model');
const mailer = require('../configs/nodemailer.config')

const salt = 10;
const mongoose = require('mongoose')

module.exports.edit = (req, res, next) => {
    res.render('users/register')
};

module.exports.doEdit = (req, res, next) => {

    function renderWithErrors(errors) {
        console.log(errors)
        res.status(400).render('users/register', {
            errors: errors,
            user: req.body
        })
    }
 
    console.log(req.body)

    User.findOne({ userName: req.body.userName })
        .then((user) => {

            if (user) {
                renderWithErrors({
                    userName: 'User Already exists'
                })
                //console.log (`${user} already exits`)

            } else {

                User.create(req.body)
                    .then((user) => {
                       
                        mailer.sendMail(user.email,user.confirmationCode);
                       // req.session.currentUserId = user.id
                        res.redirect('/')
                    }
                    )
                    .catch((e) => {
                        if (e instanceof mongoose.Error.ValidationError) {

                            renderWithErrors(e.errors)
                        }
                        else {
                            next(e)
                        }
                    });

            }
        })
        .catch((e) => next(e));


};

module.exports.login = (req, res, next) => res.render('users/login');

module.exports.doLogin = (req, res, next) => {
    function renderWithErrors(e) {
        console.log("error login")
        res.render('users/login', {
            user: req.body,
            errorMessage: e || 'Email or password is not correct'
        })
    }


    User.findOne({ userName: req.body.userName })
        .then((user) => {
            if (!user) {
                renderWithErrors();

            } else {
                console.log('SESSION =====> ', req.session);

                user.checkPassword(req.body.password)
                    .then(match => {
                        if (match) {
                            console.log(user.status)
                            if (user.status === 'Active') {

                            req.session.currentUserId = user.id
                            res.redirect('/profile')
                        } else {
                            renderWithErrors(`Your account is not active.Check your email`)
                        }

                        } else {


                            renderWithErrors()


                        }
                    })
                //     if (bcrypt.compareSync(req.body.password, user.password)) {
                //         console.log("req.session : ", req.session)
                //
                //         req.session.currentUserId = user.id
                //         res.redirect('/profile');
                //     }
            }

        })
        .catch((e) => next(e))
};

module.exports.profile = (req, res, next) => {
 //   console.log(" res:locals: ", res.locals)
    res.render('users/logon');
}

// logout de la sesión
module.exports.logout = (req, res, next) => {
    req.session.destroy();
    res.redirect('/');
}

module.exports.private = (req, res, next) => {
    res.render('users/private')
}
module.exports.main = (req, res, next) => {
    res.render('users/main')
}

module.exports.activate = (req,res,next) =>{
 User.findOneAndUpdate({confirmationCode :req.params.confirmationCode},
    {
        status:"Active",
        confirmationCode : "Active"
    })
    .then((user)=> {
        if (user){
        res.render('users/login',{
            user:req.body,
            message:"Congrats. You can already login session"
        })
    } else {
        res.redirect('/')
    }

    })
    .catch((e) => next(e))
}