const Inventory = require('../../models/inventory');
const {logger} = require('../../configuration/logger');
const bricklinkPlus = require('bricklink-plus');
const User = require('../../models/user');
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
            await Inventory.updateOne({inventory_id:req.body.id,CONSUMER_KEY:req.session.user.CONSUMER_KEY},{new_or_used:req.body.new_or_used});
            res.send(await updateInventory(req,{new_or_used:req.body.new_or_used}));
        },
        remarks: async(req,res,next)=>{
            await Inventory.updateOne({inventory_id:req.body.id,CONSUMER_KEY:req.session.user.CONSUMER_KEY},{remarks:req.body.remarks});
            res.send(await updateInventory(req,{remarks:req.body.remarks}));
        },
        quantity:async (req,res,next)=>{
            await Inventory.updateOne({inventory_id:req.body.id,CONSUMER_KEY:req.session.user.CONSUMER_KEY},{quantity:req.body.quantity});
            res.send(await updateInventory(req,{
                quantity:req.body.quantity
            }));
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