/**
 * All routes for / are defined here.
 * 
 */
const router = require('express').Router();
const routes = {
    my:require('./my'),
    callback:require('./callback')
};
const middleware = {
    isSignedIn:require('../middleware/session').isSignedIn
}
const controllers = {
    login:require('../controllers/login'),
    register:require('../controllers/register'),
    redirect:require('../controllers/redirect'),
    logout:require('../controllers/logout'),
    charts:require('../controllers/charts'),
    socket:require('../controllers/websocket')
}

router.use('/my',middleware.isSignedIn,routes.my);
router.use('/callback',routes.callback);
router.get('/logon',controllers.login.logon);
router.get('/',controllers.login.index);
router.get('/redirect',controllers.redirect.get);
router.get('/register',controllers.register.get);
router.post('/register',controllers.register.post);
router.get('/logout',controllers.logout.get);
router.all('/socket.io',controllers.socket.io);
router.get('/charts',controllers.charts.index);
router.get('/charts/europe/:type',controllers.charts.europe);
router.get('/charts/:countryID/:type',controllers.charts.national);
router.post('/acceptCookies',controllers.login.acceptCookies);

module.exports = router;