const passport = require('passport');
const router = require('express').Router();

/**
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {*} next 
 */





router.get('/login', passport.authenticate('google', { scope: ['profile'], hd: 'ucsc.edu' }));

router.get('/cb',
    passport.authenticate('google', { failureRedirect: '/profile/login' }),
    function (req, res) {
        res.redirect('/');
    })


router.get('/', function (req, res) {
    console.log(req.session);
    console.log(req.isAuthenticated());
    if (!req.isAuthenticated()) { res.redirect('profile/login') }
    // console.log('profile');

    // console.log(req.user);

    res.render('logout');
})

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
})

module.exports = router;