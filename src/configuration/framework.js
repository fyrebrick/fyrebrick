//third party
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const pug = require("pug");
const session = require("express-session");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const hpp = require('hpp');
const useragent = require('express-useragent');
//first party
const {redisStore} = require("../configuration/session");
const {vars} = require("../helpers/constants/vars");
const {logger} = require("fyrebrick-helper").helpers;
const {startUp}= require('../helpers/auth/google');
const websocket = require('./websocket');
//const helmet = require('helmet')

const start = function (app) {
    const server = require('http').createServer(app);  
    const io = require('socket.io')(server);
    const store = require('./session').redisStore;
    //console.log(io);
    // io.use(function(socket, next) {
    //     store(socket.request, socket.request.res || {}, next);
    //     console.log(socket);
    // });

    app.locals.title = "Fyrebrick";
    app.engine("pug", pug.__express);
    app.set("views", path.join(path.resolve(), "views"));
    app.set("view engine", "pug");
    //app.use(helmet());
    app.disable('x-powered-by');
    app.use(cookieParser(vars.express.cookie_secret));
    app.set('trust proxy', 1)
    app.use(express.static(path.join(path.resolve(), "public")));
    app.use("/fn",express.static(path.join(path.resolve(), "src/frontend")));
    console.log(path.join(path.resolve(), "src/frontend"));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(useragent.express());
    app.use(
        session({
            name: "session",
            secret: vars.express.session_secret,
            saveUninitialized: false,
            resave: false,
            store: redisStore
        })
    );
    app.use(flash());
    app.use(hpp());
    app.use(function (req, res, next) {
        //updates session
        if(req.session){
            req.session.lastUsed = Date.now();
            req.session.sessionID = req.sessionID;
            req.session.cookieSessionId = encodeURIComponent(req.cookies.session);
        }
        res.locals.session = req.session;
        res.locals.version = vars.fyrebrick.version;
        res.locals.type = vars.fyrebrick.type;
        //pug variables
        
        res.locals.frontend = {};


        //clear all cookies except fyrebrick cookies and wpcc
        const cookies = req.cookies;
        for (const [key, value] of Object.entries(cookies)) {
            if(!(key.includes('fyrebrick')||key==="wpcc")){
                res.clearCookie(key);
            }
        }
        res.setHeader("Access-Control-Allow-Origin","https://my.fyrebrick.be");
        next();
    });
    startUp();
    io.on('connection', function(socket) {
        websocket.connection(socket);
    });

    server.listen(vars.express.port,()=>{
        logger.info(`express listening on port ${vars.express.port}`);
    });
    app.use(function (err, req, res, next) {
        res.status(500);
        res.render('error',{
            status:500,
            message:"Something went wrong on our end"
        })
        console.trace(err);
      });
};

module.exports = 
{
    start
};