const mongoose = require('mongoose');
const expect = require('expect');
const data = require('../webApp/server_modules/mongoose');

// ES6 Promise
mongoose.Promise = global.Promise;

// Connect to db before tests
before(function(done){

    // Connect to mongodb

    mongoose.connect('mongodb://jrybojad:exchangeslug3@ds135003.mlab.com:35003/academi-slug', {
        useNewUrlParser: true,
    });


});
    