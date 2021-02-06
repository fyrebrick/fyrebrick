
const {google} = require("googleapis");
const {User} = require("fyrebrick-helper").models;
const {vars} = require('../../helpers/constants/vars');
const {logger} = require("fyrebrick-helper").helpers;
let googleConfig, defaultScope;

exports.startUp = () => {
    googleConfig = {
        clientId: vars.google.id,
        clientSecret: vars.google.secret,
        redirect: vars.google.redirect_uri
    };
    defaultScope = [
        "https://www.googleapis.com/auth/plus.me",
        "https://www.googleapis.com/auth/userinfo.email",
    ];
};

exports.createConnection = () => {
    return new google.auth.OAuth2(
        googleConfig.clientId,
        googleConfig.clientSecret,
        googleConfig.redirect
    );
};
/**
 *
 * @param auth
 * @returns {string}
 */
exports.getConnectionUrl = (auth) => {
    return auth.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: defaultScope
    });
};
/**
 *
 * @param auth
 * @returns {*}
 */
exports.getGooglePlusApi = (auth) => {
    return google.plus({version: "v2", auth});
};

/**
 * Creates a Google URL and send to the client to log in the user.
 */
exports.urlGoogle = () => {
    const auth = this.createConnection();
    return this.getConnectionUrl(auth);
};

/**
 * Take the "code" parameter which Google gives us once when the user logs in, then get the user"s email and id.
 * @param {String} code - query string after succesfully logging in with Google
 */
exports.getGoogleAccountFromCode = async (code) => {
    try {
        const oAuth2Client = await this.createConnection();
        const {tokens} = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);
        const oauth2 = google.oauth2("v2");
        const {
            data: {email, id: google_id}
        } = await oauth2.userinfo.v2.me.get({
            auth: oAuth2Client
        });
        return {
            googleId: google_id,
            email: email,
            tokens: tokens
        };
    }catch(err){
        return 'error';
    }

};
/**
 * Checks if the user that logged in is new or old.
 * If it"s a new user it creates a default empty User, Settings and profile model.
 * If it"s an old user it set the session parameters correct
 *
 **/
exports.checkSignIn = async function    checkSignIn(req) {
    let googleId = req.session.googleId;
    let tokens = req.session.tokens;
    let email = req.session.email;
    let user = await User.findOne({googleId: googleId}, function (err, User) {
        if(err) {
            logger.error(`thrown at /src/middlewares/google.checkSignIn on method User.findOne trace: ${err.message}`);
            throw new Error(err);
        }   
    });
    if (user && user.setUpComplete) {
        req.session._id = user._id;
        req.session.logged_in = true;
        return user;
    }
    if(!user){
        user = new User({
            googleId: googleId,
            email: email,
            tokens: tokens
        });
        await user.save((err)=>{
            if(err) 
            logger.error(`thrown at /src/middlewares/google.checkSignIn on method newUser.save trace: ${err.message}`);
        });
    }
    req.session._id = user._id;
    req.session.logged_in = false;
    return user;
};
