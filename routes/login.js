
var User = require(__base + 'models/user').User;
var HttpError = require(__base + "./error").HttpError;
var AuthError = require(__base + "models/user").AuthError;
exports.get = function(request, response) {
    response.render('login');
};

exports.post = function(request, response, next) {
    var username = request.body.username;
    var password = request.body.password;

    User.authorize(username, password, function(error, user) {
        if(error) {
            if(error instanceof AuthError) {
                return next(new HttpError(403, error.message));
            } else {
                return next(error);
            }
        } else {
            request.session.user = user._id;
            response.send({});
        }
    });
    var a = 9;
};