const mongoose = require('mongoose');

//ES6 Promise
mongoose.Promise = global.Promise;

// Connect to db before tests
before(function(done){

    // Connect to mongodb
    mongoose.connect('mongodb://jrybojad:exchangeslug3@ds135003.mlab.com:35003/academi-slug');
    mongoose.connection
        .once('open', () => {
            done();
        })
        .on('error', (error) => {
            console.warn('Error', error);
        });
    });


    beforeEach((done) => {
        mongoose.connection.collections.mongoose.drop(() => {
            done();
        });
    });