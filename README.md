## Academi-Slug: UCSC's Premier Tutoring Platform

---

### Final project documents can be found [here!](https://github.com/tim-nguyen-cs/academi-slug/tree/master/Documents/Final%20Documents)

---

#### Description: 
Need personal, quality tutoring assitance? Academi-Slug is the premier tutoring platform of UC Santa Cruz. Users can sign up and search for all tutors available for a particular class. After selecting a tutor based on their experience and qualifications, potential tutees can then communicate with their tutors to establish a meeting time/location. Simple and easy-to-use, Academi-Slug is your one-stop-shop for all your assistive-learning needs.

---

#### Documentation:
- Link to our [Release Plan](Documents/Release%20Plan.pdf)
- Link to our first [Sprint Plan](Documents/Sprint%201%20Plan.pdf)
- Link to our first [Sprint Report](Documents/Sprint_1_Report.pdf)
- Link to our second [Sprint Plan](Documents/Sprint_2_Plan.pdf)
- Link to our second [Sprint Report](Documents/Sprint_2_Report.pdf)
- Link to our third [Sprint Plan](Documents/Sprint%203%20Plan.pdf)
- Link to our third [Sprint Report](Documents/Sprint_3_Report%20Plan.pdf)
- Link to our fourth [Sprint Plan](Documents/Sprint_4_Plan.pdf)
- Link to our fourth [Sprint Report](Documents/Sprint%204%20PReport.pdf)
- Link to our [Scrum Board](https://trello.com/b/3utiz3Fv/scrum-board)

---

##### Online Website https://academi-slug.herokuapp.com/

---

#### Installation Guide:
- Install [Node.js](https://nodejs.org/en/)

##### To Start Server:
- `cd` into `\webApp\` directory
- In `\webApp\` directory:
   1. Check if Node is installed by typing `node -v` this should print Node's version number. It should be v8.x.x.
   2. Check if NPM is installed by typing `npm -v` this should print the NPM's version number. It should be 5.x.x.
   3. To get all dependencies:
   		- If on a Mac or Linux, type `sudo npm install`, then `sudo npm install pm2 -g` 
	 	- If on Windows, type `npm install`, then `npm install pm2 -g`
   4. Use `npm test` to start server.
      - To connect to the serverm type `localhost:5000` into a web browser.
      - To end the server, use `CTRL/CMD+C`

##### To Start Web Scrapper (Use Sparingly):
- `cd` into `\webScrapper\` directory
   1. Check if Node is installed by typing `node -v` this should print Node's version number. It should be v8.x.x.
   2. Check if NPM is installed by typing `npm -v` this should print the NPM's version number. It should be 5.x.x.
   3. To get all dependencies: 
   		- If on a Mac or Linux, type `sudo npm install` 
	 	- If on Windows, type `npm install`
   4. Type `node index.js`

---
#### Server Routes
- Places routes in `href` attributes to access: 
	- `/` ~ directs user to the homepage
 
	- `/profile/` ~ views a user's profile
	- `/profile/signup` ~ directs a user to sign up with their Google account
	- `/profile/create` ~ allows a user to create an account
	- `/profile/login` ~ allows a user to log in
	- `/profile/logout` ~ allows a user to log out
	- `/profile/user/:id` ~ views another user's profile
	- `profile/user/:id/review/:course` ~ accesses a user's review page for a particular class

	- `/searchRoute/`~ renders the results page of a user's search

	- `/classSearch/` ~ a routes used to search for a class

---
#### Mongoose Schemas

- Sample UserSchema:\
	googleID: 123456789,\
	email: "samslug@ucsc.edu",\
	name: {firstName: "Sammy", lastName: "Slug"},\
	year: "Senior",\
	college: "Oakes",\
	major: "Computer Science",\
	bio: {"I am Sammy, and I take things slow."},\
	coursesTeaching: [{classid:1243,rating:0, reviewCount: 4}, {_id:15435, rating:3,\ reviewCount: 1}, {classid:53453, rating:2, reviewCount: 7}]\

- Sample ClassSchema:\
	courseNo: 21594,\
	tutors: [{3123, 2454, 123456789}]
