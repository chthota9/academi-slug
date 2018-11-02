const passport = require('passport');
const router = require('express').Router();
const { validateForm } = require('../validator');
const { getMajors, getClassID } = require('../course_json_parser');
const { addUser, updateUser, deleteUser } = require('../mongoose');

/**
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {*} next 
 */

router.get('/', function(req, res) {
    // console.log(req.session);
    console.log('profile ' + req.isAuthenticated());
    if (!req.isAuthenticated()) {
        return res.redirect('profile/login')
    }

    console.log(req.user);
    res.render('profileView-user', { profile: req.user });
});


router.get('/login', passport.authenticate('googleHave', { scope: ['profile', 'email'], hd: 'ucsc.edu' }));

router.get('/signup', passport.authenticate('googleSignUp', { scope: ['profile', 'email'], hd: 'ucsc.edu' }));

router.get('/create', function(req, res) {
    res.render('createAccount', { user: req.user, majors: getMajors() });
});

router.get('/logout', function(req, res) {
    req.logout();
    console.log(req.session);
    res.redirect('/');
});


router.post('/createProfile', function(req, res) {
    console.log('CREATED A PROFILE');
    let profile = newProfile(req.body, req.user.id, req.user.extra);
    addUser(profile)
        .then(profile => {
            req.login({ id: profile.googleID }, err => {
                res.redirect('/profile');
            });
        })
        //TODO: SEND ERR BACK AND REDIRECT CLIENT
        .catch(err => console.log(err))
});

//Incomplete
router.get('/review', function(req, res) {
    console.log('REVIEWING A CLASS');
    res.render('review', { user: req.user, class: req.body });
});

//Incomplete
router.post('/submitReview', function(req, res) {
    console.log('SUBMITTING A REVIEW');
    var avg = sum(...req.body) / 4.0;
    console.log(avg);

    addReview(req.user.id, avg)
        .then(res.redirect('profileView-guest', { profile: req.user }));
});

//Incomplete
router.post('/updateProfile', function(req, res) {
    console.log('UPDATED A PROFILE');
    let updatedProfile = {
        ...req.body,
        'googleID': req.user.id,
        ...req.user.extra
    }
    console.log(updatedProfile);

    updateUser(updatedProfile)
        .then(res.redirect('/profile'));
});

router.get('/delete', (req, res) => {
    if (!req.isAuthenticated()) {

    }
})


function newProfile (body, googleID, extra) {
    return {
        firstName: body.firstName,
        lastName: body.lastName,
        year: body.year,
        college: body.college,
        major: body.major,
        bio: body.bio,
        coursesTeaching: body.coursesTeaching.map(course => ({ courseNo: getClassID(course), rating: 5 })),
        googleID,
        email: extra.email
    }
}


module.exports = router;