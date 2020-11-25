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
const bricklinkPlus = require("bricklink-plus");
router.get('/update',checkSignIn,async(req,res,next)=>{
    res.render('welcome',{
        titleJumbo:"Update profile",
        buttonTitle:"Update your profile",
        user:await User.findOne({_id:req.session._id})
    }) ;
 });
 
 router.get("/dashboard",async(req,res)=>{
    let orders = await bricklinkPlus.api.order.getOrders({},{
        TOKEN_VALUE: req.session.user.TOKEN_VALUE,
        TOKEN_SECRET: req.session.user.TOKEN_SECRET,
        CONSUMER_KEY: req.session.user.CONSUMER_KEY,
        CONSUMER_SECRET: req.session.user.CONSUMER_SECRET
      });
      let info = {}
      if(orders && orders.data && orders.data.length > 0){
        info= await bricklinkPlus.plus.stores.getStoreStats(orders.data[0].seller_name);
      }
    res.render("dashboard",{active:"dashboard",info:info});
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
router.use("/orders",ordersRoutes);
router.use("/order",orderRoutes);

module.exports = router;