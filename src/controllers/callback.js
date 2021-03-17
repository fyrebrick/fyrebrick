const {logger} = require('fyrebrick-helper').helpers;
const callback = async (req,res,next)=>{
    logger.info(`callback received from username ${req.params.username}`);
    if(req.body==={}){
        logger.warn(`body is empty`);
    }else{
        console.log(req.body);
    }
        res.send();
    };
module.exports = {callback};