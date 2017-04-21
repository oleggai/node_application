var express = require('express');
var mongoose = require(__base + "lib/mongoose");
var MongoStore = require("connect-mongo")(express);

var sessionStore = new MongoStore({mongooseConnection: mongoose.connection});

module.exports = sessionStore;