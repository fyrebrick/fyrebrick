const express = require('express');
const router = express.Router();
const bricklinkPlus = require('bricklink-plus');
const redis = require("../../../middlewares/redis");

router.get('/search',async (req,res)=>{
    let data = await redis.get(req);
    if(!data){
        data = await bricklinkPlus.api.inventory.getInventories({},{
            CONSUMER_KEY:req.session.user.CONSUMER_KEY,
            CONSUMER_SECRET:req.session.user.CONSUMER_SECRET,
            TOKEN_SECRET:req.session.user.TOKEN_SECRET,
            TOKEN_VALUE:req.session.user.TOKEN_VALUE
        });
        redis.set(req,data);
    }
    if(!data){
        console.trace("No data is found on request,");
    }
    let search = req.query.search.toLowerCase();
    let newData = [];
    for (let i = 0, len = data.data.length; i < len; i++) {
        if (data.data[i].remarks) {
            if(req.query.exact==="Y"){
                if (data.data[i].remarks.toLowerCase()===search) {
                    newData.push(data.data[i]);
                }
            }else{
                if (data.data[i].remarks.toLowerCase().includes(search)) {
                    newData.push(data.data[i]);
                }
            }
        }
    }
    const done = {
        "meta": data.meta,
        "data": newData
    };
    res.send(done);
});

module.exports = router;