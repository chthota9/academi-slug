const mongoose = require('mongoose');
mongoose.connect("mongodb://jrybojad:exchangeslug3@ds135003.mlab.com:35003/academi-slug", { useNewUrlParser: true })
let db = mongoose.connection;
db.once('open', function () {
	console.log("we're connected!");
});

let userSchema = new mongoose.Schema({
	googleID: { type: Number, required: true },
	email: { type: String, required: true },
	name: { firstName: { type: String, required: true }, lastName: { type: String, required: true } },

	year: { type: String, required: true },
	college: { type: String, required: true },
	major: { type: String, required: true },
	bio: { type: String, required: true },
	coursesTaught: [{ courseNo: { type: Number, required: true } }]
}, { autoIndex: false, versionKey: false });

userSchema.index({ googleID: 1 }, { sparse: true });

let Users = mongoose.model('Users', userSchema);

function addUser(user) {
	return new Promise((res, rej) => {
		let userAdded = new Users({
			googleID: user.googleID,
			email: user.email,
			name: { firstName: user.name.firstName, lastName: user.name.lastName },
			year: user.year,
			college: user.college,
			major: user.major,
			bio: user.bio,
			coursesTaught: user.coursesTaught
		});
		userAdded.save((err, user1) => {
			console.log("User " + user1.googleID + " added.");
			if (err) { return rej(err) }
			res(user1);
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

//deleteUser(24245);

function findUser(googleID) {
	console.log("Searching for user " + googleID);
	return new Promise((res, rej) => {
		Users.findOne({ googleID: googleID }).exec((err, userQuery) => {
			if (err) {
				console.log("User with googleID " + googleID + " does not exist.");
				return rej(err);
			}
			console.log("User with googleID " + googleID + " has email " + userQuery.email);
			return res(userQuery);
		});
	})

}

//findUser(24245);


module.exports = {
	addUser, deleteUser, findUser
}