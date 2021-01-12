const {logger} = require("fyrebrick-helper").helpers;
const logout ={
    get:(req,res,next) => {
        req.session.destroy((err=>{
            if(err)
                logger.error(`destroying session gave error ${err.message}`);
            res.clearCookie('fyrebrick_login');
            res.removeHeader('Cookie');
            res.redirect('/');
        }));

    }
}

module.exports = logout;