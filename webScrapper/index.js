const cheerio = require('cheerio');
const request = require('request-promise');
const fs = require('fs');



let optionMajors = {
    uri: 'https://admissions.sa.ucsc.edu/majors/',
    transform: function (body) {
        return cheerio.load(body);
    }
}

let optionCourses = {
    uri: 'https://pisa.ucsc.edu/class_search/index.php',
    method: 'POST',
    formData: {
        'action': 'results',
        'binds[:term]': 2188,
        'binds[:reg_status]': 'all',
        'binds[:subject]': '',
        'binds[:catalog_nbr_op]': '=',
        'binds[:catalog_nbr]': '',
        'binds[:title]': '',
        'binds[:instr_name_op]': '=',
        'binds[:instructor]': '',
        'binds[:ge]': '',
        'binds[:crse_units_op]': '=',
        'binds[:crse_units_from]': '',
        'binds[:crse_units_to]': '',
        'binds[:crse_units_exact]': '',
        'binds[:days]': '',
        'binds[:times]': '',
        'binds[:acad_career]': '',
        'rec_start': 0,
        'rec_dur': 30000
    },
    transform: function (body) {
        return cheerio.load(body);
    }
}


function parseHTMLCourses($) {
    return new Promise(function (resolve, reject) {
        process.nextTick(function () {
            let classArray = $('.panel-body').find("[id^='class_id_']").toArray();
            if (classArray.length < 1) {
                return reject('Did not obtain any courses from UCSC website');
            }
            let ucscClasses = classArray.reduce((classes, el) => {
                let classID = $(el).attr('id').replace('class_id_', '');
                if (classes.hasOwnProperty(classID)) {
                    return classes;
                }
                let className = $(el).text().split(' - ');
                classes[className[0]] = Number.parseInt(classID);
                return classes;
            }, {});

            return resolve(JSON.stringify(ucscClasses));
        })
    })
}

function parseHTMLMajors($) {
    return new Promise((resolve, reject) => {
        process.nextTick(() => {
            let majorHTML = $('#subNav > ul li > ul').children().toArray().map((x) => {
                return $(x).text().replace('*', '');
            });
            return resolve(JSON.stringify(majorHTML))
        })
    })
}

function requestMajors() {
    request(optionMajors)
        .then($ => parseHTMLMajors($))
        .then(majors => {
            return fs.writeFile('ucsc-majors.json', majors, err => {
                if (err) { throw err }
                console.log(`Got all ${majors.length} majors at UCSC!`);
            })
        })
        .catch(err => { throw (err) });
}





function requestCourses() {
    request(optionCourses)
        .then(($) => parseHTMLCourses($))
        .then(classes =>
            new Promise((resolve, reject) => {
                fs.writeFile('ucsc-courses.json', classes, err => {
                    if (err) { return reject(err) }
                    console.log(`Got all ${classes.length} courses at UCSC!`);
                    resolve();
                })
            })
        )
        .catch(err => { throw err });
}

function requesting() {
    let args = process.argv.splice(2);
    if (args.length < 1) {
        console.log('Enter what you would like to request');
        console.log('majors, courses , or both');
    }
    
}

requesting();