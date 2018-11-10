const express = require('express');
const app = express();
const path = require('path');

const passport = require('./server_modules/passport');
const profileRoute = require('./server_modules/routes/profile');
const searchRoute = require('./server_modules/routes/searchRoute');
const bodyParser = require('body-parser');
const classSearch = require('./server_modules/routes/classSearch');

// Includes a bodyParser to parse JSON files
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Links all resources to 'client' folder
app.use(express.static('client'));

// Includes all routes
app.use('/google', passport(app));
app.use('/profile', profileRoute);
app.use('/searchRoute', searchRoute);
app.use('/classSearch', classSearch);

// Establishes EJS view engine in 'views' folder
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// Establish home page
app.get('/', function(req, res) {
    console.log(req.session);

    let loggedIn = req.isAuthenticated() && req.user.extra === undefined;

    res.render('search', {
        loggedIn: loggedIn
    });
});

//Error route for non-existant path
app.get('*', (req, res) => {
    res.render('error');
});

app.use((err, req, res) => {
    console.log(err);
    res.redirect('/');
});

// Sets up port connection
const PORT = process.env.PORT || 5000;
app.listen(PORT, function() {
    console.log(`Server started on Port ${PORT}`);
});