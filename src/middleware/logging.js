const { multiply } = require("lodash")

const {logger} = require('../configuration/logger');

const requests = (req,res,next) => {
    logger.info(`${req.method} ${req.url} ${((req.session.email) ? req.session.email : "Unkwown")} ${res.statusCode}`);
    next();
}

module.exports = {
    requests
}