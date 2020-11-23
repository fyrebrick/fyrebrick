const statsUpdater = require('./statsUpdater');
const cacheUpdater = require('./cacheUpdater');

module.exports.start = () =>{
    statsUpdater.default();
    cacheUpdater.default();
    console.log('[INFO]: updaters succefully initiliated')
}