var express = require('express');
var router = express.Router();
const google =require('../middlewares/google');
const User = require('../models/user');
const {checkSignIn} = require('../middlewares/index');
const api = require('./api');
const ordersRoute = require('./orders');

router.use('/orders',checkSignIn,ordersRoute);

router.get('/',(req,res)=>{
    if(req.session.logged_in !== undefined){
        if(req.session.logged_in){
            res.render("dashboard",{active:"dashboard"});
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
            res.render("dashboard",{active:"dashboard"});
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

router.get('/change',checkSignIn,async(req,res,next)=>{
   res.render('welcome',{
       titleJumbo:"Update profile",
       buttonTitle:"Update your profile",
       user:await User.findOne({_id:req.session._id})
   }) ;
});
router.get('/invest',checkSignIn,async(req,res,next)=>{
   res.render('invest',{active:"inventory"});
});

router.post('/register', async (req,res,next)=>{
    let updateUser = {
        CONSUMER_KEY:req.body.consumerKey,
        CONSUMER_SECRET:req.body.consumerSecret,
        TOKEN_SECRET:req.body.tokenSecret,
        TOKEN_VALUE:req.body.tokenValue,
        setUpComplete:true,
    };
    await User.updateOne({_id:req.session._id},updateUser,(data,err)=>{
    });
    req.session.logged_in = true;
    res.redirect('/');
});
//test
router.get('/redirect',async (req,res,next)=>{
    let googleCode = await google.getGoogleAccountFromCode(req.query.code);
    req.session.email = googleCode.email;
    req.session.googleId = googleCode.googleId;
    req.session.tokens = googleCode.tokens;
    await google.checkSignIn(req);
    res.redirect('/');
});

router.get('/inventories',checkSignIn,(req,res,next)=>{
    res.render('inventory',{active:"inventory"});
});
router.get('/add',checkSignIn,(req,res,next)=>{
    res.render('add',{active:"inventory"});
});



module.exports = router;
