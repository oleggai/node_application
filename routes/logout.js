
module.exports.post = function (request, response, next) {
    request.session.destroy();
    response.redirect('/');
};