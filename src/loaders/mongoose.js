const mongoose = require('mongoose');
module.exports.default = async () => {
    let db_uri;
    if (process.env.DEVELOP === 'true') {
        db_uri = process.env.DEVELOP_DB_URI;
        db_uri += "/bricklink";
    } else {
        db_uri = process.env.PRODUCTION_DB_URI;
    }
    try {
        mongoose.connect(db_uri, {
            useCreateIndex: true,
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        mongoose.connection.on('open', () => {
        });
        mongoose.connection.on('close', () => {
        });
    } catch (e) {
        process.exit(1);
    }
};
