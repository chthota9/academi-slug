const {
    checkSchema
} = require('express-validator/check');
const years = ['freshmen', 'sophmore', 'junior', 'senior'];
const colleges = ['Oakes', 'Cowell', 'Stevenson', 'Crown', 'Merril', 'Porter',
    'Kresge', 'Rachel Carson', 'College Nine', 'College Ten'
];

let checkScheme = checkSchema({
    googleID: { in: ['body'],
        isInt: true,
        toInt: true,
    },
    email: { in: ['body'],
        escape: true,
        isEmail: true,
        normalizeEmail: true,
    },
    'firstName': { in: ['body'],
        trim: true
    },
    'lastName': { in: ['body'],
        trim: true
    },
    year: { in: ['body'],
        trim: true,
        custom: {
            options: (value, {
                req,
                location,
                path
            }) => {
                let aYear = years.includes(value);
                if (aYear) {
                    return Promise.resolve();
                }
                return Promise.reject();
            }
        }
    },
    college: { in: ['body'],
        escape: true,
        isAlpha: true,
        trim: true,
        custom: {
            options: (value, {
                req,
                location,
                path
            }) => {
                if (colleges.includes(value)) {
                    return Promise.resolve();
                }
                return Promise.reject();
            }
        }
    },
    major: { in: ['body'],
        escape: true,
        isAlpha: true,
        trim: true
    },
    bio: { in: ['body'],
        escape: true,
        trim: true
    },
    coursesTaught: { in: ['body'],
    }


})

module.exports.validateForm = checkScheme;