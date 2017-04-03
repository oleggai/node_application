var User = require(__base + "models/user").User;
module.exports = function(request, response, next) {

    request.user = response.locals.user = null;

    if(!request.session.user) next();

    User.findById(request.session.user, function(error, user) {
        if(error) {
            return next(error);
        } else {

            request.user = response.locals.user = user;
            next();
        }
    })
};