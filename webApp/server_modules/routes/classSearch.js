const router = require('express').Router();

router.get('/', (req, res) => {
    console.log(`client is looking for ${req.query.q}`);
    res.send(`${req.query.q}`);
});

module.exports = router;