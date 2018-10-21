const fs = require('fs');
let coursesObjArray;

fs.readFile('..\\..\\UCSC_Custom_API\\output.json', (err, data) => {
  if (err){
	  console.log("File does not exist");
	  throw err;
  }
  coursesObjArray = JSON.parse(data);
});

module.export.courses = coursesObjArray;

function getClassID(courseObject){
	return classObject.ClassID;
}

function getClassFullName(courseObject) {
	return classObject.CourseName;
}

function splitFullName(courseObject){
	let fullNameString = "";
	fullNameString += getClassFullName(courseObject);
	return fullNameString.split(" ");
}

//Example: "Course Name": "AMS 3 - 01   Precalculus"

function getCourseDept(courseObject){
	let fullNameArray = splitFullName(courseObject);
	return fullNameArray[0];
}

function getCourseSection(courseObject){
	let fullNameArray = splitFullName(courseObject);
	let courseSection = "";
	courseSection = courseSection + fullNameArray[1] + fullNameArray[2] + fullNameArray[3];
	return courseSection;
}

function getCourseName(courseObject) {
	let fullNameArray = splitFullName(courseObject);
	let courseName = "";
	courseName += fullNameArray[4];
	return courseName;
}

//console.log(getCourseDept(coursesObjArray[0]));

