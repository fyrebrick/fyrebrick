const express = require('express');
const router = express.Router();
const bricklinkPlus = require('bricklink-plus');
const redis = require("../../../middlewares/redis");

router.get('/search',async (req,res)=>{
    let data;
    try{
     data = await redis.getPlus(req);
     console.log("data found in cache:"+JSON.stringify(data.meta));
     if(!data){
         throw Error(data);
     }
    }catch{
        console.log('getting inventory...');
        data = await bricklinkPlus.api.inventory.getInventories({},{
            CONSUMER_KEY:req.session.user.CONSUMER_KEY,
            CONSUMER_SECRET:req.session.user.CONSUMER_SECRET,
            TOKEN_SECRET:req.session.user.TOKEN_SECRET,
            TOKEN_VALUE:req.session.user.TOKEN_VALUE
        });
        console.log('inventory got ! '+JSON.stringify(data.meta));
        redis.setPlus(req,data);
    }
    let search = req.query.search.toLowerCase();
    let newData = [];
    console.log('searching '+search+'... in all '+data.data.length+" items");
    if(data){
    if(data.data){
        for (let i = 0, len = data.data.length; i < len; i++) {
            if (data.data[i].remarks) {
                if(req.query.exact==="Y"){
                    if (data.data[i].remarks.toLowerCase()===search) {
                    console.log("found and item!");
                        newData.push(data.data[i]);
                    }
                }else{
                    if (data.data[i].remarks.toLowerCase().includes(search)) {
                        
                    console.log("found and item!");
                        newData.push(data.data[i]);
                    }
                }
            }
        }
        }
    }else{
        console.trace(data);
    }
    const done = {
        "meta": data.meta,
        "data": newData
    };
    res.send(done);
});

module.exports = router;