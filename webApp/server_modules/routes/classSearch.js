const router = require('express').Router();
const {getAllClasses} = require('../course_json_parser');

// A route used when a user searches for a class
router.post('/', (req, res) => {
    console.log(`Client is looking for ${req.query.q}`);
    let classes = ['CMPS 115', 'CMPS 112', 'CMPS 101', 'CMPS 200', 'CMPE 150'];
    res.send(JSON.stringify(classes));
});

router.post('/allclasses',(req,res)=>{
    res.json(JSON.stringify(getAllClasses()));
});

module.exports = router;