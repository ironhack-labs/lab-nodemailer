const isActive = (req, res, next) => {
    if (req.user.status == "Active") {
        next();
    } else {
        req.flash('error', 'You are not active');
        res.redirect(redirectTo);
    }
}

const ensureLoggedIn = (redirectTo) => {
    return (req, res, next) => {
        if(req.user){
            next();
        }else{
            req.flash('error','You have to login first');
            res.redirect(redirectTo);
        }
    }
}

const ensureLoggedOut = (redirectTo) => {
    return (req, res, next) => {
        if(!req.user){
            next();
        }else{
            req.flash('error','You are logged in, cannot access');

            res.redirect(redirectTo);
        }
    }
}
module.exports = {ensureLoggedIn, isActive, ensureLoggedOut};