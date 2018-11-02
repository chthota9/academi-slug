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
router.get('/', function(req, res) {
    console.log('Request for home recieved')
    res.render('search-page')
})


module.exports = router;