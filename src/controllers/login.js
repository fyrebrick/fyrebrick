const google = require('../helpers/auth/google');

const logon = (req,res,next) => {
    if(req.session.logged_in !== undefined){
        if(req.session.logged_in){
            res.redirect("/my/dashboard");
            return;
        }else{
            res.render("register",{
                titleJumbo:"Welcome",
                buttonTitle:"Create your profile"
            });
            return;
        }
    }
    res.redirect(google.urlGoogle());
}

const index = (req,res,next) => {
    if(req.session.logged_in !== undefined){
        if(req.session.logged_in){
            res.redirect("/my/dashboard");
            return;
        }else{
            res.render("register",{
                titleJumbo:"Welcome",
                buttonTitle:"Create your profile"
            });
            return;
        }
    }else{
        res.render('logon');
    }
}

module.exports = 
{
    logon,
    index
};