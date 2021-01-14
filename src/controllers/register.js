const bricklinkPlus = require("bricklink-plus");
const {User} = require("fyrebrick-helper").models;
const {logger} = require("fyrebrick-helper").helpers;
const {vars} = require('../helpers/constants/vars');
const superagent = require('superagent');

const register = {
    get:async (req,res,next)=>{
        const user = await User.findById(req.session._id);
        res.render('register',{user:user});
    },
    post:async(req,res,next)=>{
        if(req.body.consumerKey && req.body.consumerSecret && req.body.tokenSecret && req.body.tokenValue && req.body.userName){
            let userInfo = {
                CONSUMER_KEY:req.body.consumerKey.trim(),
                CONSUMER_SECRET:req.body.consumerSecret.trim(),
                TOKEN_SECRET:req.body.tokenSecret.trim(),
                TOKEN_VALUE:req.body.tokenValue.trim(),
                userName:req.body.userName.trim()
            };
            await superagent.get(`https://store.bricklink.com/${userInfo.userName}?p=${userInfo.userName}`).
            end(async(err,respond)=>{
                if(err){
                    logger.error(err)
                }
                if(respond.req.path.includes('notFound.asp')){
                    logger.error(`User name filled in is not valid`);
                    return res.send({success:false,isEmpty:{userName:true}});
                }
                const test = await bricklinkPlus.api.item.getItem("PART","3002",userInfo);
                logger.info(`Test of bricklink API keys : status code ${test.meta.code}`);
                if(test.meta.code==200){
                    logger.info(`Test complete, user ${req.session.email} has provided with valid keys`);
                    userInfo.setUpComplete=true;
                    const user = await User.findOne({_id:req.session._id},(err)=>{
                        if(err){
                            res.render('error',{
                                status:"500",
                                message:"Something went wrong",
                                extra:"R1000811"
                            })
                        }
                    }); //find out if user is returning user
                    if(!user){
                        logger.warn(`Could not find user from its _id ${req.session._id}, logging out`);
                        res.redirect('/logout');
                    }else if(user.setUpComplete===false){
                        logger.info(`New user found, getting all information for user ${user.email}`);
                        await User.updateOne({_id:req.session._id},userInfo,(err)=>{
                            if(err){ 
                                res.render('error',{
                                    status:"500",
                                    message:"Something went wrong",
                                    extra:"R1000810"
                                })
                            }
                        }); //new user, so update its bricklink tokens.
                        superagent.post(`${vars.fyrebrick.updater_api_host}:${vars.fyrebrick.updater_api_port}/all`)
                        .send({_id:req.session._id})
                        .set('accept','json')
                        .end(async(err,result)=>{
                            if(err){
                                logger.error(`giving updater-api request to update all gave err: ${err}`);
                                res.render('error',{
                                    status:"500",
                                    message:"Something went wrong",
                                    extra:"R1000809"
                                })
                            }else{
                                logger.info(`request to updater-api successful`);
                                req.session.user = await User.findOne({_id:req.session._id});
                                req.session.logged_in = true;
                                res.render('waiting_page');
                            }
                        });
                    }else if(user.setUpComplete === true){
                        req.session.user = user;
                        req.session.logged_in = true;
                        res.redirect('/my/dashboard');
                    }else{
                        res.render('error',{
                            status:"500",
                            message:"Something went wrong",
                            extra:"R1000812"
                        })
                    }
                }else{
                    logger.warn(`user trying to register but gave status code ${test.meta.code}, err: ${test.meta.message}`);
                    res.render('register',{user:userInfo});
                }
            });
        }else{
            res.render('register',{user:userInfo});
        }
    }
}

module.exports = register;