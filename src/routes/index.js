var express = require('express');
var router = express.Router();
const google =require('../middlewares/google');
const User = require('../models/user');
const {checkSignIn} = require('../middlewares/index');
const api = require('./api');
router.get('/',(req,res,next)=>{
    if(req.session.logged_in !== undefined){
        if(req.session.logged_in){
            console.log(req.session);
            res.render("index");
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
   res.render('invest');
});

router.post('/register', async (req,res,next)=>{
    console.log(req.body);
    let updateUser = {
        CONSUMER_KEY:req.body.consumerKey,
        CONSUMER_SECRET:req.body.consumerSecret,
        TOKEN_SECRET:req.body.tokenSecret,
        TOKEN_VALUE:req.body.tokenValue,
        setUpComplete:true,
    };
    await User.updateOne({_id:req.session._id},updateUser,(data,err)=>{
        console.log(data,err);
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
    console.log(req.session);
    res.redirect('/');
});

router.get('/orders/:order_id/items',checkSignIn,(req,res,next)=>{
   res.render('order',{
      'order_id':req.params.order_id
   })
});

router.get('/status/:status',checkSignIn,(req,res,next)=>{
    console.log(req.params.status);
    res.render('status',{'status':req.params.status});
});

router.get('/inventories',checkSignIn,(req,res,next)=>{
    res.render('inventory');
});

module.exports = router;
