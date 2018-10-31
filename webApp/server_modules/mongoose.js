const mongoose = require('mongoose');
mongoose.connect("mongodb://jrybojad:exchangeslug3@ds135003.mlab.com:35003/academi-slug", {
	useNewUrlParser: true
})
const connection = mongoose.connection;
connection.once('open', function () {
	console.log("We're connected to the database!");
});

// connection.dropDatabase();


let userSchema = new mongoose.Schema({
	googleID: {
		type: Number,
		required: true,
		unique: true
	},
	email: {
		type: String,
		required: true
	},
	name: {
		firstName: {
			type: String,
			required: true
		},
		lastName: {
			type: String,
			required: true
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
	coursesTaught: [{
		courseNo: {
			type: String,
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
	versionKey: false
});




let Users = mongoose.model('Users', userSchema);

Users.createIndexes({
	googleID: 1
})
function addUser(user) {
	return new Promise((resolve, reject) => {
		let userAdded = new Users({
			googleID: user.googleID,
			email: user.email,
			name: {
				firstName: user.firstName,
				lastName: user.lastName
			},
			year: user.year,
			college: user.college,
			major: user.major,
			bio: user.bio,
			coursesTaught: user.coursesTaught
		});
		userAdded.save((err, profile) => {
			if (err) {
				return reject(err)
			}
			console.log("User " + profile.googleID + " added.");
			resolve(profile);
		})
	})
}






function deleteUser(googleID) {
	return new Promise((resolve, reject) => {
		Users.deleteOne({
			googleID: {
				$eq: googleID
			}
		}, function (err) {
			if (err) {
				console.log("User with googleID " + googleID + " does not exist.");
				return reject(err);
			}
			console.log("User " + googleID + " deleted.");
			resolve();
		});

	})

}
// addUser({
// 	googleID: 24245,
// 	email: 'sammyslub@ucsc.edu',
// 	firstName: 'Sammy',
// 	lastName: 'Slug',
// 	year: 'Junior',
// 	college: 'Nine',
// 	major: 'CS',
// 	bio: 'Banana Slug',
// 	coursesTaught: [{
// 		courseNo: 'CMPS115',
// 		rating: 4
// 	}]
// });


//deleteUser(113030757337216400000)

//deleteUser(24245);

//Needs more testing
function findUser(googleID) {
	console.log("Searching for user " + googleID);
	return new Promise((resolve, reject) => {
		Users.findOne({
			googleID: googleID
		}).exec((err, userQuery) => {
			if (err) return reject(err);
			resolve(userQuery);
		});
	})
}

//findUser(24245);

//Untested
function updateUser(googleID, userEdits) {
	console.log("Updating user " + googleID);
	return new Promise((resolve, reject) => {
		Users.findOneAndUpdate({
			googleID: googleID
		}, userEdits).exec((err, user) => {
			if (err) return reject(err);
			resolve(user);
		})
	})
}

//updateUser(24245, {name: 'Elizabeth'});

//Untested - probably not needed
function addReview(user, average) {
	console.log("Adding a review!");
}
let classSchema = new mongoose.Schema({
    courseNo: {
        type: String,
        required: true
    },
    tutors: [{
        googleID: {
            type: Number,
            required: true,
        },
        _id: {
            id: false
        }
    }]
}, {
    autoIndex: false,
    versionKey: false
});

classSchema.index({
    courseNo: 1
}, {
    sparse: true
});

let Classes = mongoose.model('Classes', classSchema);

//Untested
function addClass(course) {
    return new Promise((resolve, reject) => {
        let newClass = new Classes({
            courseNo: course.courseNo,
        });
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
function addTutor(googleID){
    console.log('I am adding a tutor to a class!');
}


module.exports = {
    addUser,
    deleteUser,
    findUser,
    updateUser,
    addClass,
    connection,
}