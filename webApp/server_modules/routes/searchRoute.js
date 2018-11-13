const express = require('express');
const router = express.Router();

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
    console.log(req.query.search);
    let classSearched = {
        name: 'CMPS 115',
        tutors: [{ googleID: 4321, name: 'Sammy Slug', rating: 4 }, { googleID: 5555, name: 'George Bluementhall', rating: 2 }]
    };
    res.render('search-page', { classSearched });
});


module.exports = router;