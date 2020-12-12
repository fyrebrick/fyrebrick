const {logger} = require('../configuration/logger');

const isSignedIn = (req,res,next) => {
    //TODO check if successful signed in
    if(req.session.logged_in){ 
        next();
    }else{
        res.session.destroy((err)=>{
            logger.error(`could not destory session ${err.message}`);
        });
        res.redirect('/');
    }
};

module.exports = {
    isSignedIn
}