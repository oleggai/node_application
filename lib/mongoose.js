var mongoose = require('mongoose');
var config = require(__base + '/config');
mongoose.connect(config.get('mongoose:uri'), config.get('mongoose:options'));

module.exports = mongoose;