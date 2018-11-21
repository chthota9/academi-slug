var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(require('chai-as-promised'));

chai.should();
var expect = require('chai').expect;
const database = require('../webApp/server_modules/mongoose');

let testUser = new database.Users({
    googleID: Math.random(),
    email: 'testUser@gmail.com',
    firstName: 'Test',
    lastName: 'User',
    year: 'Sophoomre',
    college: 'Kresge',
    major: 'Computer Science',
    bio: 'I like to teach!', 
    linkedIn: 'test URL',
    coursesTeaching: [{ _id: 420, rating: 4 }, { _id: 567, rating: 2 }]
});

before(() => {
    database.Users.deleteMany({ email: 'testUser@gmail.com' }, function(err) {
        console.log(err);
    });
});

describe('user', () => {
    describe('#save()', () => {
        it('should save without error', done => {
            testUser.save(err  => {
                if (err) done(err);
                else done();
            });
        });

        it('should save correct document into database', done => {
            database.Users.findById(testUser.googleID, (err,thisUser) => {
                    JSON.stringify(thisUser).should.equal(JSON.stringify(testUser));
                    done();
                });
        });

        it('should not save two Users with the same googleID', done => {
            new Promise(() => {
                return new Promise(testUser.save(() => {testUser.save();}));
            }).should.be.rejected.notify(done);
        });
    });

    describe('#findById()', () => {
        it('should find user by googleID without error', done => {
            database.Users.findById(testUser.googleID);
            done();
        });

        it('should find the correct user given a googleID', done => {
            database.Users.findById(testUser.googleID, (err, user) => {
                JSON.stringify(user).should.equal(JSON.stringify(testUser));
                done();
            });
        });

        it('should return null on invalid googleID', done => {
            let nonGoogleID = Math.random();
            while (nonGoogleID == testUser.googleID)
                nonGoogleID = Math.random();

            database.Users.findById(nonGoogleID, (err,user) => {
                expect(user).to.be.null;
                done();
            });
        });
    });

    describe('#delete()', () => {
        it('should delete without error', done => {
            database.Users.deleteOne(testUser, () =>{
                done();
            });
        });

        it('user deleted should not be in database', done => {
            database.Users.findById(testUser.googleID, (err, user) => {
                expect(user).to.be.null;
                done();
            });
        });
    });

    describe('#addUser()', () => {
        it('should add user without error', done => {
            database.addUser(testUser);
            done();
        });

        it('should add correct user into database', done => {
            database.Users.findById(testUser.googleID, (err,thisUser) => {
                JSON.stringify(thisUser).should.equal(JSON.stringify(testUser));
                done();
            });
        });

        it('should not add two Users with the same googleID', done => {
            new Promise(() => {
                return new Promise(database.addUser(testUser));
            }).should.be.rejected.notify(done);
        });
    });

    describe('#findUser()', () => {
        it('should find user without error', done => {
            database.findUser(testUser.googleID);
            done();
        });

        // Can ignore duplicate key error index
        it('should find the correct user given a googleID', done => {
            database.findUser(testUser.googleID)
                .then(user => {
                    JSON.stringify(user).should.equal(JSON.stringify(testUser));
                    done();
                });
        });

        it('should return null on invalid googleID', done => {
            let nonGoogleID = Math.random();
            while (nonGoogleID == testUser.googleID)
                nonGoogleID = Math.random();

            database.findUser(nonGoogleID)
                .then(user => {
                    expect(user).to.be.null;
                    done();
                });
        });
    });

    describe('#deleteUser()', () => {
        it('should delete user without error', done => {
            database.deleteUser(testUser.googleID);
            done();
        });

        it('user deleted should not be in database', done => {
            database.findUser(testUser.googleID)
                .then(user => {
                    expect(user).to.be.null;
                    done();
                });
        });
    });
});

after(() => {
    database.Users.deleteMany({ email: 'testUser@gmail.com' }, function(err) {
        console.log(err);
    });
});