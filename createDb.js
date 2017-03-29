global.__base = __dirname + '/';

var async = require('async');
var mongoose = require(__base + 'lib/mongoose');

mongoose.set('debug', true);

async.series([
    open,
    dropDatabase,
    requireModels,
    createUsers
], function(error, results) {
    console.log(arguments);
    mongoose.disconnect();
});

function open(callback) {
    mongoose.connection.on('open', callback);
}

function dropDatabase(callback) {
    var db = mongoose.connection.db;
    db.dropDatabase(callback);
}

function requireModels(callback) {
    require(__base + 'models/user');

    async.each(Object.keys(mongoose.models), function(modelName, callback) {
        mongoose.models[modelName].ensureIndexes(callback);
    }, callback);
}

function createUsers(callback) {

    var users = [
        { username: 'Вася', password: 'secret1' },
        { username: 'Вася', password: 'secret2' },
        { username: 'Админ', password: 'secret3' }
    ];

    async.each(users, function(userData, callback) {
        var user = new mongoose.models.User(userData);
        user.save(callback);
    }, callback);
}

