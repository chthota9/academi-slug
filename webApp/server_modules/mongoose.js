const mongoose = require('mongoose');
const { getClassID } = require('./course_json_parser');

mongoose.set('useFindAndModify', false); //Avoid deprecation warning
mongoose.connect('mongodb://jrybojad:exchangeslug3@ds135003.mlab.com:35003/academi-slug', {
    useNewUrlParser: true
});

// Establishes Mongoose connection
const connection = mongoose.connection;
connection.once('open', function() {
    console.log('We\'re connected to the database!');
});

// Defines ClassSchema
let classSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
        unique: true,
        alias: 'courseNo'
    },
    tutors: [{ type: Number, ref: 'Users' }]
}, {
    autoIndex: false,
    versionKey: false,
    _id: false
});


classSchema.pre('findOne', function() {
    this.populate('tutors', 'name _id coursesTeaching');
});

// Defiens Classes model
let Classes = mongoose.model('Classes', classSchema);

let courseTeachingSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        default: 0
    },
    reviewCount: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    autoIndex: false,
    versionKey: false,
    _id: false
});

courseTeachingSchema.virtual('courseNo')
    .get(function() {
        return this._id;
    })
    .set(function(val) {
        this._id = val;
    });

// Defines UserSchema
let userSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
        unique: true,
        alias: 'googleID'
    },
    email: {
        type: String,
        required: true
    },
    name: {
        first: {
            type: String,
            required: true,
            alias: 'firstName'
        },
        last: {
            type: String,
            required: true,
            alias: 'lastName'
        },
        _id: {
            id: false
        }
    },
    year: {
        type: String,
        required: true
    },
    college: {
        type: String,
        required: true
    },
    major: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: true
    },
    linkedIn: {
        type: String,
    },
    coursesTeaching: [courseTeachingSchema]
}, {
    autoIndex: false,
    versionKey: false,
    _id: false
});

userSchema.virtual('fullName').get(function() {
    return this.firstName + ' ' + this.lastName;
});

// Defines Users model
let Users = mongoose.model('Users', userSchema);

// Adds a user to the database
function addUser (user) {
    return new Promise((resolve, reject) => {
        let userAdded = new Users({
            googleID: user.googleID,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            year: user.year,
            college: user.college,
            major: user.major,
            bio: user.bio,
            linkedIn: user.linkedIn,
            coursesTeaching: user.coursesTeaching,
        });

        userAdded.save((err, profile) => {
            if (err) {
                return reject(err);
            }
            resolve(profile);
        });
    });
}

/**
 * @param {Number} googleID The user to be deleted
 */
function deleteUser (googleID) {
    return new Promise((resolve, reject) => {
        Users.findByIdAndDelete(googleID, function(err) {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}

/**
 * @param {Number} googleID The user trying to be found
 */
function findUser (googleID) {
    return new Promise((resolve, reject) => {
        Users.findById(googleID)
            .exec((err, profile) => {
                if (err) {
                    return reject(err);
                }
                resolve(profile);
            });
    });
}

/**
 * @param {Object} user The user to update
 * @param {Object} updates The changes to the profile
 */
function updateUser (user, updates) {
    return new Promise((resolve, reject) => {
        let keys = Object.keys(updates);
        let profileUpdate = {};
        if (keys.includes('coursesTeaching')) {
            for (const key in updates) {
                if (key !== 'coursesTeaching') {
                    profileUpdate[key] = updates[key];
                }
            }
        }
        let courses = updates.coursesTeaching || [];
        let delCourses = [];
        let newCourses = [];
        for (let i = 0; i < courses.length; i++) {
            let course = courses[i];
            if (course.includes('-')) {
                course = course.substring(1);
                delCourses.push({ _id: getClassID(course) });
                continue;
            }
            newCourses.push({ _id: getClassID(course) });
        }
        delCourses.forEach(course => {
            user.coursesTeaching.pull(course);
        });
        newCourses.forEach(course => {
            user.coursesTeaching.addToSet(course);
        });
        for (const field in updates) {
            if (field !== 'coursesTeaching') {
                const newResult = updates[field];
                user[field] = newResult;
            }
        }
        user.save(function(err) {
            if (err) return reject(err);
            resolve();
        });
    });
}

/**
 * @param {Number} googleID Account to add review under
 * @param {Number} classID Course to review account on
 * @param {Object} reviews The contains rating of each category
 */
function addReview(googleID, classID, reviews) {
    return new Promise((resolve, reject) => {
        findUser(googleID)
            .then(thisUser => {
                // Loop through array of coursesTeaching to find rating for the specific course
                let thisClass = thisUser.coursesTeaching.id(classID);
                let oldRating = thisClass.rating;
                let newRating = 0;
                for (var category in reviews) {
                    newRating += reviews[category];
                }
                newRating /= 4;

                // Increments the reviewCount before division.
                thisClass.rating = (oldRating * thisClass.reviewCount + newRating) / (++thisClass.reviewCount);
                thisUser.save((err) => {
                    if (err) return reject(err);
                    resolve();
                });
            });
    });
}


// Adds a class to the database
function addClass (courseNo) {
    return new Promise((resolve, reject) => {
        let classAdded = new Classes({ courseNo, tutors: [] });
        classAdded.save((err, course) => {
            if (err) {
                return reject(err);
            }
            resolve(course);
        });
    });
}

/**
 * @param {Number} courseNo Course number of course to delete
 * @summary Deletes a class from the database
 */
function deleteClass (courseNo) {
    return new Promise((resolve, reject) => {
        Classes.findByIdAndDelete(courseNo, function(err) {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}

/**
 * @param {Number} courseNo The course's course number the tutor should be added to
 * @param {Number} tutorID The tutor's google ID
 * @returns {Promise<>} The tutor that was added under a class
 */
function addTutor (courseNo, tutorID) {
    return new Promise((resolve, reject) => {
        Classes.findByIdAndUpdate(courseNo, { $push: { tutors: tutorID } })
            .exec((err, updatedCourse) => {
                if (err) return reject(err);
                resolve(updatedCourse);
            });
    });
}

/**
 * @param {Number} googleID The tutor to be removed from a course
 * @param {Number} courseNo The course that the tutor is being removed from
 */
function deleteTutor (googleID, courseNo) {
    return new Promise((resolve, reject) => {
        Classes.findByIdAndUpdate(courseNo, { $pull: { tutors: googleID }})
            .exec((err, user) => {
            if (err) {
                return reject(err);
            }
            resolve(user);
        });
    });
}

// Finds a class
/**
 * @param {Number} courseNo The course being looked for
 * @returns {Promise<Array>} The tutors teaching the course
 */
function findClass (courseNo) {
    return new Promise((resolve, reject) => {
        Classes.findById(courseNo)
            .exec((err, classQuery) => {
                if (err) return reject(err);

                let tutors = [];
                if (classQuery != null)
                    classQuery.tutors.forEach(tutorDoc => {
                        let tutor = {
                            googleID: tutorDoc.googleID,
                            name: { first: tutorDoc.firstName, last: tutorDoc.lastName },
                            rating: tutorDoc.coursesTeaching.id(courseNo).rating,
                            reviewCount: tutorDoc.coursesTeaching.id(courseNo).reviewCount
                        };
                        tutors.push(tutor);
                    });
                resolve(tutors);
            });
    });
}

module.exports = {
    Users,
    addUser,
    deleteUser,
    findUser,
    updateUser,
    Classes,
    addClass,
    findClass,
    deleteTutor,
    deleteClass,
    addTutor,
    connection,
    addReview,
};

