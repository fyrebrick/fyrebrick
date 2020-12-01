const express = require('express');
const router = express.Router();
const User = require('../../../../models/user');
const bricklinkPlus = require("bricklink-plus");
const redis = require("../../../../middlewares/redis");
const { data } = require('jquery');
const Inventory = require('../../../../models/inventory');

router.post('/colour',async (req,res)=>{
    console.log(req.body);
    const update = await updateInventory(req,{
        color_id:req.body.Colour,
        color_name:req.body.Colour_name
    });
    if(update && update.meta && update.meta.code==200){
        if(update.data.color_id===req.body.Colour && update.data.color_name===req.body.Colour_name){
            await Inventory.updateOne({CONSUMER_KEY:req.user.CONSUMER_KEY,inventory_id:req.body.id},update.data);
            res.send({success:true});
        }
    }
    res.send({success:false});
});

router.post('/quantity',async (req,res)=>{
    console.log(req.body);
    const update = await updateInventory(req,{
        quantity:req.body.quantity
    });
    if(update && update.meta && update.meta.code==200){
        if(update.data.quantity===req.body.quantity){
            await Inventory.updateOne({CONSUMER_KEY:req.user.CONSUMER_KEY,inventory_id:req.body.id},update.data);
            res.send({success:true});
        }
    }
    res.send({success:false});
});

router.post('/remarks',async (req,res)=>{
    console.log(req.body);
    const update = await updateInventory(req,{remarks:req.body.remarks});
    if(update && update.meta && update.meta.code==200){
        if(update.data.remarks===req.body.remarks){
            await Inventory.updateOne({CONSUMER_KEY:req.user.CONSUMER_KEY,inventory_id:req.body.id},update.data);
            res.send({success:true});
        }
    }
    res.send({success:false});
});

router.post('/new_or_used',async (req,res)=>{
    console.log(req.body);
    const update = await updateInventory(req,{new_or_used:req.body.new_or_used});
    if(update && update.meta && update.meta.code==200){
        if(update.data.new_or_used===req.body.new_or_used){
            await Inventory.updateOne({CONSUMER_KEY:req.user.CONSUMER_KEY,inventory_id:req.body.id},update.data);
            res.send({success:true});
        }
    }
    res.send({success:false});
})

const updateInventory = async (req,body) =>{
    const user = await User.findOne({_id:req.session._id});
     return await bricklinkPlus.api.inventory.updateInventory(req.body.id,body,{
        CONSUMER_KEY:user.CONSUMER_KEY,
        CONSUMER_SECRET:user.CONSUMER_SECRET,
        TOKEN_VALUE:user.TOKEN_VALUE,
        TOKEN_SECRET:user.TOKEN_SECRET
    });
};


module.exports = router;