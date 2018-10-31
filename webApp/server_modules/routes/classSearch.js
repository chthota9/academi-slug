const router = require('express').Router();

router.get('/', (req, res) => {
    console.log(`client is looking for ${req.query.q}`);
    let classes = ['CMPS 115', 'CMPS 112', 'CMPS 101', 'CMPS 200', 'CMPE 150'];
    res.send(JSON.stringify(classes));
});

module.exports = router;