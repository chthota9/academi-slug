const router = require('express').Router();

// A route used when a user searches for a class
router.get('/', (req, res) => {
    console.log(`Client is looking for ${req.query.q}`);
    let classes = ['CMPS 115', 'CMPS 112', 'CMPS 101', 'CMPS 200', 'CMPE 150'];
    res.send(JSON.stringify(classes));
});

module.exports = router;