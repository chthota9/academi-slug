var chai = require('chai');
chai.use(require('chai-as-promised'));
chai.should();
var expect = require('chai').expect;
const database = require('../webApp/server_modules/mongoose');
const classes = require('../webApp/server_modules/course_json_parser');

// Defines a sample input
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
    coursesTeaching: [{ _id: 420, rating: 4 }]
});

let testUser2 = new database.Users({
    googleID: Math.random(),
    email: 'testUser@gmail.com',
    firstName: 'Test',
    lastName: 'User',
    year: 'Sophoomre',
    college: 'Kresge',
    major: 'Computer Science',
    bio: 'I like to teach!', 
    linkedIn: 'test URL',
    coursesTeaching: [{ _id: 420, rating: 4 }]
});

let testClass = new database.Classes({
    _id: 890, 
    tutors: []
});

// Before each execution, deletes any spare testUser documents
before(() => {
    database.Users.deleteMany({ email: 'testUser@gmail.com' }, function(err) {
        console.log(err);
    });
    database.Classes.deleteMany({_id:890},(err)=>{
        console.log(err);
    })
});

// Tests all functions of UserSchema
describe('user', () => {
    describe('#save()', () => {
        it('should save without error', done => {
            testUser.save(err  => {
                if (err) done(err);
                else done();
            });
        });

        it('should save without error', done =>{
            testUser2.save(err => {
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

        it('should save correct document into database', done => {
            database.Users.findById(testUser2.googleID, (err,thisUser) => {
                    JSON.stringify(thisUser).should.equal(JSON.stringify(testUser2));
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
            database.addUser(testUser).catch(err=>done());
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
        it('should update user', done => {
            updates = {bio:'I hate to teach'};
           //database.updateUser(testUser, updates);
           database.updateUser(testUser2, updates)
           .then(()=> database.findUser(testUser2.googleID))
           .then(user=>{
               expect(user.bio).to.equal('I hate to teach');
               done();
           });
            });
        });
});

// Tests all functions of ClassSchema
describe('class', () => {
    describe('#addClass()', () => {
        it('should add a class without error', done => {
            database.addClass(testClass._id)
            .then(course=>{
                expect(course.courseNo).to.equal(testClass._id);
                done();
            });
        });
    });

    describe('#addReview()', () => {
        reviews = {"quality_of_teaching":2,"punctuality":3,"politeness":4,"organization":5}          
        it('should add a review', done => {             
            database.addReview(testUser2.googleID, 420, reviews)                 
            .then(() => database.findUser(testUser2.googleID))
            .then(user=>{
                expect(user.coursesTeaching.id(420).rating).to.equal(3.75);                     
                done();
            });     
        });     
    });

    describe('#addTutor()',() => {
        it('should add tutor for the courseNo', done => {
            database.addTutor(testClass._id, testUser2.googleID)
            .then(course =>{
                expect(course.tutors[0]).to.equal(testUser2.googleID);
                done();
            });
        });
    });

    // describe('#findClass()', () => {
    //     it('should find a class', done => {
    //         database.deleteTutor(testUser2.googleID,testClass._id)
    //         .then(=>database.findClass(testClass._id))
    //         .then(tutors=>{
    //             expect(tutors.length).to.equal(0);
    //             done();
    //         })
    //     });
    // });

    describe('#deleteTutor()', () => {
        it('should delete a tutor', (done) => {
            database.deleteTutor(testUser.googleID, testClass._id);
            done();
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
    describe('#deleteClass()', () => {
        it('should delete a class', done => {
            database.deleteClass(testClass._id);
            done();
        });
    });
});


describe('parserFunctions', () => {
    describe('#getClassID()', () => {
        it('should return class ID without error', done => {
            classes.getClassID('CMPS 115');
            done();
        });

        it('should return a correct class ID', done => {
            classes.getClassID('CMPS 115').should.equal(21451);
            done();
        });

        it('should return undefined on invalid class name', done => {
            expect(classes.getClassID('DOBRA 302')).to.be.undefined;
            done();
        });
    });

    describe('#isValidCourse()', () => {
        it('should return true for a real class name', done => {
            expect(classes.isValidCourse('CMPS 101')).to.be.true;
            done();
        });

        it('should return false if we take a fake class name', done => {
            expect(classes.isValidCourse('THIS_IS_NOT_A_CLASSNAME 101')).to.be.false;
            done();
        });
    });

    describe('#getClassName()', () => {
        it('should return class name without error', done => {
            classes.getClassName(21529);
            done();
        });

        it('should return a correct class name', done => {
            classes.getClassName(21529).should.equal('ECON 1');
            done();
        });

        it('should return undefined on invalid class name', done => {
            expect(classes.getClassName(95064)).to.be.undefined;
            done();
        });
    });
});