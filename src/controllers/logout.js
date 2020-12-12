const {logger} = require('../configuration/logger');

const logout ={
    get:(req,res,next) => {
        req.session.destroy((err=>{
            if(err)
                logger.error(`destroying session gave error ${err.message}`);
            res.removeHeader('Cookie');
            res.redirect('/')
        }));

    }
}

module.exports = logout;