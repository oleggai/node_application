
/**
 * Module dependencies.
 */

global.__base  = __dirname + '/';

var http = require('http');
var path = require('path');
var express = require('express');
//var WebSocketServer = require('ws').Server;
var config = require(__base + 'config');
var log = require(__base + 'lib/log')(module);
var mongoose = require(__base + "lib/mongoose");

var HttpError = require(__base + 'error').HttpError;

var app = express();

app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'ejs');

// all environments
app.use(express.favicon());

if(app.get('env') == 'development') {
    app.use(express.logger('dev'));
} else {
    app.use(express.logger('default'));
}

app.use(express.bodyParser());
app.use(express.cookieParser());

var sessionStore = require(__base + 'lib/sessionStore');
app.use(express.session({
    secret: config.get("session:secret"),
    key: config.get("session:key"),
    cookie: config.get("session:cookie"),
    store: sessionStore
}));

app.use(express.json());

app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require(__base + 'middleware/sendHttpError'));
app.use(require(__base + "middleware/loadUser"));

app.use(app.router);

app.use('/count',function(request, response, next) {
    request.session.numberOfVisits = request.session.numberOfVisits + 1 || 1;
    response.send('Visits: ' + request.session.numberOfVisits);
});

require(__base + 'routes')(app);




app.use(function(error, request, response, next) {

    if(typeof error == 'number') {
        error = new HttpError(error);
    }

    if(error instanceof HttpError) {
        response.sendHttpError(error);
    } else {

        if(app.get('env') == 'development') {
            express.errorHandler()(error, request, response, next);
        } else {
            log.error(error);
            error = new HttpError(500);
            response.sendHttpError(error);
        }
    }
});

var server = http.createServer(app).listen(config.get('port'), function(){
    log.info('info','Express server listening on port ' + config.get('port'));
});

var io = require(__base + './socket')(server);

app.set('io', io);

/*var webSocketServer = new WebSocketServer({server: server});
webSocketServer.on('connection', function(ws) {
    var timer = setInterval(function() {
        ws.send(JSON.stringify(process.memoryUsage()), function(error) {
            // TODO: handle errors
        });
    }, 100);
    console.log("Клиент подключился");
    ws.on('close', function() {
        console.log('Клиент отключился');
        clearInterval(timer);
    });
});*/
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
