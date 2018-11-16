const mongoose = require('mongoose');

// ES6 Promise
mongoose.Promise = global.Promise;    

   var db = mongoose.connect('mongodb://jrybojad:exchangeslug3@ds135003.mlab.com:35003/academi-slug', function(error) {
    
       if(error) {
        console.log(error);
       } 
        console.log('connection successful');
   });


    