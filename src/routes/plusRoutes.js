const router = require("express").Router();
const OAuth = require('oauth');
const {bricklink_GET_cache} = require('../middlewares/redis');
const bricklinkPlus = require('bricklink-plus');
const User = require('../models/user');

router.post('/inventories/item/update/colour',bricklink_GET_cache,(req,res)=>{
    const user = User.findOne({_id:req.session._id});
    const data = await bricklinkPlus.api.inventory.updateInventory(req.body.id,{
        color_id:req.body.Colour,
        color_name:req.body.Colour_name
    },{
        CONSUMER_KEY:user.CONSUMER_KEY,
        CONSUMER_SECRET:user.CONSUMER_SECRET,
        TOKEN_VALUE:user.TOKEN_VALUE,
        TOKEN_SECRET:user.TOKEN_SECRET
    });
    res.setHeader("application/json");
    res.send(data);
});

router.post('/inventories/item/update/quantity',bricklink_GET_cache,(req,res)=>{
    const user = User.findOne({_id:req.session._id});
    const data = await bricklinkPlus.api.inventory.updateInventory(req.body.id,{
        quantity:req.body.quantity
    },{
        CONSUMER_KEY:user.CONSUMER_KEY,
        CONSUMER_SECRET:user.CONSUMER_SECRET,
        TOKEN_VALUE:user.TOKEN_VALUE,
        TOKEN_SECRET:user.TOKEN_SECRET
    });
    res.setHeader("application/json");
    res.send(data);
});

router.post('/inventories/item/update/remarks',bricklink_GET_cache,(req,res)=>{
    const user = User.findOne({_id:req.session._id});
    const data = await bricklinkPlus.api.inventory.updateInventory(req.body.id,{
        remarks:req.body.remarks
    },{
        CONSUMER_KEY:user.CONSUMER_KEY,
        CONSUMER_SECRET:user.CONSUMER_SECRET,
        TOKEN_VALUE:user.TOKEN_VALUE,
        TOKEN_SECRET:user.TOKEN_SECRET
    });
    res.setHeader("application/json");
    res.send(data);
});

module.exports = router;
