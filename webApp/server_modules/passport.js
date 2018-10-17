const passport = require('passport');
const googleAuth = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const router = require('express').Router();

let sess = {
    name: 'sessID',
    secret: process.env.SECRET,
    saveUninitialized: false,
    resave: false,
    unset: 'destroy',
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 1000,
        // sameSite: true

    }
}


module.exports = function (app) {


    app.use(session(sess));
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use('googleHave', new googleAuth({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_HAVEP_CALLBACK
    }, function (accessToken, refreshToken, profile, cb) {
        // console.log(`${accessToken}, ${refreshToken}, ${profile} `);
        //Look for user in DB else redirect to sign up 
        let googProfile = { acctID: profile.id, name: profile.name, email: emails.value }
        //  console.log(profile);
        return cb(null, googProfile);
    }));

    passport.use('googleSignUp', new googleAuth({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CREATEP_CALLBACK
    }, function (accessToken, refreshToken, profile, cb) {
        let googProfile = { acctID: profile.id, name: profile.name, email: emails.value }
        //add user to DB
        return cb(null, googProfile);
    }));

    passport.serializeUser(function (googProfile, cb) {
        console.log('serializing');

        return cb(null, googProfile);
    });

    passport.deserializeUser(function (googProfile, cb) {
        //search database for user
        console.log('deserializing');

        return cb(null, googProfile);
    });


    router.get('/signup', passport.authenticate('googleSignUp', { failureRedirect: '/signup' }),
        function (req, res) {
            console.log(req.user);
            req.session.save(() => res.redirect('/signup/createprofile'));
        });

    router.get('/login', function (req, res) {
        return res.redirect('/profile');
    });

    return router;
}


