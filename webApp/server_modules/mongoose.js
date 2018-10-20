const mongoose = require('mongoose');
mongoose.connect("mongodb://jrybojad:exchangeslug3@ds135003.mlab.com:35003/academi-slug", { useNewUrlParser: true })
let db = mongoose.connection;
db.once('open', function() {
  console.log("we're connected!");
});

let userSchema = new mongoose.Schema({
	googleID: {type: Number, required: true},
	email: {type: String, required: true},	
	name: {firstName: {type: String, required: true}, lastName: {type: String, required: true}},
	
	year: {type: String, required: true},
	college: {type: String, required: true},
	major: {type: String, required: true},
	bio: {type: String, required: true},
	coursesTaught: [{courseNo: {type: String, required: true}}]
	}, {autoIndex: false, versionKey: false});
	
userSchema.index({googleID: 1 }, { sparse: true });
	
let Users = mongoose.model('Users', userSchema);

function addUser(userItem) {
	let userAdded = new Users({
		googleID: userItem.googleID,
		email: userItem.email,	
		name: {firstName: userItem.name.firstName, lastName: userItem.name.lastName},
		year: userItem.year,
		college: userItem.college,
		major: userItem.major,
		bio: userItem.bio,
		coursesTaught: userItem.coursesTaught
		});
	userAdded.save(function(err,user1) {
		console.log("User " + userAdded.googleID + " added.");
	})
}

//addUser({googleID: 24245, email:'sammyslub@ucsc.edu', name:{firstName:'Sammy', lastName: 'Slug'}, year:'Junior', college: 'Nine', major:'CS', bio:'Banana Slug', coursesTaught:[{courseNo: 'CMPS115'}, {courseNo: 'MATH117'}]});

function deleteUser(googleID) {
	Users.deleteMany({ googleID: {$eq: googleID}}, function (err) {
		if (err) {
			return console.log("User with googleID " + googleID + " does not exist.");
		}
	console.log("User " + googleID +" deleted.");
	});
}

//deleteUser(24245);

function findUser(googleID){
	console.log("Searching for user " + googleID);
	let userQuery = Users.findOne({googleID: googleID}).exec(function(err, userQuery) {
		if (err){
			return console.log("User with googleID " + googleID + " does not exist.");
		}
	console.log("User with googleID " + googleID + " has email " + userQuery.email);
	return userQuery;
	});
}

//findUser(24245);
