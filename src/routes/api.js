var express = require('express');
var router = express.Router();
const User = require('../models/user');

const investigateInventory = require("../functions/bricklink/investigateInventory");
const changeValueOfInventoryId = require("../functions/bricklink/changeValueOfInventoryId");
const addToInventoryIds = require("../functions/bricklink/addToInventoryIds");
const combineInventoryIds = require('../functions/bricklink/combineInventoryIds');
const getJSON = require('../functions/bricklink/getJson');

router.all('/', async function(req, res, next) {
    (await getJSON)(req,res,await User.findOne({_id:req.session._id})).then((data)=>{
        res.send(data);
    })
});

router.all('/:v1', async function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    if(req.params.v1==='invest'){
        (await investigateInventory)(await User.findOne({_id:req.session._id})).then((investData)=>{
            res.send(investData);
        });
    }else if(req.params.v1==='invests_update') {
        (await addToInventoryIds)(req.body.items,req.body.qty,req.body.index,await User.findOne({_id:req.session._id})).then((data)=>{
            res.send(data);
        });
    }else if(req.params.v1==='invests_combine'){
        (await combineInventoryIds)(req.body.items,req.body.qty,req.body.index,req.body.remarks,req.body.newRemark,await User.findOne({_id:req.session._id})).then((data)=>{
            res.send(data);
        });
    }else if(req.params.v1==="change_quantity"){
        (await changeValueOfInventoryId)(req.body.sign,req.body.value,req.body.id,await User.findOne({_id:req.session._id})).then((data)=>{
            res.send(data);
        })
    }else{
        (await getJSON)(req,res,await User.findOne({_id:req.session._id})).then((data)=>{
            res.send(data);
        })
    }
});

router.all('/:v1/:v2',async  function(req, res, next) {
    if(req.params.v1==="status"){
        await getJSON(req,res,false,"",req.params.v2);
        (await getJSON)(req,res,await User.findOne({_id:req.session._id}),false,"",req.params.v2).then((data)=>{
            res.send(data);
        })
    }else{
        (await getJSON)(req,res,await User.findOne({_id:req.session._id})).then((data)=>{
            res.send(data);
        })
    }
});

router.all('/:v1/:v2/:v3', async function(req, res, next) {
    (await getJSON)(req,res,await User.findOne({_id:req.session._id})).then((data)=>{
        res.send(data);
    })
});

router.all('/:v1/:v2/:v3/:v4', async function(req, res, next) {
    (await getJSON)(req,res,await User.findOne({_id:req.session._id})).then((data)=>{
        res.send(data);
    })
});

router.all('/:v1/:v2/:v3/:v4/v5', async function(req, res, next) {
    (await getJSON)(req,res,await User.findOne({_id:req.session._id})).then((data)=>{
        res.send(data);
    })
});

module.exports = router;
