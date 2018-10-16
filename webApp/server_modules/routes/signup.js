const router = require('express').Router();
const passport = require('passport');


router.get('/',
    passport.authenticate('google', { scope: ['profile'], hd: 'ucsc.edu' }),
    function (req, res) {
        console.log(req.user);
        
        res.render('createAccount');
    });






module.exports = router;