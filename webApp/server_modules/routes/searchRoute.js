const express = require('express');
const router = express.Router();
const { isValidCourse, getClassID, } = require('../course_json_parser');
const { findClass, } = require('../mongoose.js');

// this READS all
// A route used to render a user's search results
router.get('/', function(req, res) {
    var searched = req.query.search.toUpperCase();
    if (!isValidCourse(searched)) {
        return res.render('search-page-error');
    }
    let courseNo = getClassID(searched);
    findClass(courseNo).then(tutors => {
        if (tutors.length < 1) {
            return res.render('search-page-error');
        }
        let classSearched = {
            name: searched,
            tutors: tutors
        };
        res.render('search-page', { classSearched, loggedIn: req.isAuthenticated() });
    });
});

module.exports = router;