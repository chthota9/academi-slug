const passport = require('passport');
const googleAuth = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const router = require('express').Router();
const { connection, findUser } = require('./mongoose');
const mongoStore = require('connect-mongo')(session);

let sessionAge = 60 * 60 * 1000; //1 hour = mins * secs * ms

let sess = {
    name: 'SID',
    secret: process.env.SECRET,
    saveUninitialized: false,
    resave: false,
    unset: 'destroy',
    cookie: {
        secure: false,
        maxAge: sessionAge,
        sameSite: false
    }
};

if (process.env.NODE_ENV === 'production') {
    sess.store = new mongoStore({
        mongooseConnection: connection,
        ttl: sessionAge
    });
}

module.exports = function(app) {
    let sessionMid = session(sess);
    app.use(sessionMid);
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use('googleHave', new googleAuth({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_HAVEP_CALLBACK
    }, function(accessToken, refreshToken, profile, cb) {
        let googID = Number.parseInt(profile.id);
        findUser(googID)
            .then(prof => {
                if (prof) {
                    let sessData = { id: prof.googleID };
                    cb(null, sessData);
                } else {
                    cb(null, false);
                }
            });
    }));

    passport.use('googleSignUp', new googleAuth({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CREATEP_CALLBACK
    }, function(accessToken, refreshToken, profile, cb) {
        let googID = Number.parseInt(profile.id);
        findUser(googID)
            .then(prof => {
                if (prof) {
                    cb(null, false);
                } else {
                    let sessData = {
                        id: Number.parseInt(profile.id),
                        extra: {
                            firstName: profile.name.givenName,
                            lastName: profile.name.familyName,
                            email: profile.emails[0].value
                        }
                    };
                    cb(null, sessData);
                }
            });
    }));

    passport.serializeUser((sessData, cb) => {
        return cb(null, sessData);
    });

    passport.deserializeUser((sessData, cb) => {
        if (sessData.extra != undefined) {
            cb(null, sessData);
        } else {
            findUser(sessData.id)
                .then(user => cb(null, user));
        }
    });


    router.get('/signup', passport.authenticate('googleSignUp', { failureRedirect: '/profile/login' }),
        function(req, res) {
            req.session.save(() => res.redirect('/profile/create'));
        });

    router.get('/login', passport.authenticate('googleHave', { failureRedirect: '/profile/signup' }),
        function(req, res) {
            req.session.save(() => res.redirect('/'));
        });

    return { sessionMid, router };
};