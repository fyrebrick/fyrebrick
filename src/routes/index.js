var express = require('express');
var router = express.Router();
const google =require('../middlewares/google');
const User = require('../models/user');
const {checkSignIn} = require('../middlewares/index');
const apiRoutes = require('./apiRoutes');
const plusRoutes = require('./plus');
const accountRoutes = require("./account");

router.use('/account',checkSignIn,accountRoutes);
router.use('/api',checkSignIn,apiRoutes)
router.use('/plus',checkSignIn,(req,res,next)=>{
    res.setHeader('Content-Type', 'application/json');
    next();
},plusRoutes);
router.get('/',(req,res)=>{
    if(req.session.logged_in !== undefined){
        if(req.session.logged_in){
            res.redirect("/account/dashboard");
            return;
        }else{
            res.render("welcome",{
                titleJumbo:"Welcome",
                buttonTitle:"Create your profile"
            });
            return;
        }
    }else{
        res.render('logon');
    }
});
router.get('/logon',(req,res,next)=>{
    if(req.session.logged_in !== undefined){
        if(req.session.logged_in){
            res.redirect("/account/dashboard");
            return;
        }else{
            res.render("welcome",{
                titleJumbo:"Welcome",
                buttonTitle:"Create your profile"
            });
            return;
        }
    }
    res.redirect(google.urlGoogle());
});

router.get('/logout',(req,res,next)=>{
    req.session.destroy();
    res.redirect('/');
});

//test
router.get('/redirect',async (req,res,next)=>{
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
});

module.exports = router;
