
var crypto = require('crypto');

var mongoose = require(__base + 'lib/mongoose');
var async = require('async');
var util = require('util');

var schema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

schema.methods.encryptPassword = function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('password')
    .set(function(password) {
        this._plainPassword = password;
        this.salt = Math.random() + '';
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() { return this._plainPassword; });

schema.methods.checkPassword = function(password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

schema.statics.authorize = function(username, password, callback) {

    var User = this;

    async.waterfall([
        function(callback) {
            try{
                User.findOne({username: username}, callback);
            } catch(e) {
                console.log(e);
                return next(e);
            }
        },
        function(user, callback) {
            if(user) {
                if(user.checkPassword(password)) {
                    callback(null, user);
                } else {
                    callback(new AuthError(403, "Пароль неверен"));
                }
            } else {
                var user = new User({username:username, password: password});
                user.save(function(error) {
                    if(error) {
                        return callback(error);
                    } else {
                        callback(null, user);
                    }
                });
            }
        }
    ], callback);
};

exports.User = mongoose.model('User', schema);

function AuthError(message) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, AuthError);

    this.message = message;
}

util.inherits(AuthError, Error);

AuthError.prototype.name = 'AuthError';

exports.AuthError = AuthError;