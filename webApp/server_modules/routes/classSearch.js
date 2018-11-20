const router = require('express').Router();
const {getAllClasses} = require('../course_json_parser');

// A route used when a user searches for a class
router.get('/', (req, res) => {
    console.log(`Client is looking for ${req.query.q}`);
    let classes = getAllClasses();
    res.json(classes);
});

router.post('/allclasses',(req,res)=>{
    res.json(getAllClasses());
});

module.exports = router;