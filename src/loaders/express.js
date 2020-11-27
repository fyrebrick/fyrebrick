const express = require("express");
const {redisStore} = require("../middlewares/redis");
const bodyParser = require("body-parser");
const path = require("path");
const pug = require("pug");
const session = require("express-session");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const hpp = require('hpp');
module.exports.default = function (app) {
    app.locals.title = "Bricklink Webservice";
    app.engine("pug", pug.__express);
    app.set("views", path.join(path.resolve(), "views"));
    app.set("view engine", "pug");
    app.use(cookieParser());
    app.use(express.static(path.join(path.resolve(), "public")));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(
        session({
            name: "session",
            secret: process.env.SESSION_SECRET,
            saveUninitialized: false,
            resave: false,
            cookie :{},
            store: redisStore
        })
    );
    app.use(flash());
    app.use(hpp());
    app.use(function (req, res, next) {
        res.locals.session = req.session;
        res.locals.version = process.env.VERSION;
        res.locals.mode = (process.env.DEVELOP==="true")?"develop":"live";
        res.locals.type = process.env.TYPE;
        res.locals.in_production = (process.env.IN_PRODUCTION==="true");
        //pug variables
        res.locals.order_id="";
        res.locals.data={};
        next();
    });
    app.listen(process.env.PORT);
};
