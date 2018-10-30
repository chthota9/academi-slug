const router = require('express').Router();

router.get('/:q', (req, res) => {
    console.log(`client is looking for ${req.params.q}`);
    res.send(`${req.params.q}`);
});

module.exports = router;