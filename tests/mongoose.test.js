const expect = require('expect');
const data = require('../webApp/server_modules/mongoose');


describe('addUser', () => {
    it('resolves', (done) => {
        data.addUser((result) => {
            expect(result).toInclude({
                googleID: '4321',
                email: 'sammyslub@ucsc.edu',
                firstName: 'Sammy',
                lastName: 'Slug'
            }).finally(done);
        });
    });
});

    
