const express = require('express');
const app = express();
const path = require('path');

const passport = require('./server_modules/passport');
const profileRoute = require('./server_modules/routes/profile');
const searchRoute = require('./server_modules/routes/searchRoute');
const bodyParser = require('body-parser');
const classSearch = require('./server_modules/routes/classSearch');
const io = require('./server_modules/socket.js')(server, sessionMid);

// Includes a bodyParser to parse JSON files
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Links all resources to 'client' folder
app.use(express.static('client'));
let { sessionMid, router: passportRouter } = passport(app);


// Includes all routes
app.use('/classSearch', classSearch);
app.use('/google', passportRouter);
app.use('/profile', profileRoute);
app.use('/searchRoute', searchRoute);

// Establishes EJS view engine in 'views' folder
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// Establish home page
app.get('/', function(req, res) {
    console.log(req.session);
    let input = {
        loggedIn: req.isAuthenticated() && req.user.extra === undefined,
    };
    if (req.session.deleted) {
        input['deleted'] = req.session.deleted;
        req.session.deleted = null;
    }
    res.render('search', input);
});

// Error route for non-existant routes
app.use((req, res, next) => {
    if (!req.route) {
        return next(new Error(`No route ${req.originalUrl}`));
    }
    next();
});

// Error route for run-time errors
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
    console.log(error);
    res.render('error', { err: error.message });
});

// Sets up port connection
const PORT = process.env.PORT || 5000;
let server = app.listen(PORT, function() {
    console.log(`Server started on Port ${PORT}`);
});
