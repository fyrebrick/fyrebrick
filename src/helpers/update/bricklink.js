const OAuth = require('oauth');
const inventory = require('../../models/inventory');
const Inventory = require('../../models/inventory');
const Order = require("../../models/order");
const {isObjectsSame} = require('../../helpers/objects');
module.exports.inventorySingle = async (user,inventory_id) => {
    const item = await Inventory.findOne({CONSUMER_KEY:user.CONSUMER_KEY},(err, data)=>{
        if(err){
            console.log("[ERROR]: Could not find inventory for user "+user.email);
        }else{
            const item = data.map((item)=>{
                return item.inventory_id;
            });
            const oauth = new OAuth.OAuth(
                user.TOKEN_VALUE,
                user.TOKEN_SECRET,
                user.CONSUMER_KEY,
                user.CONSUMER_SECRET,
                "1.0",
                null,
                "HMAC-SHA1"
            );
        }
    });
}


/**
 * @description updates and rewrites the users inventory model
 * @param {User} user - Mongodb User schema
 */
module.exports.inventoryAll = (user) => {
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
                data.data.forEach(
                    async (item) => {
                        const item_db = await Inventory.findOne({CONSUMER_KEY:user.CONSUMER_KEY,inventory_id:item.inventory_id});
                        const item_dbObj = {
                            CONSUMER_KEY:user.CONSUMER_KEY,
                            ...item                        
                        };                                        
                        if(!item_db){
                            const newItem = new Inventory(
                                item_dbObj
                            );
                            newItem.save((err,data)=>{
                                if(err){
                                    console.log('[ERROR]: Could not save new inventory item '+item.inventory_id+' of user '+user.email);
                                    console.log("[ERROR]: "+err.message);
                                }else{
                                    //console.log("[INFO]: Saved inventory item "+item.inventory_id+" for user "+user.email);
                                }
                            });
                        }else{
                            //check if there is any updates
                            if(!isObjectsSame(item_db,item_dbObj)){
                                Inventory.updateOne({CONSUMER_KEY:user.CONSUMER_KEY,inventory_id:item.inventory_id},item_dbObj,(err)=>{
                                    if(err){
                                        console.log('[ERROR]: Could not update inventory id '+item.inventory_id+' of user '+user.email);
                                        console.log("[ERROR]: "+err.message);
                                    }else{
                                        //console.log("[INFO]: Updated inventory item "+item.inventory_id+" for user "+user.email);
                                    }
                                });
                            }
                        }
                    }
                );
                
                console.log("[INFO]: Successfully saved/updated inventory items for users "+user.email);
            }else{
                console.log('[WARN]: Could not receive any data to update inventory for user '+user.email);
            }
        }
    );
}

module.exports.ordersAll = (user)=>{
    const oauth = new OAuth.OAuth(
        user.TOKEN_VALUE,
        user.TOKEN_SECRET,
        user.CONSUMER_KEY,
        user.CONSUMER_SECRET,
        "1.0",
        null,
        "HMAC-SHA1"
    );
    oauth.get("https://api.bricklink.com/api/store/v1/orders",oauth._requestUrl, oauth._accessUrl, 
        async (err, data) => {
            data = JSON.parse(data);
            if(data && data.meta && data.meta.code==200){
                console.log("[INFO]: Found "+data.data.length+" orders for user "+user.email);
                data.data.forEach(
                    async (order) => {
                        const order_db = await Order.findOne({consumer_key:user.CONSUMER_KEY,order_id:order.order_id});                                                        
                        oauth.get("https://api.bricklink.com/api/store/v1/orders/"+order.order_id+"/items",oauth._requestUrl, oauth._accessUrl, 
                        async (err, data_items) => {
                            data_items = JSON.parse(data_items);
                            console.log(data_items);
                            if(data_items && data_items.meta && data_items.meta.code==200){
                                if(!order_db){
                                    console.log("[INFO]: Order of id "+order.order_id+" not found in our database for user "+user.email);
                                    const newOrder = new Order({
                                        orders_checked:0,
                                        description:"",
                                        consumer_key:user.CONSUMER_KEY,
                                        ...order,
                                        items:data_items.data                             
                                    });
                                    newOrder.save((err,data)=>{
                                        if(err){
                                            console.log('[ERROR]: Could not save new order '+order.order_id+' of user '+user.email);
                                            console.log("[ERROR]: "+err.message);
                                        }else{
                                            //console.log('[INFO]: Successfully saved new order '+order.order_id+' for user '+user.email);
                                        }
                                    });
                                }else{
                                    const order_dbObj = {
                                        orders_checked:order_db.orders_checked,
                                        description:order_db.description,
                                        consumer_key:user.CONSUMER_KEY,
                                        ...order,
                                        items:data_items.data                              
                                    };        

                                    //check if there is any updates
                                    if(!isObjectsSame(order_db,order_dbObj)){
                                        Order.updateOne({consumer_key:user.CONSUMER_KEY,order_id:order.order_id},order_dbObj,(err)=>{
                                            if(err){
                                                console.log('[ERROR]: Could not update order '+order.order_id+' of user '+user.email);
                                                console.log("[ERROR]: "+err.message);
                                            }else{
                                                //console.log("[INFO]: Successfully updated order "+order.order_id+" of user "+user.email);
                                            }
                                        });
                                    }
                                }
                            }else{
                                console.log('[WARN]: Could not receive any data to update orders items for user '+user.email);
                            }
                            
                        });
                    }
                );
            }else{
                console.log('[WARN]: Could not receive any data to update orders for user '+user.email);
            }
        }                        
    );
    
}