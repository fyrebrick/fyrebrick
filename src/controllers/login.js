const google = require('../helpers/auth/google');
const redis = require('../configuration/session');
const {User} = require("fyrebrick-helper").models;
const logon = (req,res,next) => {
    if(req.session.logged_in !== undefined){
        if(req.session.logged_in){
            if(req.query && req.query.returnUrl){
                req.session.returnUrl = undefined;
                res.redirect(decodeURIComponent(req.query.returnUrl));
            }else{
                res.redirect("/my/dashboard");
            }
            return;
        }else{
            res.render("register",{
                titleJumbo:"Welcome",
                buttonTitle:"Create your profile"
            });
            return;
        }
    }
    if(req.query && req.query.returnUrl){
        req.session.returnUrl = req.query.returnUrl;
        res.redirect(google.urlGoogle());
    }else{
        res.redirect(google.urlGoogle());
    }
}

const index = async (req,res,next) => {
    let length = Number.MAX_SAFE_INTEGER;
    let done = 0;
    let found = false;
    if(req.signedCookies && req.signedCookies.fyrebrick_login){
        await redis.client.keys("session*", async (error, keys)=>{
            length = keys.length;
            if(length===0){
                checkLogin(req,res);
                return;
            }
            await keys.forEach(async key=>{
                await redis.client.get(key,async (err,session) =>{
                    session = JSON.parse(session);
                    done++;
                    if(session.sessionID=== req.signedCookies.fyrebrick_login){
                        if(session && session.user){
                            req.session.save();
                            Object.assign(req.session,session);
                            res.redirect('/my/dashboard');
                            found = true;
                            return;
                        }
                    }else if(done===length && found===false){
                        checkLogin(req,res);
                        return;
                    }
                });
            });
        });
    }else{
        checkLogin(req,res);
        return;
    }

}

const acceptCookies = async (req,res)=>{
    if(req.session && req.session._id){
        //found user, will update immediately
        await User.updateOne({_id:req.session._id},{isAcceptedCookies:true});
        res.send({success:true});
    }else{
        //no user found, will have to set a cookie, to update user later
        //set cookie fyrebrick_setAcceptCookie to true
        res.cookie('fyrebrick_setAcceptCookie',true,{expires: new Date(Date.now()+259200000)}); //unsigned, expires in 3 days
        res.send({success:true});
    }
}

const checkLogin = (req,res) => {
    if(req.session && req.session.logged_in !== undefined){
        if(req.session.returnUrl){
            res.redirect(req.session.returnUrl);
            return;
        }else
        if(req.session.logged_in){
            res.redirect("/my/dashboard");
            return;
        }else{
            res.render("register",{
                titleJumbo:"Welcome",
                buttonTitle:"Create your profile"
            }); 
            return;
        }
    }else{
        res.render('logon');
        return;
    }
}

module.exports = 
{
    logon,
    index,
    acceptCookies
};