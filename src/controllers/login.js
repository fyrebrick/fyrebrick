const google = require('../helpers/auth/google');
const logon = (req,res,next) => {
    if(req.session.logged_in !== undefined){
        if(req.session.logged_in){
            if(req.query && req.query.returnUrl){
                req.session.returnUrl = undefined;
                res.redirect(decodeURIComponent(req.query.returnUrl));
            }else{
                res.redirect("/my/dashboard");
            }
            return;
        }else{
            res.render("register",{
                titleJumbo:"Welcome",
                buttonTitle:"Create your profile"
            });
            return;
        }
    }
    if(req.query && req.query.returnUrl){
        console.log(google.urlGoogle());
        req.session.returnUrl = req.query.returnUrl;
        res.redirect(google.urlGoogle());
    }else{
        res.redirect(google.urlGoogle());
    }
}

const index = (req,res,next) => {
    if(req.session && req.session.logged_in !== undefined){
        if(req.session.returnUrl){
            res.redirect(req.session.returnUrl);
            return;
        }else
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