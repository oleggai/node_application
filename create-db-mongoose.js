var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/mongoose-db');

var schema = mongoose.Schema({
    name: String
});

schema.methods.meow = function() {
    console.log(this.get('name'));
};

var Cat = mongoose.model('Cat', schema);
var Fox = mongoose.model('Fox', schema);

var kitty = new Cat({ name: 'Zildjian' });
var fox = new Fox({name: 'Foxi'});
kitty.save(function (err, kitty, affected) {
    if (err) {
        console.log(err);
    } else {
        kitty.meow()
    }
});
fox.save(function (err, fox, affected) {
    if (err) {
        console.log(err);
    } else {
        fox.meow()
    }
});