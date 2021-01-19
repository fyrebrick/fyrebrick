const google = require('../helpers/auth/google');
const {User} = require("fyrebrick-helper").models;
const {logger} = require('fyrebrick-helper').helpers;
const redirect={
    get:async(req,res,next)=>{
        let googleCode = await google.getGoogleAccountFromCode(req.query.code);
        req.session.email = googleCode.email;
        req.session.googleId = googleCode.googleId;
        req.session.tokens = googleCode.tokens;
        let user = await User.findOne({googleId:googleCode.googleId});
        if(user){
            req.session.user = {
                TOKEN_VALUE: user.TOKEN_VALUE,
                TOKEN_SECRET: user.TOKEN_SECRET,
                CONSUMER_KEY: user.CONSUMER_KEY,
                CONSUMER_SECRET: user.CONSUMER_SECRET
            };
        }
        try{
        user = await google.checkSignIn(req);
        console.log(user);
        }catch(err){
            console.log(err);
        }
        if(!user){
            logger.warn(`User not found after creating !`);
            res.redirect('/');
            return;
        }else{
            if(user.isBlocked){
                logger.warn(`user ${req.session.email} was blocked entry`);
                req.session.logged_in = false;
                //req.flash("warning","You entry was denied, but we have put you in a queue");
                res.redirect('/');
                return;
            }
        }


        if(req.query && req.query.returnUrl){
            res.redirect(decodeURIComponent(req.query.returnUrl));
        }else{
            res.redirect('/');
        }
    }
}

module.exports = redirect;