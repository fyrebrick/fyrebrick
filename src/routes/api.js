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
    }else if(req.params.v1==='invests_update') {
        await update(req,res);
    }else if(req.params.v1==='invests_combine'){
        await update(req,res,true);
    }else{
        await getJSON(req, res);
    }
});
router.all('/:v1/:v2',async  function(req, res, next) {
    if(req.params.v1==="status"){
        await getJSON(req,res,false,"",req.params.v2);
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
async function update (req,res,combine=false){
    let user = await User.findOne({_id:req.session._id});
    let items = req.body.items.trim().split("&");
    let qty = req.body.qty.trim().split("&");
    let qtyMax = 0; //qtyMax is all qty's except the index one
    let remarks = "";
    let newRemark = "";
    if(combine){
        remarks = req.body.remarks.trim().split("&");
        newRemark = req.body.newRemark;
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
    qty.forEach((q,index)=>{
       if(index!=req.body.index){
           qtyMax+=Number(q);
           console.log("deleting: "+items[index]);
           if(combine){
               newRemark+="/"+remarks[index];
           }
           oauth.delete(
               'https://api.bricklink.com/api/store/v1/inventories/'+items[index],
               user.TOKEN_VALUE,
               user.TOKEN_SECRET, //test user secret
               function (e, data){
               });

       }
    });
    let post_body = '{"quantity":"+'+qtyMax+'"}';
    if(combine){
        post_body='{"quantity":"+'+qtyMax+'","remarks":"'+newRemark+'"}';
    }
    console.log(post_body);
    console.log("updating: "+items[Number(req.body.index)]);
    oauth.put(
        'https://api.bricklink.com/api/store/v1/inventories/'+items[Number(req.body.index)],
        user.TOKEN_VALUE,
        user.TOKEN_SECRET, //test user secret
        post_body=post_body,
        post_content_type="application/json",
        function (e, data){
            console.log(data);
        });
    res.setHeader('Content-Type', 'application/json');
    res.send({meta:"EMTPY_JSON",data:[]});
}
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
                    if(item.item.type==="PART"){
                        let addedToInvestDataThisCycle = false;
                        let addedThisItemToInvestDataThisCycle = false;
                        //current item, will check if any other item (exluding self) is same, add to investData if so
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
                }
            );
            res.setHeader('Content-Type', 'application/json');
            res.send(investData);
        });
};

async function getJSON (req,res,onlyJson=false,linkOveride="",status=""){
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
    if(linkOveride!==""){
        link = link;
    }else{
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
    }
    console.log("GET JSON from "+link);

    let statusObj;
    switch (status) {
        case "EMPTY_JSON":
            if(onlyJson){
                return {meta:"EMTPY_JSON",data:[]};
            }
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
            if(!onlyJson){
                res.setHeader('Content-Type', 'application/json');
            }
            if(obj.meta.description.includes("TOKEN_IP_MISMATCHED")) {
                let j = {"data":[{"color_name":obj.meta.description,
                        "quantity":obj.meta.description,
                        "color_id":"",
                        "new_or_used":obj.meta.description,
                        "order_id":"Error",
                        "buyer_name":obj.meta.description
                    }]};
                if(onlyJson){
                    return j;
                }
                res.send(j);
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
                    if(onlyJson){
                        return newObject;
                    }
                    res.send(newObject);
                }else{
                    let j = {
                        "meta":obj.meta,
                        "data":obj.data[0]
                    };
                    if(onlyJson){
                        return j;
                    }
                    res.send(j);
                }
            }else if(req.params.v1==="inventories"){
                let search = req.query.search;
                let newData = [];
                obj.data.forEach((o)=>{
                    if(o.remarks===search){
                        newData.push(o);
                    }
                });
                let j = {
                    "meta":obj.meta,
                    "data":newData
                };
                if(onlyJson){
                    return j;
                }
                res.send(j);
            }else if(status&&status!=="inventories"){
                statusObj = {meta:obj.meta,data:[]};
                obj.data.forEach((order)=>{
                    if(order.status===status){
                        statusObj.data.push(order);
                    }
                });
                if(onlyJson){
                    return statusObj;
                }
                res.send((statusObj));
            }else{
                if(onlyJson){
                    return data;
                }
                res.send(data);
            }
        });
};
module.exports = router;
module.exports.getJSON = getJSON();
