
var log = require(__base + 'lib/log')(module);

module.exports = function(server) {
    var io = require('socket.io')(server);
    //io.set('origins', 'localhost:*');
    io.origins('localhost:*');
    io.set('logger', log);

    io.on('connection', function (socket) {
        socket.on('message', function(text, callback) {
            socket.broadcast.emit('message', text);
            callback('Message is sent to all clients');
        });

        var timer = setInterval(function() {
            socket.emit('server_stats', process.memoryUsage());
        }, 100);
    });
};