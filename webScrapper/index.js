const cheerio = require('cheerio');
const request = require('request-promise');
const fs = require('fs');

var options = {
    uri: 'https://admissions.sa.ucsc.edu/majors/',
    transform: function (body) {
        return cheerio.load(body);
    }
}

request(options)
    .then(function ($) {
        let majorHTML = $('#subNav > ul li > ul').children().toArray().map(function (x) {
            return $(x).text().replace('*', '');
        });
        let majors = JSON.stringify(majorHTML);
        fs.writeFile('ucsc-majors.json', majors, function (err) {
            if (err) throw err;
            console.log(`Obtained all ${majorHTML.length} majors!`);
        })
    })
    .catch(function (err) {
        console.log(err);
    });
