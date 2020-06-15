const mongooseLoader = require('./mongoose.js');
const expressLoader = require('./express.js');
const google = require('../middlewares/google.js');

module.exports.load = async function load(app) {
    google.startUp();
    await mongooseLoader.default();
    await expressLoader.default(app);
    app.use(function (req, res, next) {
        console.log("[REQUEST]: "+req.method+" request "+req.url+" Email "+((req.session.email) ? req.session.email : "unknown")+" Status code: "+res.statusCode);
        if(process.env.DEVELOP==="true"){
            if(res.locals) {
                res.locals.develop = process.env.DEVELOP
            }
        }
        next();
    });
};
