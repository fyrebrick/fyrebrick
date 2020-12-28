const {Order} = require("fyrebrick-helper").models
const bricklinkPlus = require("bricklink-plus");

const dashboard = async (req,res,next) =>{
    let order = await Order.findOne({consumer_key:req.session.user.CONSUMER_KEY});
    let info = {
      n4totalLots: "#",
      n4totalItems: "#",
      n4totalViews: "#"
    }
    if(order){
      if(!await bricklinkPlus.plus.maintanceCheck.monthly()){
        info =await bricklinkPlus.plus.stores.getStoreStats(order.seller_name);
      }
    }
    res.render("dashboard",{active:"dashboard",info:info});
};

const redirectToMe = (req,res,next) => {
  res.redirect('/my/dashboard');
}

module.exports = {
    dashboard,
    redirectToMe
};