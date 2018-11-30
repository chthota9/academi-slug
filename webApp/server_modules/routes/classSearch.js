const router = require('express').Router();
const { getAllClasses } = require('../course_json_parser');

// A route used when a user searches for a class
router.get('/', (req, res) => {
    console.log(`Client is looking for ${req.query.q}`);
    let query = req.query.q;
    let courses = getAllClasses();
    let result = classSearch(query.toUpperCase(), courses);
    if (result.includes(null)) {
        return res.json([]);
    }
    res.json(courses.slice(result[0], result[1] + 1));
});

/**
 *
 * @param {String} query
 * @param {Array<String>} courses
 * @returns {[Number,Number]} index of first and last class
 */
function classSearch (query, courses) {
    let getFirst = findFirstClass(query, courses);
    let getLast = findLastClass(query, courses);
    return [getFirst, getLast];
}

function findLastClass (query, courses) {
    for (let i = courses.length - 1; i >= 0; i--) {
        const courseName = courses[i];
        if (courseName.startsWith(query)) {
            return i;
        }
    }
    return null;
}

function findFirstClass (query, courses) {
    for (let i = 0; i < courses.length; i++) {
        const courseName = courses[i];
        if (courseName.startsWith(query)) {
            return i;
        }
    }
    return null;
}

router.post('/allclasses', (req, res) => {
    res.json(getAllClasses());
});

module.exports = router;