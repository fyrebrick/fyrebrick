var express = require('express');
var router = express.Router();
const google =require('../middlewares/google');
const User = require('../models/user');
const {checkSignIn} = require('../middlewares/index');
const api = require('./api');

router.get('/',async (req,res,next)=>{
    if(req.session.logged_in !== undefined){
        if(req.session.logged_in){
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
    if(process.env.DEVELOP=="false"){
        res.redirect(google.urlGoogle());
    }else{
        const currentUser = await User.findOne({googleId: "1"}, function (err, User) {
            if(err) {
                console.trace("[ERROR]: thrown at /src/middlewares/google.checkSignIn on method User.findOne trace: "+err.message);
                throw new Error(err);
            }
        });
        console.log(currentUser);
        req.session.email = "developing"
        req.session.googleId = "1";
        req.session.tokens = {};
        if (!currentUser) {//new user, add user to database
            //create user
            const newUser = new User({
                googleId: "1",
                email: "developing",
                tokens: {}
            });
            await newUser.save((err)=>{
                if(err) console.trace("[ERROR]: thrown at /src/middlewares/google.checkSignIn on method newUser.save trace: "+err.message);});
            req.session._id = newUser._id;
            req.session.logged_in = false;
            res.redirect('/welcome');
        } else {//user already added
            req.session._id = currentUser._id;
            if(currentUser.setUpComplete){
                req.session.logged_in = true;
                res.render('index');
            }else{
                req.session.logged_in = false;
                res.render('welcome');
            }
        }

    }
    
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

router.get('/orders/:order_id/items',checkSignIn,async (req,res,next)=>{
   res.render('order',{
      'order_id':req.params.order_id
   })
});

router.get('/status/:status',checkSignIn,(req,res,next)=>{
    res.render('status',{'status':req.params.status});
});

router.get('/inventories',checkSignIn,(req,res,next)=>{
    res.render('inventory');
});
router.get('/add',checkSignIn,(req,res,next)=>{
    res.render('add');
});



module.exports = router;
