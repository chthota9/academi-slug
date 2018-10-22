const fs = require('fs');
let classNameToID;
let classIDToName;
let classNames;
let classIDs;

function GetCourses() {
	return new Promise((resolve, reject) => {
		fs.readFile('./ucsc-courses.json', (err, data) => {
			if (err) {
				console.log("File does not exist");
				return reject(err);
			}
			return resolve(data);
		});
	})
}


function getClassID(className) {
	return classNameToID[className];
}

function getClassNames() {
	return classNames;
}

function getClassName(classID) {
	return classIDToName[classID];
}

module.exports = {
	getClassID, getClassName
}

GetCourses()
	.then(data => {
		classNameToID = JSON.parse(data);
		classNames = Object.keys(classNameToID);
		classIDs = Object.values(classNameToID);
		classIDToName = classVals.reduce((obj, val, i) => {
			obj[val] = classKeys[i];
			return obj;
		}, {});
	});