const {logger} = require("fyrebrick-helper").helpers;
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