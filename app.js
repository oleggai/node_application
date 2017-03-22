
/**
 * Module dependencies.
 */
var http = require('http');
var path = require('path');
var express = require('express');
var config = require('./config');
var log = require('./lib/log.js')(module);

var app = express();
http.createServer(app).listen(config.get('port'), function(){
    log.info('info','Express server listening on port ' + config.get('port'));
});

app.use(function(request, response, next) {
    if(request.url == '/') {
        response.end('Hello mudila');
    } else {
        next();
    }
});

app.use(function(request, response, next) {
    if(request.url == '/test') {
        response.end('Test');
    } else {
        next();
    }
});
app.use(function(request, response, next) {
    if(request.url == '/forbidden') {
        next(new Error('Wops. Access, denied'));
    } else {
        next();
    }
});

app.use(function(request, response, next) {
    response.send(404, 'Page not found');

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


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.session({ secret: 'your secret here' }));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

*/
