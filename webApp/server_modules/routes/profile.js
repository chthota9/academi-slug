const passport = require('passport');
const router = require('express').Router();
const { validateForm } = require('../validator');
const {addUser} = require('../mongoose');

/**
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {*} next 
 */





router.get('/login', passport.authenticate('googleHave', { scope: ['profile', 'email'], hd: 'ucsc.edu' }));


router.get('/', function (req, res) {
    // console.log(req.session);
    console.log('profile ' + req.isAuthenticated());
    if (!req.isAuthenticated()) { return res.redirect('profile/login') }

    console.log(req.user);
    let profile = JSON.stringify(req.user, null, 3);
    res.render('logout', { profile: profile });
});

router.get('/signup', passport.authenticate('googleSignUp', { scope: ['profile', 'email'], hd: 'ucsc.edu' }));

router.get('/createprofile', function (req, res) {
    console.log(req.session);

    res.render('createAccount');
})

router.get('/logout', function (req, res) {
    req.logout();
    console.log(req.session);

    res.redirect('/');
});

router.post('/create',validateForm, function (req, res) {
    res.send(JSON.stringify(req.body));
});


module.exports = router;