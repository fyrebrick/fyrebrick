const express = require('express');
const router = express.Router();
const updateRoutes = require('./updateRoutes');
const User = require('../../../../models/user');
const bricklinkPlus = require("bricklink-plus");
const redis = require("../../../../middlewares/redis");

router.use('/update',async(req,res,next)=>{
    console.log('updating inventory...');
    const user = await User.findOne({_id:req.session._id});
    redis.BL_make(user,"/plus/inventories/items/search",'/inventories');
    next();
},updateRoutes);

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

module.exports = router;