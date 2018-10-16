const passport = require('passport');
const googleAuth = require('passport-google-oauth20').Strategy;
const session = require('express-session');

let sess = {
    secret: process.env.SECRET,
    saveUninitialized: false,
    resave: false,
    unset: 'destroy',
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60,
        sameSite: true

    }
}


module.exports = function (app) {


    app.use(session(sess));
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new googleAuth({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK
    }, function (accessToken, refreshToken, profile, cb) {
        // console.log(`${accessToken}, ${refreshToken}, ${profile} `);
        //look if account alread exists else have them create one
        let googProfile = {acctID: profile.id,name: profile.name}
         console.log(profile);
        return cb(null, googProfile);
    }));

    passport.serializeUser(function (userID, cb) {
        cb(null, userID);
    });

    passport.deserializeUser(function (userID, cb) {
        //search database for user
        cb(null, userID);
    });

}


