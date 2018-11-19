const mongoose = require('mongoose');

mongoose.Promise = global.Promise;


// Connect to mongodb
mongoose.connect('mongodb://jrybojad:exchangeslug3@ds135003.mlab.com:35003/academi-slug');

mongoose.connection.once('open', function(){
    console.log('Connection has been made, now make fireworks...');
	done()
}).on('error', function(error){
    console.log('Connection error:', error);
});
