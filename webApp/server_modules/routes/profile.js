const passport = require('passport');
const router = require('express').Router();
const {
    validateForm
} = require('../validator');
const {
    getMajors,
    getClassID,
    getClassName
} = require('../course_json_parser');
const {
    addUser,
    updateUser,
    deleteUser
} = require('../mongoose');

/**
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {*} next 
 */

// A route that renders the user's profile
router.get('/', function(req, res) {
    // console.log(req.session);
    console.log('profile ' + req.isAuthenticated());
    if (!req.isAuthenticated()) {
        return res.redirect('/profile/login')
    }
    console.log(req.user);
    let courseNames = req.user.coursesTeaching.map(course => ({
        courseName: getClassName(course._id)
    }));
    res.render('profileView-user', {
        profile: req.user,
        courses: courseNames,
        majors: getMajors()
    });
});


router.get('/login', passport.authenticate('googleHave', {
    scope: ['profile', 'email'],
    hd: 'ucsc.edu'
}));

router.get('/signup', passport.authenticate('googleSignUp', {
    scope: ['profile', 'email'],
    hd: 'ucsc.edu'
}));

router.get('/create', function(req, res) {
    res.render('createAccount', {
        user: req.user,
        majors: getMajors(),
        formTitle: 'Profile Information'
    });
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});


router.post('/createProfile', function(req, res) {
    console.log('CREATED A PROFILE');
    let profile = newProfile(req.body, req.user.id, req.user.extra);
    addUser(profile)
        .then(profile => {
            req.login({
                id: profile.googleID
            }, err => {
                if (err) return res.redirect('/');
                res.redirect('/profile');
            });
        })
        //TODO: SEND ERR BACK AND REDIRECT CLIENT
        .catch(err => console.log(err))
});

//Untested
router.get('/review', function(req, res) {
    console.log('REVIEWING A CLASS');
    res.render('review', {
        profile: req.user,
        class: req.body
    });
});

//Untested
router.post('/submitReview', function(req, res) {
    console.log('SUBMITTING A REVIEW');
    var avg = sum(...req.body) / 4.0;
    console.log(avg);

    addReview(req.user.id, avg)
        .then(res.redirect('profileView-guest', {
            profile: req.user
        }));
});

//Untested
router.post('/updateProfile', function(req, res) {
    console.log('UPDATED A PROFILE');


    updateUser(updatedProfile)
        .then(res.redirect('/profile'));
});

//Untested
router.get('/deleteProfile', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/profile/login');
    }
    deleteUser(req.user.id)
        .then(() => {
            res.redirect('/');
        })
        .catch(() => {
            res.redirect('/');
        })
})


function newProfile (body, googleID, extra) {
    return {
        firstName: body.firstName,
        lastName: body.lastName,
        year: body.year,
        college: body.college,
        major: body.major,
        bio: body.bio,
        coursesTeaching: body.coursesTeaching.map(course => ({
            courseNo: getClassID(course),
            rating: 5
        })),
        googleID,
        email: extra.email
    }
}


module.exports = router;