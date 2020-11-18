const User = require('../../models/user');
const getStats = require('../../functions/stats/getStats');
var express = require('express');
var router = express.Router();
let crunch = require('../../functions/stats/crunch');
const Stores = require('../../models/stores');

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

router.get('/stores',async (req,res,next)=>{
    let data = (await Stores.findOne({}));
    if(data) {
        data = data.main;
        res.render('stats/stores_list',{
            stores:data.sort((a, b) => (a.n4totalLots < b.n4totalLots) ? 1 : -1)
        });
    }else{
        res.render('stats/stores_list',{
            stores:[]
        });
    }
});

router.get('/stores/items',async (req,res,next)=>{
    let data = (await Stores.findOne({}));
    if(data) {
        data = data.main;
        res.render('stats/stores/items',{
            stores:data.sort((a, b) => (a.n4totalItems < b.n4totalItems) ? 1 : -1)
        });
    }else{
        res.render('stats/stores/items',{
            stores:[]
        });
    }
});

router.get('/stores/lots',async (req,res,next)=>{
    let data = (await Stores.findOne({}));
    if(data) {
        data = data.main;
        res.render('stats/stores/lots',{
            stores:data.sort((a, b) => (a.n4totalLots < b.n4totalLots) ? 1 : -1)
        });
    }else{
        res.render('stats/stores/lots',{
            stores:[]
        });
    }
});

router.get('/stores/views',async (req,res,next)=>{
    let data = (await Stores.findOne({}));
    if(data) {
        data = data.main;
        res.render('stats/stores/views',{
            stores:data.sort((a, b) => (a.n4totalViews < b.n4totalViews) ? 1 : -1)
        });
    }else{
        res.render('stats/stores/views',{
            stores:[]
        });
    }
});

router.post('/update/common_brick_colours',async (req,res,next)=>{
    let data = await getStats.default(await User.findOne({_id:req.session._id}));
    let chartData = crunch.common_brick_colours(data.most_common_brick_colours,req.body.top,req.body.hours);
    res.setHeader('Content-Type', 'application/json');
    res.send(chartData);
});

router.get('/new_used_info',async (req,res)=>{

});



module.exports = router;
