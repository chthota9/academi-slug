const express = require('express');
const router= express.Router();


/**
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {*} next 
 */
 

router.get('/', function(req, res) {
    console.log('Request for home recieved')
    res.render('search-page')
})


module.exports = router;