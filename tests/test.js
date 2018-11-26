require('chai').should();
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
    coursesTeaching: [{ _id: 420, rating: 4 }, { _id: 567, rating: 2 }],
    linkedIn: 'test URL'
});

describe('user', () => {    
    describe('#save()', () => {
        it('should save without error', () => {
            return testUser.save();
        });

        it('should save correct document into database', () => {
            return database.Users.findById(testUser.googleID)
                .then(thisUser =>{
                    JSON.stringify(thisUser).should.equal(JSON.stringify(testUser));
                });
        });

        it('should not save two Users with the same googleID', () => {
            return expect(function() { testUser.save.then(testUser.save()); }).to.throw(Error);
        });
    });

    describe('#findById()', () => {
        it('should find user by googleID without error', () => {
            return database.Users.findById(testUser.googleID);
        });

        it('should return null on invalid googleID', ()=> {
            let nonGoogleID = Math.random();
            while (nonGoogleID == testUser.googleID)
                nonGoogleID = Math.random();

            database.Users.findById(nonGoogleID)
                .then( profile => {
                    return expect(profile).to.be.null;
            });
        });
    });

    describe('#delete()', () => {
        it('should delete without error', () => {
            return database.Users.deleteOne(testUser);
        });

        it('user deleted should not be in database', () => {
            database.Users.findById(testUser.googleID)
                .then(profile => {
                    return expect(profile).to.be.null;
                });
        });
    });

    describe('#addUser()', () => {
        it('should add user without error', () => {
            return database.addUser(testUser);
        });

        it('should save correct user into database', () => {
            return database.Users.findById(testUser.googleID)
                .then(thisUser => {
                    JSON.stringify(thisUser).should.equal(JSON.stringify(testUser));
                });
        });

        // still need to catch rejection
        // it('should not add two Users with the same googleID', () => {
        //     return expect(function() { database.addUser(testUser).then(database.addUser(testUser)); }).to.throw(Error);
        // });

    });

    describe('#findUser()', () => {
        it('should find user without error', () => {
            return database.findUser(testUser.googleID);
        });

        it('should retun null on invalid googleID', () => {
            let nonGoogleID = Math.random();
            while (nonGoogleID == testUser.googleID)
                nonGoogleID = Math.random();

            database.findUser(nonGoogleID)
                .then(profile => {
                    return expect(profile).to.be.null;
                });
        });
    });

    describe('#deleteUser()', () => {
        it('should delete user without error', () => {
            return database.deleteUser(testUser.googleID);
        });

        it('user deleted should not be in database', () => {
            database.findUser(testUser.googleID)
                .then(profile => {
                    return expect(profile).to.be.null;
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
            return database.addReview(testUser.googleID);
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
            return database.findById(Classes._id);
        });

    });
});