const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false); //Avoid deprecation warning
mongoose.connect("mongodb://jrybojad:exchangeslug3@ds135003.mlab.com:35003/academi-slug", {
    useNewUrlParser: true
})

const connection = mongoose.connection;
connection.once('open', function() {
    console.log("We're connected to the database!");
});
// connection.dropDatabase();
let classSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
        unique: true,
        alias: 'courseNo'
    },
    tutors: [{
        googleID: {
            type: Number,
            required: true,
        },
        rating: {
            type: Number,
            required:true
        },
        _id: {
            id: false
        }
    }]
}, {
    autoIndex: false,
    versionKey: false,
    _id: false
});


let Classes = mongoose.model('Classes', classSchema);



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
    coursesTeaching: [{
        courseNo: {
            type: Number,
            required: true,
        },
        rating: {
            type: Number,
            required: true
        },
        _id: {
            id: false
        }
    }]
}, {
    autoIndex: false,
    versionKey: false,
    _id: false
});

userSchema.virtual('fullName').get(function() {
    return this.firstName + ' ' + this.lastName;
});


let Users = mongoose.model('Users', userSchema);

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
            coursesTeaching: user.coursesTeaching
        });
        userAdded.save((err, profile) => {
            if (err) {
                return reject(err)
            }
            console.log(profile);
            console.log("User " + profile.googleID + " added.");
            resolve(profile);
        })
    })
}

//Uncomment to test
// deleteUser(24245)
//     .then(() => addUser({ googleID: 24245, email: 'sammyslub@ucsc.edu', firstName: 'Sammy', lastName: 'Slug', year: 'Junior', college: 'Nine', major: 'CS', bio: 'Banana Slug', coursesTeaching: [{ courseNo: 420, rating: 4 }] }))
//     .then(prof => findUser(prof.googleID))
//     .then(prof => {
//         console.log(`BEFORE: ${prof.fullName}`);
//         return prof;
//     })
//     .then((prof) => updateUser(prof.googleID, { 'name.first': 'Bob' }))
//     .then(prof => console.log(`AFTER: ${prof.fullName}`))
//     .catch(err => console.log(err));





function deleteUser (googleID) {
    return new Promise((resolve, reject) => {
        Users.findByIdAndDelete(googleID, function(err) {
            if (err) {
                console.log("User with googleID " + googleID + " does not exist.");
                return reject(err);
            }
            console.log("User " + googleID + " deleted.");
            resolve();
        });

    })

}


//Works
function findUser (googleID) {
    console.log("Searching for user " + googleID);
    return new Promise((resolve, reject) => {
        Users.findById(googleID)
            .exec((err, userQuery) => {
                if (err) { return reject(err); }
                resolve(userQuery);
            });
    })
}


//Tested works
function updateUser (googleID, userEdits) {
    console.log("Updating user " + googleID);
    return new Promise((resolve, reject) => {
        Users.findByIdAndUpdate(googleID, userEdits, { new: true })
            .exec((err, user) => {
                if (err) return reject(err);
                resolve(user);
            })
    })
}

//Untested - probably not needed
function addReview (user, average) {
    console.log("Adding a review!");
}


/**
 * func should add tutor under class but if class is not in database
 * add class to db with tutor under it
 */

//Untested
function addClass (course) {
    return new Promise((resolve, reject) => {
        let newClass = new Classes({ courseNo: course.courseNo });
        classAdded.save((err, course) => {
            if (err) {
                return reject(err)
            }
            console.log("class " + course.courseNo + " added.");
            resolve(course);
        })
    })
}

//Untested
function addTutor (googleID) {
    console.log('I am adding a tutor to a class!');
}


module.exports = {
    addUser,
    deleteUser,
    findUser,
    updateUser,
    addClass,
    connection
}