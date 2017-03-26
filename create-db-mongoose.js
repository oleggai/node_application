global.__base  = __dirname + '/';
var User = require(__base + 'models/user').User;

var user = new User({
    username: 'Tester2',
    password: 'secret'
});

user.save(function(err, user, affected) {
    if(err) { throw err }
    //console.log(arguments);
    User.findOne({username: 'Tester'}, function(err, tester) {
        if(err) throw err;
        console.log(tester);
    });
});