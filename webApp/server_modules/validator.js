const { checkSchema } = require('validator');
let years = ['freshmen', 'sophmore', 'junior', 'senior'];
let colleges = ['Oakes', 'Cowell', 'Stevenson', 'Crown', 'Merril', 'Porter',
    'Kresge', 'Rachel Carson', 'College Nine', 'College Ten'];

let checkScheme = checkSchema({
    googleID: {
        in: ['body'],
        required: true,
        isInt: true,
        toInt: true,
    },
    email: {
        in: ['body'],
        required: true,
        escape: true,
        isEmail: true,
        normalizeEmail: true,
    },
    'name.firstName': {
        in: ['body'],
        required: true,
        trim:true
    },
    'name.lastName': {
        in: ['body'],
        trim:true
    },
    year: {
        in: ['body'],
        trim:true,
        custom: {
            options: (value, { req, location, path }) => {
                let aYear = years.includes(value);
                if (aYear) { return Promise.resolve(); }
                return Promise.reject();
            }
        }
    },
    college: {
        in: ['body'],
        required: true,
        escape: true,
        isAlpha: true,
        trim:true
    },
    major: {
        in: ['body'],
        required: true,
        escape: true,
        isAlpha: true,
        trim:true
    },
    bio: {
        in: ['body'],
        required: true,
        escape: true,
        trim:true
    },
    coursesTaught: {
        in: ['body'],
        required:true
    }


})

module.exports.validateForm = checkScheme;