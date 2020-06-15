var express = require('express');
var router = express.Router();
var OAuth = require('oauth');
var oauth_data = require('../../oauth');
const User = require('../models/user');
/* GET home page. */

router.all('/', async function(req, res, next) {
    await getJSON(req,res);
});

router.all('/:v1', async function(req, res, next) {
    await getJSON(req,res);
});
router.all('/:v1/:v2',async  function(req, res, next) {
    if(req.params.v1==="status"){
        await getJSON(req,res,req.params.v2);
    }else{
        await getJSON(req,res);
    }
});
router.all('/:v1/:v2/:v3', async function(req, res, next) {
    await getJSON(req,res);
});
router.all('/:v1/:v2/:v3/:v4', async function(req, res, next) {
    await getJSON(req,res);
});
router.all('/:v1/:v2/:v3/:v4/v5', async function(req, res, next) {
    await getJSON(req,res);
});

async function getJSON (req,res,status=""){
    let user = await User.findOne({_id:req.session._id});
    console.log(user);
    if(req.params.v1==='inventories'){
        status=req.params.v1;
        console.log('inventories!');
    }
    const oauth = new OAuth.OAuth(
        user.TOKEN_VALUE,
        user.TOKEN_SECRET,
        user.CONSUMER_KEY,
        user.CONSUMER_SECRET,
        oauth_data.oauth_version,
        null,
        oauth_data.oauth_signature_method
    );
    let link = 'https://api.bricklink.com/api/store/v1/';
    let statusLink = 'https://api.bricklink.com/api/store/v1/orders?direction=in';
    let inventoryLink = 'https://api.bricklink.com/api/store/v1/inventories?';
    if(req.params.v1){
        link += req.params.v1;
    }
    if(req.params.v2){
        link+='/'+req.params.v2;
    }
    if(req.params.v3){
        link+='/'+req.params.v3;
    }
    if(req.params.v4){
        link+='/'+req.params.v4;
    }
    if(req.params.v4){
        link+='/'+req.params.v4;
    }
    if(req.params.v4){
        link+='/'+req.params.v4;
    }
    console.log("GET JSON from "+link);

    let statusObj;
    switch (status) {
        case "EMPTY_JSON":
            res.setHeader('Content-Type', 'application/json');
            res.send({meta:"EMTPY_JSON",data:[]});
            return;
        case "inventories":
            link= inventoryLink;
            break;
        case "":
            break;
        default:
            link=statusLink;
    }
    oauth.get(
        link,
        user.TOKEN_VALUE,
        user.TOKEN_SECRET, //test user secret
        function (e, data){
            if (e) console.error(e);
            let obj = JSON.parse(new Object(data));
            res.setHeader('Content-Type', 'application/json');
            if(obj.meta.description.includes("TOKEN_IP_MISMATCHED")) {
                res.send({"data":[{"color_name":obj.meta.description,
                        "quantity":obj.meta.description,
                        "color_id":"",
                        "new_or_used":obj.meta.description,
                        "order_id":obj.meta.description,
                        "buyer_name":obj.meta.description
                }]});
                return;
            }
            if(req.params.v3==='items'){
                console.log(obj.data.length+" is length of data");
                if(obj.data.length>1){
                    let newData = obj.data[0];
                    obj.data[1].forEach((o)=>{
                        newData.push(o);
                    });
                    let newObject = {
                        "meta":obj.meta,
                        "data": newData
                    };
                    res.send(newObject);
                }else{
                    res.send(({
                        "meta":obj.meta,
                        "data":obj.data[0]
                    }));
                }
            }else if(req.params.v1==="inventories"){
                let search = req.query.search;
                let newData = [];
                obj.data.forEach((o)=>{
                    if(o.remarks===search){
                        newData.push(o);
                    }
                });
                res.send({
                    "meta":obj.meta,
                    "data":newData
                });
            }else if(status&&status!=="inventories"){
                statusObj = {meta:obj.meta,data:[]};
                obj.data.forEach((order)=>{
                    if(order.status===status){
                        statusObj.data.push(order);
                    }
                });
                res.send((statusObj));
            }else{
                res.send(data);
            }
        });
};

module.exports = router;
