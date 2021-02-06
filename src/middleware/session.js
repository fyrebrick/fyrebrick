const {logger} = require("fyrebrick-helper").helpers;
const {User} = require('fyrebrick-helper').models;
const isSignedIn = async (req,res,next) => {
    if(req.session){
        if(req.session.logged_in){
            const user = await User.findById(req.session._id);
            if(user && req.session && req.session._id && req.cookies && req.cookies.fyrebrick_setAcceptCookie){
                if(req.cookies.fyrebrick_setAcceptCookie){
                    await User.updateOne({_id:req.session._id},{isAcceptedCookies:true});
                }
            }
            if(user && user.isAcceptedCookies && req.session && req.session.user && req.sessionID){
                //expires after 3 days of setting
                res.cookie('fyrebrick_login', req.sessionID, {signed:true,expires: new Date(Date.now()+259200000)}); 
            }
            next();
        }else if(!req.session.logged_in){
            logger.info(`Not logged in anymore, redirecting to homepage`);
            res.redirect(`/logon?returnUrl=${encodeURIComponent(req.originalUrl)}`);
        }
    }else if(req.originalUrl){
        logger.info(`Not logged in anymore, redirecting to homepage`);
        res.redirect(`/logon?returnUrl=${encodeURIComponent(req.originalUrl)}`);
    }else{
        res.redirect(`/logon`);
    }
};

module.exports = {
    isSignedIn
}