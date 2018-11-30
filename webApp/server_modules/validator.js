const { checkSchema } = require('express-validator/check');
const years = ['freshmen', 'sophmore', 'junior', 'senior'];
const { getClassID, isValidCourse } = require('./course_json_parser');
const colleges = ['Oakes', 'Cowell', 'Stevenson', 'Crown', 'Merril', 'Porter',
    'Kresge', 'Rachel Carson', 'College Nine', 'College Ten'];

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
    firstName: { in: ['body'],
        trim: true
    },
    lastName: { in: ['body'],
        trim: true
    },
    year: { in: ['body'],
        trim: true,
        custom: {
            options: (value) => {
                if (!years.includes(value)) {
                    throw new Error('No such year exists');
                }
            }
        }
    },
    college: { in: ['body'],
        escape: true,
        isAlpha: true,
        trim: true,
        custom: {
            options: (value) => {
                if (!colleges.includes(value)) {
                    throw new Error('No such college exists');
                }
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
    'coursesTeaching.*': { in: ['body'],
        optional: true,
        escape: true,
        isAlpha: true,
        custom: {
            options: val => {
                if (!isValidCourse(val)) {
                    return new Error('No such course exists');
                }
            }
        },
        customSanitizer: {
            options: val => {
                return getClassID(val);
            }
        }
    }
});

module.exports.validateForm = checkScheme;