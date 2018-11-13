const passport = require('passport');
const router = require('express').Router();
const { validateForm } = require('../validator');
const { getMajors, getClassID, getClassName } = require('../course_json_parser');
const { addUser, updateUser, deleteUser, findUser } = require('../mongoose');

/**
 * A route used when a user accesses their profile
 */
router.get('/', function(req, res) {
    // console.log(req.session);
    console.log('profile ' + req.isAuthenticated());

    // Asks user to login if they are not registered
    if (!req.isAuthenticated()) {
        return res.redirect('/profile/login');
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

router.get('/user/:id', (req, res) => {
    let googleID = req.params.id;
    findUser(googleID)
        .then(prof => {
            
        });
    res.send(req.params.id);
});
// A route used when a user wants to log in
router.get('/login', passport.authenticate('googleHave', {
    scope: ['profile', 'email'],
    hd: 'ucsc.edu'
}));

// A route used when a user wants to sign up via Google authentication
router.get('/signup', passport.authenticate('googleSignUp', {
    scope: ['profile', 'email'],
    hd: 'ucsc.edu'
}));

// A route used when a user creates and account
router.get('/create', function(req, res) {
    res.render('createAccount', {
        user: req.user,
        majors: getMajors(),
        formTitle: 'Profile Information'
    });
});

// A route used when a user logs out
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});


// A route that will actually create a user's account within the database
router.post('/createProfile', function(req, res) {
    console.log('CREATED A PROFILE');

    let profile = newProfile(req.body, req.user.id, req.user.extra);

    addUser(profile)
        .then(profile => {
            req.login({ id: profile.googleID }, err => {
                if (err) return res.redirect('/');
                res.redirect('/profile');
            });
        })
        //TODO: SEND ERR BACK AND REDIRECT CLIENT
        .catch(err => console.log(err));
});

// A route used when a user wants to submit a review for a class
//Untested
router.get('/review', function(req, res) {
    console.log('REVIEWING A CLASS');
    res.render('review', { profile: req.user, class: req.body });
});

// A route used to actually submit a review to the database
//Untested
router.post('/submitReview', function(req, res) {
    console.log('SUBMITTING A REVIEW');
    var avg = sum(...req.body) / 4.0;
    console.log(avg);
});

// A route used when a user wants to update their profile
//Untested
router.post('/updateProfile', function(req, res) {
    console.log('UPDATED A PROFILE');
    console.log(req.body);
    res.redirect('back');
});

// A route used when a user wants to delete their profile
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
            throw new Error('There was a problem with deleting the acct.');
        });
});

//Tester route
router.get('/userProfile', (req, res) => {
    var testUser = { googleID: 24245, email: 'sammyslub@ucsc.edu', name: { first: 'Sammy', last: 'Slug' }, year: 'Junior', college: 'College Nine', major: 'CS', bio: 'Banana Slug', coursesTeaching: [{ _id: 420, rating: 4 }, { _id: 567, rating: 2 }], linkedIn: 'https://www.linkedin.com/in/rybojad/' };
    res.render('profileView-guest', {profile: testUser });
});


function newProfile (body, googleID, extra) {
    return {
        firstName: body.firstName,
        lastName: body.lastName,
        year: body.year,
        college: body.college,
        major: body.major,
        bio: body.bio,
        linkedIn: body.linkedIn,
        coursesTeaching: body.coursesTeaching.map(course => ({ courseNo: getClassID(course), rating: 5 })),
        googleID,
        email: extra.email
    };
}

module.exports = router;