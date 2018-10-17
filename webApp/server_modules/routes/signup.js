const router = require('express').Router();
const passport = require('passport');


router.get('/', passport.authenticate('googleSignUp', { scope: ['profile'], hd: 'ucsc.edu' }));

router.get('/createprofile', function (req, res) {
    console.log('create');
    
    console.log(req.session);

    res.render('createAccount');
})






module.exports = router;