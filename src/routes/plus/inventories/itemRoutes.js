const express = require('express');
const router = express.Router();
const User = require('../../../models/user');

router.post('/update/colour',async (req,res)=>{
    res.send(await updateInventory({
        color_id:req.body.Colour,
        color_name:req.body.Colour_name
    }));
});

router.post('/update/quantity',async (req,res)=>{
    res.send(await updateInventory({
        quantity:req.body.quantity
    }));
});


router.post('/update/remarks',async (req,res)=>{
    res.send(await updateInventory({remarks:req.body.remarks}));
});

router.post('/update/new_or_used',async (req,res)=>{
    res.send(await updateInventory({new_or_used:req.body.new_or_used}));
})

const updateInventory = async (body) =>{
    const user = User.findOne({_id:req.session._id});
     return await bricklinkPlus.api.inventory.updateInventory(req.body.id,body,{
        CONSUMER_KEY:user.CONSUMER_KEY,
        CONSUMER_SECRET:user.CONSUMER_SECRET,
        TOKEN_VALUE:user.TOKEN_VALUE,
        TOKEN_SECRET:user.TOKEN_SECRET
    });
};

module.exports = router;