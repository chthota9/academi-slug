const fs = require('fs');
var multiClassObject;

fs.readFile('..\\..\\webScrapper\\ucsc-courses.json', (err, data) => {
  if (err){
	  console.log("File does not exist");
	  throw err;
  }
  multiClassObject = JSON.parse(data);
});

// Errors thrown for the line below:
module.exports.courses = coursesObjArray;

function getClassID(className){
	return multiClassObject[className];
}