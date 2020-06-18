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
    if(req.params.v1==='invest'){
        await getJsonInvestigate(req,res);
    }else {
        await getJSON(req, res);
        //test
    }
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

 async function getJsonInvestigate   (req,res){
    let user = await User.findOne({_id:req.session._id});
    const oauth = new OAuth.OAuth(
        user.TOKEN_VALUE,
        user.TOKEN_SECRET,
        user.CONSUMER_KEY,
        user.CONSUMER_SECRET,
        oauth_data.oauth_version,
        null,
        oauth_data.oauth_signature_method
    );
    let link = 'https://api.bricklink.com/api/store/v1/inventories';
    oauth.get(
        link,
        user.TOKEN_VALUE,
        user.TOKEN_SECRET, //test user secret
        function (e, data){
            const itemList = JSON.parse(data);
            let investData = {meta:itemList.meta,data:[]};
            let currentIndexForInvestData = 0;
            itemList.data.forEach(
                (item,index)=>{
                    let addedToInvestDataThisCycle = false;
                    let addedThisItemToInvestDataThisCycle = false;
                    //current item, will check if any other item (exluding self) is same, add to investData if so
                    console.log("Loading... "+(index/(itemList.data.length/100.0)).toFixed(2)+'%');
                    itemList.data.forEach(
                        (comparingItem)=>{
                            if(item.inventory_id!==comparingItem.inventory_id){ //exclude self
                                if(
                                    item.item.no===comparingItem.item.no &&
                                    item.new_or_used===comparingItem.new_or_used &&
                                    item.color_id===comparingItem.color_id &&
                                    item.description===comparingItem.description
                                ){
                                    let itemNotYetUsedAsComparingItem = true;
                                    //check if comparingItem already was an Item
                                    investData.data.forEach((dataOfInvestData)=>{
                                        dataOfInvestData.forEach((checkItem)=>{
                                            if(
                                                item.item.no===checkItem.item.no &&
                                                item.new_or_used===checkItem.new_or_used &&
                                                item.color_id===checkItem.color_id &&
                                                item.description===checkItem.description
                                            ){
                                                itemNotYetUsedAsComparingItem=false;
                                            }
                                        });
                                    });
                                    if(itemNotYetUsedAsComparingItem){
                                        //if almost the same item, add this item to a new array in data array(investData)
                                        addedToInvestDataThisCycle = true;
                                        if(!addedThisItemToInvestDataThisCycle){
                                            investData.data.push([item]);
                                            addedThisItemToInvestDataThisCycle=true;
                                        }
                                        investData.data[currentIndexForInvestData].push(comparingItem);
                                    }
                                }
                            }
                        }
                    );
                    //next item in inventory list
                    if(addedToInvestDataThisCycle){
                        //if something has been added to the investData, the currentIndex will be changed
                        currentIndexForInvestData++;
                    }
                }
            );
            res.setHeader('Content-Type', 'application/json');
            res.send(investData);
        });
};

async function getJSON (req,res,status=""){
    let user = await User.findOne({_id:req.session._id});
    console.log(user);
    if(req.params.v1==='inventories'){
        status=req.params.v1;
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
