var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(require('chai-as-promised'));

chai.should();
var expect = require('chai').expect;
const database = require('../webApp/server_modules/mongoose');
const classes = require('../webApp/server_modules/course_json_parser');

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

    
    describe('#updateUser()', () => {
        
        it('should update user', () => {
           return database.updateUser(testUser.googleID);
            });
        });
   

    describe('#addClass()', () => {
        it('should add a class', () => {
            return database.addClass._id;
        });
    });

    describe('#deleteClass()', () => {
        it('should delete a class', () => {
            return database.deleteClass._id;
        });
    });

    describe('#addReview()', () => {
        it('should add a review', () => {
            return database.addReview(testUser.googleID, database.findClass(420));
        });
    });

    describe('#deleteTutor()', () => {
        it('should delete a tutor', () => {
            return database.deleteTutor(testUser.googleID, testUser.coursesTeaching._id);
        });

        it('should set invalid googleID to null', () => {
            let nonGoogleID = Math.random();
            while (nonGoogleID == testUser.googleID)
                nonGoogleID = Math.random();

            database.findUser(nonGoogleID)
                .then(profile => {
                    return expect(profile).to.be.null;
                });
        });
    });

    //having trouble testing this method
    describe('#findClass()', () => {
        it('should find a class', () => {
            return database.Classes.findById(_id);
        });
    });

    describe('#getClassID()', () => {
        it('should return class ID', () => {
            return classes.getClassID
        })

        it('should return null on invalid classID', () => {

        }) 
    })

    describe('#isValidCourse()', () => {
        it('should return true', () => {

        })

        it('should return false', () => {

        })
    })

    describe('#getClassName()', () => {
        it('should return class name by classID without error', done => {
            database.Classes.getClassName
            done();
        });

        it('should return the correct class name given a classID', done => {
            database.Users.findById(testUser.googleID, (err, user) => {
                JSON.stringify(user).should.equal(JSON.stringify(testUser));
                done();
            });
        });

        it('should return null on invalid classID', done => {
            let nonGoogleID = Math.random();
            while (nonGoogleID == testUser.googleID)
                nonGoogleID = Math.random();

            database.Users.findById(nonGoogleID, (err,user) => {
                expect(user).to.be.null;
                done();
            });
        });
    })
        
});