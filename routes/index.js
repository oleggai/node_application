
var HttpError = require(__base + 'error').HttpError;
var checkAuth = require(__base + 'middleware/checkAuth');
module.exports = function(app) {


    app.get('/', require('./frontpage').get);
    app.get('/login', require('./login').get);
    app.post('/login', require('./login').post);
    app.post('/logout', require('./logout').post);
    app.get('/chat', checkAuth, require('./chat').get);

    app.get('/server_stats', checkAuth, require('./server_stats').get);

    app.get('*', function(request, response){
        response.sendHttpError(new HttpError(404, 'Страница не найдена'));
    });

};

