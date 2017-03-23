
/**
 * Module dependencies.
 */
var http = require('http');
var path = require('path');
var express = require('express');
var config = require('./config');
var log = require('./lib/log.js')(module);

var app = express();

app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'ejs');

http.createServer(app).listen(config.get('port'), function(){
    log.info('info','Express server listening on port ' + config.get('port'));
});

// all environments
app.use(express.favicon());

if(app.get('env') == 'development') {
    app.use(express.logger('dev'));
} else {
    app.use(express.logger('default'));
}

app.use(express.json());
app.use(express.urlencoded());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function(request, response, next) {
    // or response.send(200, "Hello user");
    response.render('index');
});

app.use(function(request, response, next) {
    response.send(404, 'Sorry, Page not found');
});

app.use(function(error, request, response, next) {
    if(app.get('env') == 'development') {
        var errorHandler = express.errorHandler();
        errorHandler(error, request, response, next);
    } else {
        response.send(500);
    }
});

/*
var routes = require('./routes');
var user = require('./routes/user');


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

*/
