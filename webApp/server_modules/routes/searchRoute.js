const express = require('express');
const router = express.Router();
const {isValidCourse, getMajors, getClassID, getClassName } = require('../course_json_parser');
const {findClass,} = require(`../mongoose.js`);

/**
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {*} next
 */

//recieve classname
//find classNum
//search in db for class
//create an exception incase there aren't any tutors/the class doesnt exist in db
//from the db youll be given obj eg - {courseNo: 1234, tutors:[{googleID:4342422331 , name : 'Sam Slug', rating : 3 }] }

// this READS all
// A route used to render a user's search results
router.get('/', function(req, res) {
    var searched = req.query.search;
    console.log(req.query.search);
    console.log(searched);
    let courseNo = getClassID(req.query.search);
    findClass(courseNo).then(tutors =>{
        if(tutors.length < 1){
            res.render('search-page-error');
        }
        let classSearched = {
            name: searched,
            tutors: tutors
        };
        res.render('search-page', { classSearched });
    });
});



module.exports = router;