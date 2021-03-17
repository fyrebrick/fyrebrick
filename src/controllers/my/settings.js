const {User,Order} = require('fyrebrick-helper').models;
const bricklinkPlus = require("bricklink-plus");
const {logger} = require('fyrebrick-helper').helpers;
const superagent = require('superagent');
const settings = {
    index: async (req,res,next)=>{
        const user = await User.findById(req.session._id);
        res.render('settings',{
            user:user
        });
    },
    fix:{
        duplicates: async (req,res,next) =>{
            await superagent.post(`${process.env.FYREBRICK_UPDATER_API_URI}/orders/removeDuplicates`)
            .send({CONSUMER_KEY:req.session.user.CONSUMER_KEY})
            .set('accept','json')
            .end((err,result)=>{
                if(err){
                    logger.error(`giving updater-api request to fix duplicates gave err: ${err}`);
                    res.send({success:false});
                }
                logger.info(`request to updater-api for user ${req.session.user.email} successful`);
                res.send({success:true});
            });
        }
    },
    update:{
        orders: async (req,res,next)=>{
            await superagent.post(`${process.env.FYREBRICK_UPDATER_API_URI}/orders/all`)
                .send({_id:req.session._id})
                .set('accept','json')
                .end((err,result)=>{
                    if(err){
                        logger.error(`giving updater-api request to update all gave err: ${err}`);
                        res.send({success:false});
                    }
                    logger.info(`request to updater-api for user ${req.session.user.email} successful`);
                    res.send({success:true});
                })
        },
        inventory: async(req,res,next)=>{
            await superagent.post(`${process.env.FYREBRICK_UPDATER_API_URI}/inventory`)
                .send({_id:req.session._id})
                .set('accept','json')
                .end((err,result)=>{
                    if(err){
                        logger.error(`giving updater-api request to update all gave err: ${err}`);
                        res.send({success:false});
                    }
                    logger.info(`request to updater-api for user ${req.session.user.email} successful`);
                    res.send({success:true});
                })
        }
    },
    inventoryInterval:{
        put: async (req,res,next)=>{
            if(req.body.interval){
                let interval;
                try{
                    interval = Number(req.body.interval);
                }catch(er){
                    logger.warn("Not a valid number to update inventory interval");
                    res.send({success:false});
                }
                if(interval >=1 && interval <=120){
                    //correct input, updating to user
                    await User.updateOne({_id:req.session._id},{update_interval:interval});
                    res.send({success:true});
                }else{
                    logger.warn(`not a valid interval, out of range. interval: ${interval}`);
                    res.send({success:false});
                }
            }else{
                logger.warn("update inverval data empty");
                res.send({success:false});
            }
        }
    },
    callbackCheckbox:{
        put:async(req,res,next)=>{
            const isCallback = (await User.findById({_id:req.session._id})).isBricklinkCallback;
            await User.updateOne({_id:req.session._id},{isBricklinkCallback:!isCallback});
            res.send({success:true,value:!isCallback});
        }
    },
    bricklinkApi: {
        put: async (req,res,next)=>{
            if(req.body.CONSUMER_KEY && req.body.CONSUMER_SECRET && req.body.TOKEN_SECRET && req.body.TOKEN_VALUE && req.body.userName){
                let userInfo = {
                    CONSUMER_KEY:req.body.CONSUMER_KEY.trim(),
                    CONSUMER_SECRET:req.body.CONSUMER_SECRET.trim(),
                    TOKEN_SECRET:req.body.TOKEN_SECRET.trim(),
                    TOKEN_VALUE:req.body.TOKEN_VALUE.trim(),
                    userName:req.body.userName.trim()
                };
                //test user name if valid
                await superagent.get(`https://store.bricklink.com/${userInfo.userName}?p=${userInfo.userName}`).
                end(async(err,respond)=>{
                    if(err){
                        logger.error(err)
                    }
                    if(respond.req.path.includes('notFound.asp')){
                        logger.error(`User name filled in is not valid`);
                        return res.send({success:false,isEmpty:{userName:true}});
                    }
                    const test = await bricklinkPlus.api.item.getItem("PART","3001",userInfo);
                    logger.info(`Test of bricklink API keys : status code ${test.meta.code}`);
                    if(test.meta.code==200){
                        logger.info(`Test complete, user ${req.session.email} has provided with valid keys`);
                        userInfo.setUpComplete=true;
                        const user = await User.findOne({_id:req.session._id}); //find out if user is returning user
                        await User.updateOne({_id:req.session._id},userInfo);
                        req.session.user = await User.findOne({_id:req.session._id});
                        req.session.logged_in = true;
                        res.send({success:true})
                    }else{
                        logger.warn(`user trying to register but gave status code ${test.meta.code}, err: ${test.meta.message}`);
                        res.send({success:false,data:test.meta});
                    }
                });
            }else{
                let isEmpty = {};
                if(!req.body.CONSUMER_KEY){
                    isEmpty['consumerKey'] = true;
                }
                if(!req.body.CONSUMER_SECRET){
                    isEmpty['consumerSecret'] = true;
                }
                if(!req.body.TOKEN_SECRET){
                    isEmpty['tokenSecret'] = true;
                }
                if(!req.body.TOKEN_VALUE){
                    isEmpty['tokenValue'] = true;
                }
                console.log(isEmpty);
                res.send({success:false,isEmpty:isEmpty});
            }
        }
    }
}

module.exports = settings;