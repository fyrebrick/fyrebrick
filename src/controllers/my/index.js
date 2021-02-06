const {Order} = require("fyrebrick-helper").models
const {User} = require("fyrebrick-helper").models;
const bricklinkPlus = require("bricklink-plus");

const dashboard = async (req,res,next) =>{
  try{
      let info = {
        n4totalLots: "N/A",
        n4totalItems: "N/A",
        n4totalViews: "N/A"
      }
      const user = await User.findById(req.session._id);
      if(user && user.userName){
        info = await bricklinkPlus.plus.stores.getStoreStats(user.userName);
      }
      const orders = {
        ready: (await Order.find({consumer_key:req.session.user.CONSUMER_KEY,status:'READY'})).length,
        paid: (await Order.find({consumer_key:req.session.user.CONSUMER_KEY,status:'PAID'})).length,
        updated: (await Order.find({consumer_key:req.session.user.CONSUMER_KEY,status:'UPDATED'})).length,
        processing: (await Order.find({consumer_key:req.session.user.CONSUMER_KEY,status:'PROCESSING'})).length,
        packed: (await Order.find({consumer_key:req.session.user.CONSUMER_KEY,status:'PACKED'})).length,
        pending: (await Order.find({consumer_key:req.session.user.CONSUMER_KEY,status:'PENDING'})).length,
      };
      if(orders.ready===0 && orders.paid===0 && orders.updated === 0 && orders.processing === 0 && orders.packed === 0 && orders.pending === 0){
        orders = {};
      }
      console.log(orders);
      res.render("dashboard",{
        active:"dashboard",
        info:info,
        user:user,
        orders:orders
      });
    }catch(er){
      console.trace(err);
      res.status(500);
      res.render('error',{
        status:'500',
        message:'Something went wrong on our end, please contact info@fyrebrick.be'
      })
    }
};

const redirectToMe = (req,res,next) => {
  res.redirect('/my/dashboard');
}

module.exports = {
    dashboard,
    redirectToMe
};