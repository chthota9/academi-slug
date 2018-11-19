const passport = require('passport');
const router = require('express').Router();
const { validateForm } = require('../validator');
const { getMajors, getClassID, getClassName } = require('../course_json_parser');
const { addUser, updateUser, deleteUser, findUser, addReview } = require('../mongoose');

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

// A route used to access a user's profile
// Tested
// eslint-disable-next-line no-useless-escape
router.get('/user/:id(\\d+)', (req, res) => {
    let googleID = req.params.id;
    findUser(googleID)
        .then(prof => {
            if (!prof) {
                throw new Error('No such Profile!');
            }
            let courses = prof.coursesTeaching.map(course => ({
                _id: course._id,
                courseName: getClassName(course._id),
                rating: course.rating
            }));
            res.render('profileView-guest', { profile: prof, courses });
        }).catch((err) => {
            throw err;
        });
});

router.get('/user/:id(\\d+)/review', (req, res) => {
    findUser(req.params.id)
        .then(prof => {
            res.render('review', { profile: prof, className: 'CMPS115' });
        });
});

// // A route that accesses a user's review page for a particular class.
// // Tested - works
router.get('/user/:id(\\d+)/review/:course(\\d+)', (req, res) => {
    let googleID = req.params.id;
    let classID = req.params.course;
    findUser(googleID)
        .then(prof => {
            if (!prof) {
                throw new Error('No such Profile!');
            }

            let className = getClassName(classID);
            res.render('review', { profile: prof, classID, className });
        }).catch((err) => {
            throw err;
        });
});

// Probably not right
router.post('/user/:id(\\d+)/review/:course(\\d+)/sub', (req, res) => {
    var thisRating, prevCount;
    let googleID = req.params.id;
    let classID = req.params.course;
    let reviews = req.body; // will contain an object with each reviewed category the object 
                            // the object's fields will depend on how its sent from the client
    console.log(JSON.stringify(req.body));
    let thisUser = findUser(googleID);

    // Loop through array of coursesTeaching to find rating for the specific course
    console.log("We are here!");
    for (var i = 0; i < thisUser.coursesTeaching.length; i++) {
        if (thisUser.coursesTeaching[i]._id == classID) {
            thisRating = thisUser.coursesTeaching[i].rating;
            prevCount = thisUser.coursesTeaching[i].reviewCount;
        }
    }

    let newRating = 4; //not done yet - get new value of all reviews
    let newValue = (newRating+thisRating)/(prevCount+1);

    addReview(googleID, classID, newValue);
    // Increase review count

    res.render('search');
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

// A route used when a user wants to update their profile
//Untested
router.post('/updateProfile', function(req, res) {
    console.log('UPDATED A PROFILE');
  
        console.log(req.body);
    updateUser(req.user.id, req.body)
        .then(profile => {
            req.login({ id: profile.googleID }, err => {
                if (err) return res.redirect('/');
                res.redirect('back');
            });
        })
        //TODO: SEND ERR BACK AND REDIRECT CLIENT
        .catch(err => console.log(err));
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