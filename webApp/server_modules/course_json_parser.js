const fs = require('fs');
let coursesObjArray;

fs.readFile('../courses.json', (err, data) => {
  if (err){
	  console.log("File does not exist");
	  throw err;
  }
  coursesObjArray = JSON.parse(data);
});

module.export.courses = coursesObjArray;
