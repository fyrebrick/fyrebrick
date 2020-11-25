const express = require('express');
const router = express.Router();
const User = require('../../../models/user');
const bricklinkPlus = require("bricklink-plus");
const redis = require("../../../middlewares/redis");

router.get('/:inventory_id',async (req,res) =>{
    let data;
    try{
        data = await redis.getPlus(req);
        if(!data || data.meta.code!==200){
            throw Error();
        }
    }catch{
        data = await bricklinkPlus.api.inventory.getInventories({},{
            CONSUMER_KEY:req.session.user.CONSUMER_KEY,
            CONSUMER_SECRET:req.session.user.CONSUMER_SECRET,
            TOKEN_SECRET:req.session.user.TOKEN_SECRET,
            TOKEN_VALUE:req.session.user.TOKEN_VALUE
        });
        redis.setPlus(req,data);
    }
    let e = data.data;
    let map = data.data.map(function(item) {
        return item.inventory_id;
       });
    const id = map.indexOf(Number(req.params.inventory_id));
    if(id===-1){
        res.send({});
    }else{
        res.send(data.data[id]);
    }
});

router.post('/update/colour',async (req,res)=>{
    console.log(req.body);
    res.send(await updateInventory(req,{
        color_id:req.body.Colour,
        color_name:req.body.Colour_name
    }));
});

router.post('/update/quantity',async (req,res)=>{
    console.log(req.body);
    res.send(await updateInventory(req,{
        quantity:req.body.quantity
    }));
});

router.post('/update/remarks',async (req,res)=>{
    console.log(req.body);
    res.send(await updateInventory(req,{remarks:req.body.remarks}));
});

router.post('/update/new_or_used',async (req,res)=>{
    console.log(req.body);
    res.send(await updateInventory(req,{new_or_used:req.body.new_or_used}));
})

const updateInventory = async (req,body) =>{
    const user = await User.findOne({_id:req.session._id});
    console.log(req.session._id);
    console.log(req.body.id);
    console.log(user);
    console.log(user._id);
     return await bricklinkPlus.api.inventory.updateInventory(req.body.id,body,{
        CONSUMER_KEY:user.CONSUMER_KEY,
        CONSUMER_SECRET:user.CONSUMER_SECRET,
        TOKEN_VALUE:user.TOKEN_VALUE,
        TOKEN_SECRET:user.TOKEN_SECRET
    });
};

module.exports = router;