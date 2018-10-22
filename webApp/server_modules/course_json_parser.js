const fs = require('fs');
var classObject;

fs.readFile('..\\..\\webScrapper\\ucsc-courses.json', (err, data) => {
  if (err){
	  console.log("File does not exist");
	  throw err;
  }
  multiClassObject = JSON.parse(data);
});

// Errors thrown for the line below:
//module.export.courses = coursesObjArray;

function getClassID(className){
	return multiClassObject[className];
}