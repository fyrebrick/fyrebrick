const schedule = require('node-schedule');
const {BL_make} = require('../middlewares/redis');
const inventory = require('../models/inventory');
const User = require('../models/user');
const Inventory = require('../models/inventory');
const Order = require("../models/order");
const OAuth = require("oauth");

exports.default = async ()=>{
    const users = await User.find({setUpComplete:true});
    //TODO this doesnot work for multiple users
    console.log('[INFO]: setting up all schedulers for users');
    const user = users[0];
    // users.forEach(
    //     (user) => {
    //         const rule = new schedule.RecurrenceRule();
    //         rule.minute = user.update_interval;
    //         console.log(rule);
    //         console.log("[INFO]: User "+user.email+" has set updating interval to "+user.update_interval+"min");
    //         const j = schedule.scheduleJob("*/"+user.update_interval+" * * * *",()=>{
                updateModels(user);
    //         });
    //     } 
    // );
};

const updateModels = async (user) => {
    console.log("[INFO]: Updating models for user "+user.email);
    const oauth = new OAuth.OAuth(
        user.TOKEN_VALUE,
        user.TOKEN_SECRET,
        user.CONSUMER_KEY,
        user.CONSUMER_SECRET,
        "1.0",
        null,
        "HMAC-SHA1"
    );
    oauth.get("https://api.bricklink.com/api/store/v1/inventories",oauth._requestUrl, oauth._accessUrl, 
        async (err, data) => {
            data = JSON.parse(data);
            if(data && data.meta && data.meta.code==200){
                console.log("[INFO]: preparing to save "+data.data.length+" items to inventory in our database for user "+user.email);
                const inventory = await Inventory.findOne({CONSUMER_KEY:user.CONSUMER_KEY});
                let inventoryObj = {
                    CONSUMER_KEY:user.CONSUMER_KEY,
                    inventory:[]
                };
                data.data.forEach( (i) => {
                    let c = {
                        inventory_id:i.inventory_id,
                        item:{
                            no:i.item.no,
                            name:i.item.name,
                            type:i.item.type,
                            category_id:i.item.category_id,
                        },
                        color_id:i.color_id,
                        color_name:i.color_name,
                        quantity:i.quantity,
                        new_or_used:i.new_or_used,
                        unit_price:i.unit_price,
                        bind_id:i.bind_id,
                        description:i.description,
                        remarks:i.remarks,
                        bulk:i.bulk,
                        is_retain:i.is_retain,
                        is_stock_room:i.is_stock_room,
                        date_created:i.date_created,
                        my_cost:i.my_cost,
                        sale_rate:i.sale_rate,
                        tier_quantity1:i.tier_quantity1,
                        tier_quantity2:i.tier_quantity2,
                        tier_quantity3:i.tier_quantity3,
                        tier_price1:i.tier_price1,
                        tier_price2:i.tier_price2,
                        tier_price3:i.tier_price3,
                        my_weight:i.my_weight
                    };
                    if(i.completeness)
                        c["completeness"] = i.completeness;
                    if(i.stock_room_id)
                        c["stock_room_id"] = i.stock_room_id;
                    inventoryObj.inventory.push(c);
                } );
                if(!inventory){
                    console.log("[INFO]: No inventory found in our database for user "+user.email);
                    const newInventory = new Inventory(
                        inventoryObj
                    );
                    await newInventory.save((err,doc)=>{
                        //console.log(err);
                        if(err){
                            console.log('[ERROR]: could not save inventory in database for user '+user.email);
                            console.log("[ERROR]: "+err.message);
                        }else{
                            console.log("[INFO]: Successfully saved new inventory for user "+user.email);
                        }
                        
                    });
                }else{
                    Inventory.updateOne({CONSUMER_KEY:user.CONSUMER_KEY},{
                        inventoryObj
                    },(err)=>{
                        if(err){
                            console.log('[ERROR]: Could not update inventory of user '+user.email);
                            console.log("[ERROR]: "+err.message);
                        }else{
                            console.log('[INFO]: Successfully updated inventory for user '+user.email);
                        }
                    });
                }
                
            }else{
                console.log('[WARN]: Could not receive any data to update inventory for user '+user.email);
            }
        }
    );
    oauth.get("https://api.bricklink.com/api/store/v1/orders",oauth._requestUrl, oauth._accessUrl, 
        async (err, data) => {
            data = JSON.parse(data);
            if(data && data.meta && data.meta.code==200){
                data.data.forEach(
                    async (order) => {
                        const order_db = await Order.findOne({consumer_key:user.CONSUMER_KEY,order_id:order.order_id});
                        const order_dbObj = {
                            orders_checked:0,
                            description:"",
                            consumer_key:user.CONSUMER_KEY,
                            ...order                                            
                        };                                        
                        if(!order_db){
                            console.log("[INFO]: Order of id "+order.order_id+" not found in our database for user "+user.email);
                            const newOrder = new Order(
                                order_dbObj
                            );
                            newOrder.save((err,data)=>{
                                if(err){
                                    console.log('[ERROR]: Could not save new order '+order.order_id+' of user '+user.email);
                                    console.log("[ERROR]: "+err.message);
                                }else{
                                    console.log('[INFO]: Successfully saved new order '+order.order_id+' for user '+user.email);
                                }
                            });
                        }else{
                            Order.updateOne({consumer_key:user.CONSUMER_KEY,order_id:order.order_id},(err)=>{
                                if(err){
                                    console.log('[ERROR]: Could not update order '+order.order_id+' of user '+user.email);
                                    console.log("[ERROR]: "+err.message);
                                }else{
                                    console.log('[INFO]: Successfully updated order '+order.order_id+' for user '+user.email);
                                }
                            });
                        }
                    }
                );
            }else{
                console.log('[WARN]: Could not receive any data to update orders for user '+user.email);
            }
        }                        
    );
    }