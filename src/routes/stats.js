const User = require('../models/user');
const getStats = require('../functions/stats/getStats');
var express = require('express');
var router = express.Router();
let crunch = require('../functions/stats/crunch');

router.get('/',async (req,res,next)=>{
    res.render('stats/index');
});

router.get('/total',async (req,res,next)=>{
    res.render('stats/total',{
        data:await getStats.default(await User.findOne({_id:req.session._id}))
    });
})

router.get('/total_unique',async (req,res,next)=>{
    res.render('stats/total_unique',{
        data:await getStats.default(await User.findOne({_id:req.session._id}))
    });
});

router.get('/common_brick_colours',async (req,res,next)=>{
    let data = await getStats.default(await User.findOne({_id:req.session._id}));
    let chartData = crunch.common_brick_colours(data.most_common_brick_colours,5,48);
    res.render('stats/common_brick_colours',{
        data:JSON.stringify(chartData)
    });
});



module.exports = router;
