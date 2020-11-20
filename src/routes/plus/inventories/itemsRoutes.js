const express = require('express');
const router = express.Router();
const bricklinkPlus = require('bricklink-plus');
const redis = require("../../../middlewares/redis");

router.get('search',(req,res)=>{
    console.log(req.url);
    const cache = redis.get(req.session._id,req.url);
    console.log('got cache ! => '+cache);
    if(cache){
        res.send(cache);
    }else{
        let search = req.query.search.toLowerCase();
        let newData = [];
        for (let i = 0, len = obj.data.length; i < len; i++) {
            if (obj.data[i].remarks) {
                if(req.query.exact==="Y"){
                    if (obj.data[i].remarks.toLowerCase()===search) {
                        newData.push(obj.data[i]);
                    }
                }else{
                    if (obj.data[i].remarks.toLowerCase().includes(search)) {
                        newData.push(obj.data[i]);
                    }
                }
            }
        }
        const data = {
            "meta": obj.meta,
            "data": newData
        };
        redis.set(req.session._id,req.url,data);
        res.send(data);
    }
});

module.exports = router;