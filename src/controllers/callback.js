const {logger} = require('fyrebrick-helper').helpers;
const {vars} = require('../helpers/constants/vars');
const callback = async (req,res,next)=>{
    logger.info(`callback received from username ${req.params.username}`);
    if(req.body==={}){
        logger.warn(`body is empty`);
    }else{
        console.log(req.body);
    }
        // req.body.data.data.forEach(notification=>{
        //     //Order, Message, Feedback
        //     logger.info(`new ${notification.event_type} found! recourse id is ${notification.resource_id}`);
        //     if(notification.event_type.toLowerCase()==="order"){
        //         superagent.post(`${vars.fyrebrick.updater_api_host}:${vars.fyrebrick.updater_api_port}/order/${notification.resource_id}`)
        //                 .send({_id:req.session._id})
        //                 .set('accept','json')
        //                 .end((err,result)=>{
        //                     if(err){
        //                         logger.error(`giving updater-api request to update all gave err: ${err}`);
        //                         res.render('register');
        //                     }
        //                     logger.info(`request to updater-api for user ${req.session.user.email} successful`);
        //                 })
        //     }
        // })
        res.send();
    };
module.exports = {callback};