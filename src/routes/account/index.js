const express = require('express');
const router = express.Router();
const investigateRoutes = require("./investigateRoutes")
const inventoriesRoutes = require("./inventories");
const settingsRoutes = require("./settingsRoutes");
const statsRoutes = require("./statsRoutes");
const User = require('../../models/user');

router.get('/update',checkSignIn,async(req,res,next)=>{
    res.render('welcome',{
        titleJumbo:"Update profile",
        buttonTitle:"Update your profile",
        user:await User.findOne({_id:req.session._id})
    }) ;
 });
 
 router.get("/dashboard",(req,res)=>{
    res.render("dashboard");
});

 router.post('/register', async (req,res,next)=>{
    let updateUser = {
        CONSUMER_KEY:req.body.consumerKey,
        CONSUMER_SECRET:req.body.consumerSecret,
        TOKEN_SECRET:req.body.tokenSecret,
        TOKEN_VALUE:req.body.tokenValue,
        setUpComplete:true,
    };
    await User.updateOne({_id:req.session._id},updateUser);
    res.session.user = updateUser;
    req.session.logged_in = true;
    res.redirect('/');
});

router.use("/inventories",inventoriesRoutes);
router.use("/investigate",investigateRoutes);
router.use("/settings",settingsRoutes);
router.use("/stats",statsRoutes);

module.exports = router;