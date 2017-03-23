var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/application';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    removeCollection(db, function() {
        db.close();
    });

    insertDocuments(db, function() {
        db.close();
    });

    findDocuments(db, function() {
        db.close();
    });
});

// FUNCTIONS

var insertDocuments = function(db, callback) {
    // Get the documents collection
    var collection = db.collection('documents');
    // Insert some documents
    collection.insertMany([
        {a : 1}, {a : 2}, {a : 3}
    ], function(err, result) {
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("Inserted %s documents into the collection", result.insertedCount);
        callback(result);
    });
};

var findDocuments = function(db, callback) {
    // Get the documents collection
    var collection = db.collection('documents');
    // Find some documents
    var cursor = collection.find({a: 2});
    cursor.toArray(function(err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");
        console.log(docs);
        callback(docs);
    });
};

var removeCollection = function(db, callback) {
    // Get the documents collection
    var collection = db.collection('documents');
    collection.deleteMany({}, function(error, result) {
        if(error) throw error;
        console.log('Deleted ' + result.deletedCount + ' documents');
        callback(result);
    })
};