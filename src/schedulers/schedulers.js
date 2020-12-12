const cacheUpdater = require('./modelUpdater');
const {logger} = require('../configuration/logger');
module.exports.start = () =>{
    cacheUpdater.default();
    logger.info('updaters succefully initiliated');
}