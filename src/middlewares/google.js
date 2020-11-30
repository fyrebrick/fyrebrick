const {google} = require("googleapis");
const User = require("../models/user.js");
let googleConfig, defaultScope;

exports.startUp = () => {
    if (process.env.DEVELOP === 'true') {
        googleConfig = {
            clientId: process.env.GOOGLE_CLIENT_ID, // e.g. asdfghjkljhgfdsghjk.apps.googleusercontent.com
            clientSecret: process.env.GOOGLE_CLIENT_SECRET, // e.g. _ASDFA%DFASDFASDFASD#FAD-
            redirect: process.env.DEVELOP_GOOGLE_REDIRECT_URL // this must match your google api settings
        };
    } else {
        googleConfig = {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            redirect: process.env.PRODUCTION_GOOGLE_REDIRECT_URL
        };
    }
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
exports.checkSignIn = async function checkSignIn(req) {
    let googleId = req.session.googleId;
    let tokens = req.session.tokens;
    let email = req.session.email;
    const currentUser = await User.findOne({googleId: googleId,setUpComplete:true}, function (err, User) {
        if(err) {
            console.trace("[ERROR]: thrown at /src/middlewares/google.checkSignIn on method User.findOne trace: "+err.message);
            throw new Error(err);
        }
    });
    if (!currentUser) {//new user, add user to database
        //create user
        const newUser = new User({
            googleId: googleId,
            email: email,
            tokens: tokens
        });
        await newUser.save((err)=>{
            if(err) console.trace("[ERROR]: thrown at /src/middlewares/google.checkSignIn on method newUser.save trace: "+err.message);});
        req.session._id = newUser._id;
        req.session.logged_in = false;
        return newUser._id;
    } else {//user already added
        req.session._id = currentUser._id;
        req.session.logged_in = true;
        return currentUser._id;
    }
};
