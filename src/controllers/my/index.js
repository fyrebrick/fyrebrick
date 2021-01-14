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
      res.render("dashboard",{active:"dashboard",info:info,user:user});
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