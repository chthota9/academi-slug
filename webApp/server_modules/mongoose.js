const mongoose = require('mongoose');
mongoose.connect("mongodb://jrybojad:exchangeslug3@ds135003.mlab.com:35003/academi-slug", { useNewUrlParser: true })
const connection = mongoose.connection;
connection.once('open', function () {
	console.log("We're connected to the database!");
});

let userSchema = new mongoose.Schema({
	googleID: { type: Number, required: true },
	email: { type: String, required: true },
	name: { firstName: { type: String, required: true }, lastName: { type: String, required: true }, _id: { id: false }},
	year: { type: String, required: true },
	college: { type: String, required: true },
	major: { type: String, required: true },
	bio: { type: String, required: true },
	coursesTaught: [{ courseNo: { type: Number, required: true, }, rating: { type: Number, required: true }, _id: { id: false } }]
}, { autoIndex: false, versionKey: false });


userSchema.index({ googleID: 1 }, { sparse: true });

let Users = mongoose.model('Users', userSchema);

function addUser(user) {
	return new Promise((resolve, reject) => {
		let userAdded = new Users({
			googleID: user.googleID,
			email: user.email,
			name: { firstName: user.firstName, lastName: user.lastName },
			year: user.year,
			college: user.college,
			major: user.major,
			bio: user.bio,
			coursesTaught: user.coursesTaught
		});
		userAdded.save((err, profile) => {
			if (err) { return reject(err) }
			console.log("User " + profile.googleID + " added.");
			resolve(profile);
		})
	})
}

//addUser({googleID: 24245, email:'sammyslub@ucsc.edu', name:{firstName:'Sammy', lastName: 'Slug'}, year:'Junior', college: 'Nine', major:'CS', bio:'Banana Slug', coursesTaught:[{courseNo: 'CMPS115'}, {courseNo: 'MATH117'}]});

function deleteUser(googleID) {
	return new Promise((resolve, reject) => {
		Users.deleteOne({ googleID: { $eq: googleID } }, function (err) {
			if (err) {
				console.log("User with googleID " + googleID + " does not exist.");
				reject(err);
			}
			console.log("User " + googleID + " deleted.");
			resolve();
		});

	})

}

// deleteUser(113030757337216400000)

//deleteUser(24245);

function findUser(googleID) {
	console.log("Searching for user " + googleID);
	return new Promise((resolve, reject) => {
		Users.findOne({ googleID: googleID }).exec((err, userQuery) => {
			if (userQuery != null) {
				console.log("User with googleID " + googleID + " has email " + userQuery.email);
			}
			return res(userQuery);
		});
	})
}

//findUser(24245);

function updateUser(user) {
	console.log("Updating user " + googleID);
	return new Promise((resolve, reject) => {
		Users.findById(user.googleID, function(err, user) {
			if (err) return handleError(err);
			otherUser.set(user);
		})
	})
}

module.exports = {
	addUser, deleteUser, findUser, updateUser, connection,
}