const {logger} = require('../configuration/logger');

const isSignedIn = (req,res,next) => {
    //TODO check if successful signed in
    if(req.session){
        if(req.session.logged_in){
            next();
        }else if(!req.session.logged_in){
            logger.info(`Not logged in anymore, redirecting to homepage`);
            try{
                req.session.destroy((err)=>{
                    if(err){
                        logger.error(`Caught error on destroying session in callback`);
                    }
                });
            }catch(err){
                logger.error(`Caught error on destroying session`);
            }
            res.redirect('/');
        }
    }else{
        res.redirect('/');
    }
};

module.exports = {
    isSignedIn
}