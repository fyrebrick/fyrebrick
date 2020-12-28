const {Inventory} = require("fyrebrick-helper").models;
const {logger} = require("fyrebrick-helper").helpers;
const bricklinkPlus = require('bricklink-plus');
const {User} = require("fyrebrick-helper").models;
const superagent = require('superagent');
const {vars} = require('../../helpers/constants/vars');
const FYREBRICK_UPDATER_API_URL = `${vars.fyrebrick.updater_api_host}:${vars.fyrebrick.updater_api_port}`;
const inventory = {
    index:{
        get:(req,res,next)=>{
            res.render('inventory/inventory');
        }
    },
    add:{
        get:(req,res,next)=>{
            res.render('inventory/add');
        }
    },
    search:{
        get:(req,res,next)=>{
            res.render('inventory/search');
        },
        post:async (req,res,next)=>{
            let data;
            try{
             data = await redis.getPlus(req);}catch{
            }
            let search = req.query.s;
            if(req.query.exact==="Y"){
                logger.debug(`search with exact remarks`)
                const inventory = await Inventory.find({remarks:search,CONSUMER_KEY:req.session.user.CONSUMER_KEY});
                if(inventory.length===0){
                    logger.info(`nothing found for remarks ${search}`);
                }else{
                    logger.info(`found ${inventory.length} items for ${search}`)
                }
                res.send(inventory);
            }else{
                const inventory = await Inventory.find({remarks:{ "$regex": search, "$options": "i" },CONSUMER_KEY:req.session.user.CONSUMER_KEY});
                if(inventory.length===0){
                    logger.info(`nothing found for remarks ${search}`);
                }else{
                    logger.info(`found ${inventory.length} items for ${search}`)
                }
                res.send(inventory);
            }
        }
    },  
    investigate:{
        get:(req,res,next)=>{
            res.render('inventory/investigate');
        }
    },
    update:{
        new_or_used:async (req,res,next)=>{
            await superagent.post(`${FYREBRICK_UPDATER_API_URL}/update/new_or_used`)
                .send({
                    _id:req.session._id,
                    inventory_id:req.body.inventory_id,
                    CONSUMER_KEY:req.session.user.CONSUMER_KEY,
                    new_or_used:req.body.new_or_used
                })
                .set('accept','json')
                .end((err,result)=>{
                    if(err){
                        logger.error(`giving updater-api request to update inventory new_or_used gave err: ${err}`);
                    }
                    res.send(result.text);
                })
        },
        remarks: async(req,res,next)=>{
           await superagent.post(`${FYREBRICK_UPDATER_API_URL}/update/remarks`)
                .send({
                    _id:req.session._id,
                    inventory_id:req.body.inventory_id,
                    CONSUMER_KEY:req.session.user.CONSUMER_KEY,
                    remarks:req.body.remarks
                })
                .set('accept','json')
                .end((err,result)=>{
                    if(err){
                        logger.error(`giving updater-api request to update inventory remarks gave err: ${err}`);
                    }
                    res.send(result.text);
                })
        },
        quantity:async (req,res,next)=>{
           await superagent.post(`${FYREBRICK_UPDATER_API_URL}/update/quantity`)
                .send({
                    _id:req.session._id,
                    inventory_id:req.body.inventory_id,
                    CONSUMER_KEY:req.session.user.CONSUMER_KEY,
                    quantity:req.body.quantity
                })
                .set('accept','json')
                .end((err,result)=>{
                    if(err){
                        logger.error(`giving updater-api request to update inventory quantity gave err: ${err}`);
                    }
                    res.send(result.text);
                })
        },
    }
}

const updateInventory = async (req,body) =>{
    const user = await User.findOne({_id:req.session._id});
     return await bricklinkPlus.api.inventory.updateInventory(req.body.id,body,{
        CONSUMER_KEY:user.CONSUMER_KEY,
        CONSUMER_SECRET:user.CONSUMER_SECRET,
        TOKEN_VALUE:user.TOKEN_VALUE,
        TOKEN_SECRET:user.TOKEN_SECRET
    });
};

module.exports.inventory = inventory;