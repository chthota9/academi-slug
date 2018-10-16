const passport = require('passport');
const router = require('express').Router();

/**
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {*} next 
 */





router.get('/login', passport.authenticate('googleHave', { scope: ['profile'], hd: 'ucsc.edu' }));


router.get('/', function (req, res) {
    // console.log(req.session);
    console.log(req.isAuthenticated());
    // if (!req.isAuthenticated()) { return res.redirect('profile/login') }
    // console.log('profile');

    console.log(req.user);

    res.render('logout');
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
})

module.exports = router;