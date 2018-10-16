const express = require('express');
const app = express();
const path = require('path');
const passport = require('./server_modules/passport');
const profileRoute = require('./server_modules/routes/profile');
const signupRoute = require('./server_modules/routes/signup');
const bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

passport(app);
app.use('/profile', profileRoute);
app.use('/signup', signupRoute);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', function (req, res) {
    // console.log(req.session);
    res.render('search',{loggedIn: req.isAuthenticated()});
});

const PORT = process.env.PORT || 3569;

app.listen(PORT, function () {
    console.log(`Server started on port ${PORT}`);
});