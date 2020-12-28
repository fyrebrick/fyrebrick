const router = require('express').Router();
const routes = {
    my:require('./my')
};
const middleware = {
    isSignedIn:require('../middleware/session').isSignedIn
}
const controllers = {
    login:require('../controllers/login'),
    register:require('../controllers/register'),
    redirect:require('../controllers/redirect'),
    logout:require('../controllers/logout')
}

router.use('/my',middleware.isSignedIn,routes.my);
router.get('/logon',controllers.login.logon);
router.get('/',controllers.login.index);
router.get('/redirect',controllers.redirect.get);
router.get('/register',controllers.register.get);
router.post('/register',controllers.register.post);
router.get('/logout',controllers.logout.get);

module.exports = router;