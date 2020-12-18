const {logger} = require('../configuration/logger');

const isSignedIn = (req,res,next) => {
    //TODO check if successful signed in
    if(req.session){
        if(req.session.logged_in){
            next();
        }else if(!req.session.logged_in){
            logger.info(`Not logged in anymore, redirecting to homepage`);
            res.redirect('/');
        }
    }else{
        res.redirect('/');
    }
};

module.exports = {
    isSignedIn
}