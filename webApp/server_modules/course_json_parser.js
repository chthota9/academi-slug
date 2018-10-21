const fs = require('fs');
var classObjArray;

fs.readFile('..\\..\\UCSC_Custom_API\\output.json', (err, data) => {
  if (err){
	  console.log("File does not exist");
	  throw err;
  }
  classObjArray = JSON.parse(data);
  // The line below works only in the reading scope of this file.
  console.log(getCourseName(classObjArray[1]));
});

// Errors thrown for the line below:
//module.export.courses = coursesObjArray;

function getClassID(classObject){
	return classObject.ClassID;
}

function getClassFullName(classObject) {
	return classObject['Course Name'];
}

function splitFullName(classObject){
	let fullNameString = "";
	fullNameString += getClassFullName(classObject);
	return fullNameString.split(" ");
}

//Example: "Course Name": "AMS 3 - 01   Precalculus"

function getCourseDept(classObject){
	let fullNameArray = splitFullName(classObject);
	return fullNameArray[0];
}

function getCourseSection(classObject){
	let fullNameArray = splitFullName(classObject);
	let courseSection = "";
	courseSection = courseSection + fullNameArray[1] + fullNameArray[2] + fullNameArray[3];
	return courseSection;
}

function getCourseName(classObject) {
	let fullNameArray = splitFullName(classObject);
	let courseName = "";
	courseName += fullNameArray[6];
	return courseName;
}

