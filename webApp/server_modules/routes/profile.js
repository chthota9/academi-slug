const passport = require('passport');
const router = require('express').Router();
const { validateForm } = require('../validator');
const { getMajors } = require('../course_json_parser');
const { addUser } = require('../mongoose');

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
    res.render('profileView-user', { profile: req.user });
});

router.get('/signup', passport.authenticate('googleSignUp', { scope: ['profile', 'email'], hd: 'ucsc.edu' }));

router.get('/create', function (req, res) {
    console.log(req.session);
    res.render('createAccount', { user: req.user, majors: getMajors() });
})

router.get('/logout', function (req, res) {
    req.logout();
    console.log(req.session);
    res.redirect('/');
});

router.post('/createProfile', function (req, res) {
    console.log('CREATED PROFILE');
    let newProfile = {
        ...req.body, 'googleID': req.user.id,
        ...req.user.extra,
        coursesTaught: [{ courseNo: 0, rating: 0 }, { courseNo: 0, rating: 0 }, { courseNo: 0, rating: 0 }]
    }
    // console.log(newProfile);

    addUser(newProfile)
        .then(profile => {
            req.login({ id: profile.googleID }, err => {
                res.redirect('/profile');

            });
        })
});


module.exports = router;