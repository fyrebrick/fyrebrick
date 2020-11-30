const mongoose = require('mongoose');

const User = new mongoose.Schema({
        name: {
            type: String,
        },
        update_interval:{
            type:Number,
            default:5
        },
        googleId: {
            type: String,
            unique: true
        },
        email: {
            type: String,
            lowercase: true,
            unique: true,
            index: true,
            required: true,
            minlength: 5,
            maxlength: 255,
        },
        creationDate: {
            type: Date,
            default: Date.now
        },
        lastUpdated: {
            type: Date,
            default: Date.now
        },
        lastLogin: {
            type: Date,
            default: Date.now
        },
        tokens: [{
            type: Object
        }],
        setUpComplete : {
            type: Boolean,
            default: false
        },
        CONSUMER_KEY : String,
        CONSUMER_SECRET : String,
        TOKEN_SECRET : String,
        TOKEN_VALUE : String,
        TOKENS:[{
            ip:String,
            SECRET:String,
            VALUE:String
            }]
    },
);

const user = mongoose.model('User', User);

exports.getUserFromGoogleId = async (gId) => {
    user.findOne({googleId: gId}, function (err, User) {
        if (err) throw new Error(err);
        return User;
    });
};

exports.getUserIdFromGoogleId = async (gId) => {
    user.findOne({googleId: gId}, function (err, User) {
        if (err) throw new Error(err);
        return User._id;
    })
};

module.exports = user;

