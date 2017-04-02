/*

/!*
 * GET home page.
 *!/

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};*/

var User = require(__base + 'models/user').User;
var HttpError = require(__base + 'error').HttpError;
var ObjectID = require('mongodb').ObjectID;
var userNotFoundError = new HttpError(404, 'User not found');
module.exports = function(app) {
    app.get('/', function(request, response, next) {
        // or response.send(200, "Hello user");
        response.render('index');
    });
    app.get('/users', function(request, response, next) {
        User.find({}, function(error, users) {
            if(error) next(error);

            response.json(users);
        });
    });

    app.get('/users/:id', function(request, response, next) {
        try {
            var id = new ObjectID(request.params.id);
        } catch(e) {
            next(userNotFoundError);
            return;
        }

        User.findOne({_id: id}, function(error, user) {
            if(error) return next(error);

            if(!user) {
              next(userNotFoundError);
            } else {
                response.json(user);
            }
        });
    });

    app.use(function(request, response, next) {
        response.sendHttpError(new HttpError(404, 'Page not found'));
    });


};

