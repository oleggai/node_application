var sessionStore = require(__base + 'lib/sessionStore');
module.exports.post = function (request, response, next) {
    var sid = request.session.id;
    var io = request.app.get('io');
    request.session.destroy(function(error) {

        var clients = Object.keys(io.sockets.sockets);

        clients.forEach(function(id) {

            var socket = io.sockets.connected[id];

            if(socket.client.request.session.id != sid) return;

            socket.emit('logout');

        });


        if(error) return next(error);

        response.send(true);
    });
};