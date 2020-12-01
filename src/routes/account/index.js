const express = require('express');
const router = express.Router();
const investigateRoutes = require("./investigateRoutes")
const inventoriesRoutes = require("./inventories");
const settingsRoutes = require("./settingsRoutes");
const statsRoutes = require("./statsRoutes");
const ordersRoutes = require("./ordersRoutes")
const orderRoutes = require("./orderRoutes");
const {checkSignIn} = require("../../middlewares/index");
const User = require('../../models/user');
const Order = require('../../models/order');  
const bricklinkPlus = require("bricklink-plus");

router.get('/update',checkSignIn,async(req,res,next)=>{
    res.render('welcome',{
        titleJumbo:"Update profile",
        buttonTitle:"Update your profile",
        user:await User.findOne({_id:req.session._id})
    }) ;
 });
 
 router.get("/dashboard",async(req,res)=>{
    let order = await Order.findOne({consumer_key:req.session.user.CONSUMER_KEY});
    const info= await bricklinkPlus.plus.stores.getStoreStats(order.seller_name);
    res.render("dashboard",{active:"dashboard",info:info});
});

 router.post('/register', async (req,res,next)=>{
    let updateUser = {
        CONSUMER_KEY:req.body.consumerKey,
        CONSUMER_SECRET:req.body.consumerSecret,
        TOKEN_SECRET:req.body.tokenSecret,
        TOKEN_VALUE:req.body.tokenValue,
    };
    const test = await bricklinkPlus.api.item.getItem("PART","3001");
    if(test.meta.code==200){
      updateUser["setupComplete"]=true;
      await User.updateOne({_id:req.session._id},updateUser);  
      req.session.user = updateUser;
      req.session.logged_in = true;
      res.redirect('/');
    }else{
      updateUser["setupComplete"]=false;
      const user = await User.findOne({_id:req.session._id});
      res.render('welcome',{user:user,titleJumbo:"Please fill in correct data",buttonTitle:"update"});
    }
});

router.use("/inventories",inventoriesRoutes);

router.use("/investigate",investigateRoutes);

router.use("/settings",settingsRoutes);

router.use("/stats",statsRoutes);

router.use("/orders",ordersRoutes);

router.use("/order",orderRoutes);

module.exports = router;