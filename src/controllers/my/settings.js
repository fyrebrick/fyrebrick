const {User} = require('fyrebrick-helper').models;
const bricklinkPlus = require("bricklink-plus");
const {logger} = require('fyrebrick-helper').helpers;
const settings = {
    index: async (req,res,next)=>{
        const user = await User.findById(req.session._id);
        res.render('settings',{
            user:user
        });
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
                if(interval >=1 && interval <=60){
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
    bricklinkApi: {
        put: async (req,res,next)=>{
            if(req.body.CONSUMER_KEY && req.body.CONSUMER_SECRET && req.body.TOKEN_SECRET && req.body.TOKEN_VALUE){
                let userInfo = {
                    CONSUMER_KEY:req.body.CONSUMER_KEY.trim(),
                    CONSUMER_SECRET:req.body.CONSUMER_SECRET.trim(),
                    TOKEN_SECRET:req.body.TOKEN_SECRET.trim(),
                    TOKEN_VALUE:req.body.TOKEN_VALUE.trim()
                };
                const test = await bricklinkPlus.api.item.getItem("PART","3001",userInfo);
                logger.info(`Test of bricklink API keys : status code ${test.meta.code}`);
                if(test.meta.code==200){
                    logger.info(`Test complete, user ${req.session.email} has provided with valid keys`);
                    userInfo.setUpComplete=true;
                    const user = await User.findOne({_id:req.session._id}); //find out if user is returning user
                    if(!user){
                        logger.warn(`Could not find user from its _id ${req.session._id}, logging out`);
                        res.redirect('/logout');
                    }else if(!user.setUpComplete){
                        logger.info(`New user found, getting all information for user ${user.email}`);
                        await User.updateOne({_id:req.session._id},userInfo); //new user, so update its bricklink tokens
                    }
                    req.session.user = await User.findOne({_id:req.session._id});
                    req.session.logged_in = true;
                    res.send({success:true})
                }else{
                    logger.warn(`user trying to register but gave status code ${test.meta.code}, err: ${test.meta.message}`);
                    res.send({success:false,data:test.meta});
                }
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