
var HttpError = require(__base + 'error').HttpError;

module.exports = function(request, response, next) {
    if(!request.session.user) {
        return next(new HttpError(401, 'Вы не авторизированы'));
    } else {
        next();
    }
};