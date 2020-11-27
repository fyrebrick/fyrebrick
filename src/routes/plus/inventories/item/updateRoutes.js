const express = require('express');
const router = express.Router();
const User = require('../../../../models/user');
const bricklinkPlus = require("bricklink-plus");
const redis = require("../../../../middlewares/redis");

router.post('/colour',async (req,res)=>{
    console.log(req.body);
    res.send(await updateInventory(req,{
        color_id:req.body.Colour,
        color_name:req.body.Colour_name
    }));
});

router.post('/quantity',async (req,res)=>{
    console.log(req.body);
    res.send(await updateInventory(req,{
        quantity:req.body.quantity
    }));
});

router.post('/remarks',async (req,res)=>{
    console.log(req.body);
    res.send(await updateInventory(req,{remarks:req.body.remarks}));
});

router.post('/new_or_used',async (req,res)=>{
    console.log(req.body);
    res.send(await updateInventory(req,{new_or_used:req.body.new_or_used}));
})

const updateInventory = async (req,body) =>{
    const user = await User.findOne({_id:req.session._id});
    console.log(req.session._id);
    console.log(req.body.id);
    console.log(user);
    console.log(user._id);
    console.log()
     return await bricklinkPlus.api.inventory.updateInventory(req.body.id,body,{
        CONSUMER_KEY:user.CONSUMER_KEY,
        CONSUMER_SECRET:user.CONSUMER_SECRET,
        TOKEN_VALUE:user.TOKEN_VALUE,
        TOKEN_SECRET:user.TOKEN_SECRET
    });
};


module.exports = router;