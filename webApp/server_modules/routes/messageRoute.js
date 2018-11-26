const express = require('express');
const router = express.Router();
const {Messages,} = require('../mongoose.js');

/**
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {*} next
 */

router.get('/', function(req, res) {
    console.log('User connected!');
    res.render('message');
});

router.get('/messages', (req, res) => {
    Messages.find({}, (err, messages) => {
        res.send(messages);
    });
});

router.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.save((err) => {
        if (err)
            console.log(err);
        res.sendStatus(200);
    });
});

module.exports = router;