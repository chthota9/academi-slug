const fs = require('fs');
let classNameToID;
let classIDToName;
let classNames;
let classIDs;
let ucscMajors;

// Extracts all courses from input file
function getUCSCCourses () {
    return new Promise((resolve, reject) => {
        fs.readFile('./ucsc-courses.json', (err, data) => {
            if (err) {
                console.log('File does not exist');
                return reject(err);
            }
            return resolve(data);
        });
    });
}

// Extracts all majors from input file
function getUCSCMajors () {
    return new Promise((resolve, reject) => {
        fs.readFile('./ucsc-majors.json', (err, data) => {
            if (err) {
                console.log('File does not exist');
                return reject(err);
            }
            return resolve(data);
        });
    });
}

// Quick helper functions to return self-described parameters
/**
 *
 * @param {String} className
 * @returns {Number}
 */
function getClassID (className) {
    return classNameToID[className];
}
/**
 * @param {String} className
 * @returns {Boolean}
 */
function isValidCourse (className) {
    return classNameToID.hasOwnProperty(className);
}

/**
 *@returns {Array<String>}
 */
function getAllClasses () {
    return classNames;
}
/**
 * @param {Number} classID
 * @returns {String}
 */
function getClassName (classID) {
    return classIDToName[classID];
}
/**
 * @returns {Array<String>}
 */
function getMajors () {
    return ucscMajors;
}

// Extracts UCSC courses
getUCSCCourses()
    .then(data => {
        classNameToID = JSON.parse(data);
        classNames = Object.keys(classNameToID);
        classIDs = Object.values(classNameToID);
        classIDToName = classIDs.reduce((obj, val, i) => {
            obj[val] = classNames[i];
            return obj;
        }, {});
    })
    .then(getUCSCMajors)
    .then(majors => {
        ucscMajors = JSON.parse(majors);
    })
    .catch(err => console.log(err));

module.exports = {
    getClassID,
    getClassName,
    getMajors,
    getAllClasses,
    isValidCourse
};