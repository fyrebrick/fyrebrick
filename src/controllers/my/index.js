const {Order} = require("fyrebrick-helper").models
const {User} = require("fyrebrick-helper").models;
const bricklinkPlus = require("bricklink-plus");

const dashboard = async (req,res,next) =>{
    let info = {
      n4totalLots: "N/A",
      n4totalItems: "N/A",
      n4totalViews: "N/A"
    }
    const user = await User.findById(req.session._id);
    info = await bricklinkPlus.plus.stores.getStoreStats(user.userName);
    res.render("dashboard",{active:"dashboard",info:info,user:user});
};

const redirectToMe = (req,res,next) => {
  res.redirect('/my/dashboard');
}

module.exports = {
    dashboard,
    redirectToMe
};