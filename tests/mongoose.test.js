const expect = require('expect');
const data = require('../webApp/server_modules/mongoose');

<<<<<<< HEAD

describe('addUser', () => {
    it('resolves', (done) => {
        data.addUser((result) => {
            expect(result).toInclude({
                googleID: '4321',
                email: 'sammyslub@ucsc.edu',
                firstName: 'Sammy',
                lastName: 'Slug'
            }).finally(done);
        });
    });
});

    
=======
// ES6 Promise
mongoose.Promise = global.Promise;

// Connect to db before tests
before(function(done) {

    // Connect to mongodb

    mongoose.connect('mongodb://jrybojad:exchangeslug3@ds135003.mlab.com:35003/academi-slug', {
        useNewUrlParser: true,
    });



});

describe('addUser', () => {
    it('should add a new user and save it', (done) => {
        var res = data.addUser(user);

        expect(res).toInclude({
            googleID: '4321',
            email: 'sammyslub@ucsc.edu',
            firstName: 'Sammy',
            lastName: 'Slug',
            year: 'Junior',
            college: 'Nine',
            major: 'CS',
            bio: 'Banana Slug',
            coursesTeaching: [
                {

                    '_id': 21451,
                    'rating': 3
                },
                {
                    '_id': 21451,
                    'rating': 5
                }
            ],
            linkedIn: 'https://www.linkedin.com/in/rybojad/'
        });
        done();
    });
});


// Connect to mongodb

mongoose.connect('mongodb://jrybojad:exchangeslug3@ds135003.mlab.com:35003/academi-slug', {
    useNewUrlParser: true,
});
>>>>>>> 9c4206071ee5b9128338746ee50238dedf27b7a6
