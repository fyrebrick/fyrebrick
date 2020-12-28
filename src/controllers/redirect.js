const google = require('../helpers/auth/google');
const {User} = require("fyrebrick-helper").models;
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
        await google.checkSignIn(req);
        res.redirect('/');
    }
}

module.exports = redirect;