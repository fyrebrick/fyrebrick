const mongoose = require('mongoose');

const Stores = new mongoose.Schema(
    {
        main:
            [
                {
                    name: String,
                    username: String,
                    n4totalLots: Number,
                    n4totalItems: Number,
                    n4totalViews: Number
                }
            ]
    }
);

const stores = mongoose.model('Stores', Stores);


module.exports = stores;

