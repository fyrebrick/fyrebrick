if(process.env.DEVELOPMENT===true){
    process.env.NODE_ENV="development";
}else{
    process.env.NODE_ENV="production";
}

//not used anymore
module.exports = 
{
    vars:{
        express:{
            port:process.env.PORT,
            session_secret:process.env.SESSION_SECRET,
            cookie_secret:process.env.COOKIE_SECRET
        },
        redis:{
            uri:String(process.env.REDIS_URI)
        },
        fyrebrick:{
            version:require("../../../package.json").version||"",
            type:process.env.TYPE||"",
            updater_api_uri:process.env.FYREBRICK_UPDATER_API_URI
        },
        google:{
            secret:process.env.GOOGLE_CLIENT_SECRET,
            id:process.env.GOOGLE_CLIENT_ID,
            redirect_uri:process.env.GOOGLE_REDIRECT_URL,
            no_login:(process.env.NO_LOGIN)
        },
        mongodb:{
            uri:process.env.MONGO_DB_URI
        }
        
    }
};