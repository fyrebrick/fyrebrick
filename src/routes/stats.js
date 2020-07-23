const User = require('../models/user');
const getTotal = require('../functions/stats/getStats');
var express = require('express');
var router = express.Router();

router.get('/',async (req,res,next)=>{
    res.render('stats/index');
});

router.get('/total',async (req,res,next)=>{
    res.render('stats/total',{
        data:await getTotal.default(await User.findOne({_id:req.session._id}))
    });
})

router.get('/total_unique',async (req,res,next)=>{
    res.render('stats/total_unique',{
        data:await getTotal.default(await User.findOne({_id:req.session._id}))
    });
});

router.get('/common_brick_colours',async (req,res,next)=>{
    let data = await getTotal.default(await User.findOne({_id:req.session._id}));
    res.render('stats/common_brick_colours',{
        data:JSON.stringify(data.most_common_brick_colours)
    });
});



module.exports = router;
