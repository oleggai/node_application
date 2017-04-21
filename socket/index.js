
var log = require(__base + 'lib/log')(module);
var async = require('async');
var cookie = require('cookie');
var config = require(__base + 'config');
var cookieParser = require('cookie-parser');
var sessionStore = require(__base + 'lib/sessionStore');
var HttpError = require(__base + 'error').HttpError;
var User = require(__base + 'models/user').User;

function loadSession(sid, callback) {
    sessionStore.load(sid, function(error, session) {
        if(arguments.length == 0) {
            return callback(null, null);
        } else {
            return callback(null, session);
        }
    });
}

function loadUser(session, callback) {
    if(!session.user) {
        log.debug("Session %s is anonymous", session.id);
        return callback(null, null);
    }

    log.debug('retrieving user', session.user);
    User.findById(session.user, function(error, user) {
        if(error)  return callback(error);

        if(!user) {
            return callback(null, null);
        }
        log.debug('user findById result: ' + user);
        callback(null, user);
    });
}

module.exports = function(server) {
    var io = require('socket.io')(server);
    //io.set('origins', 'localhost:*');
    io.origins('localhost:*');
    io.set('logger', log);

    io.set('authorization', function(handshake, callback) {
       async.waterfall([
           function(callback) {
            try {
                handshake.cookies = cookie.parse(handshake.headers.cookie || '');
                var sidCookie = handshake.cookies[config.get('session:key')];
                var sid = cookieParser.signedCookie(sidCookie, config.get('session:secret'));
                loadSession(sid, callback);
            } catch(e) {
                var errorMessage = e.message;
                var a = 29;
            }
       },
           function(session, callback) {

               try {
                   if(!session) {
                       callback(new HttpError(401, 'No session'));
                   }

                   handshake.session = session;
                   loadUser(session, callback);
               } catch(e) {
                   var errorMessage = e.message;
                   var a = 8;
               }
           },
           function(user, callback) {
               try {
                   if(!user) {
                       callback(new HttpError(403, 'Anonymous session may not connect'));
                   }

                   handshake.user = user;
                   callback(null);
               } catch(e) {
                   var errorMessage = e.message;
                   var a = 8;
               }
           }
       ],
           function(error) {
               if(!error) {
                   return callback(null, true);
               }
               if(error instanceof HttpError) {
                   return callback(null, false);
               }
               callback(error);
           });
    });

/*    io.on('session:reload', function(sid) {
        var clients = io.sockets.clients();

        clients.forEach(function(client) {
            if(client.handshake.session.id != sid) return;

            loadSession(sid, function(error, session) {
                if(error) {
                    client.emit('error', 'server error');
                    client.disconnect();
                    return;
                }
                if(!session) {
                    client.emit('error', 'handshake unauthorized');
                    client.disconnect();
                    return;
                }
                client.handshake.session = session;
            });

        });

    });*/

    io.on('connection', function (socket) {

        var username = socket.request.user.get('username');

        socket.broadcast.emit('join', username);

        socket.on('message', function(text, callback) {
            socket.broadcast.emit('message', username,  text);
            callback('Message is sent to all clients');
        });

        socket.on('disconnect', function() {
            socket.broadcast.emit('leave', username);
        });

        var timer = setInterval(function() {
            socket.emit('server_stats', process.memoryUsage());
        }, 100);
    });
    return io;
};