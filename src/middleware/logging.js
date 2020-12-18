const { multiply } = require("lodash")

const {logger} = require('../configuration/logger');

const requests = (req,res,next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if(!req.useragent.isBot){
        logger.info(`${req.method} ${req.url} ${((req.session.email) ? req.session.email : "Unknown")} ${res.statusCode} (${ip}, ${req.useragent.browser}, ${req.useragent.os})`);
    }
    next();
}

module.exports = {
    requests
}