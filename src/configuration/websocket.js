const {logger} = require('fyrebrick-helper').helpers;
const redis = require('./session');
const {Order,Inventory} = require('fyrebrick-helper').models;
const connection = (socket) => {
    const rawHeaders = socket.request.rawHeaders[socket.request.rawHeaders.indexOf('Cookie')+1].split(';');
    let sessionId;
    rawHeaders.forEach(header=>{
        if(header.includes('session'))
            sessionId= header.split('=')[1];
    })
    redis.client.keys("session*", async (error, keys)=>{
        keys.forEach(async key=>{
            await redis.client.get(key,async (err,session) =>{
                session = JSON.parse(session);
                if(session.cookieSessionId=== sessionId){
                    if(session && session.user){

                        
                    socket.on('request.orders',async()=>{
                        socket.emit('response.orders',JSON.stringify(await Order.find({$and: [{consumer_key:session.user.CONSUMER_KEY},{$or:[{status:"PENDING"},{status:"UPDATED"},{status:"PROCESSING"},{status:"READY"},{status:"PAID"},{status:"PACKED"}]}]})));
                    })
                    
                    socket.on('request.registration',async()=>{
                        console.log("request.registration")
                        const orders = await Order.find({consumer_key:session.user.CONSUMER_KEY});
                        const inventory = await Inventory.findOne({CONSUMER_KEY:session.user.CONSUMER_KEY});
                        if(orders.length > 0 && inventory){
                            console.log('response.registration');
                            socket.emit('response.registration');
                        }
                    })


                    }
                }
            });

        })
    });
};

module.exports = {
    connection
};