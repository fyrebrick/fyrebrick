const {logger} = require("fyrebrick-helper").helpers;

const isSignedIn = (req,res,next) => {
    if(req.session){
        if(req.session.logged_in){
            next();
        }else if(!req.session.logged_in){
            logger.info(`Not logged in anymore, redirecting to homepage`);
            res.redirect(`/logon?returnUrl=${encodeURIComponent(req.originalUrl)}`);
        }
    }else{
        logger.info(`Not logged in anymore, redirecting to homepage`);
        res.redirect(`/logon?returnUrl=${encodeURIComponent(req.originalUrl)}`);
    }
};

module.exports = {
    isSignedIn
}