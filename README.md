## Academi-Slug: UCSC's Premier Tutoring Platform




#### Description: 
Need personal, quality tutoring assitance? Academi-Slug is the premier tutoring platform of UC Santa Cruz. Users can sign up and search for all tutors available for a particular class. After selecting a tutor based on their experience and qualifications, potential tutees can then communicate with their tutors to establish a meeting time/location. Simple and easy-to-use, Academi-Slug is your one-stop-shop for all your assistive-learning needs.

---

#### Documentation:
- Link to our [Release Plan](Documents/Release%20Plan.pdf)
- Link to our first [Sprint Plan](Documents/Sprint%201%20Plan.pdf)
- Link to our first Sprint Report (TBA)
- Link to our second Sprint Plan (TBA)
- Link to our second Sprint Report (TBA)
- Link to our third Sprint Plan (TBA)
- Link to our third Sprint Report (TBA)
- Link to our fourth Sprint Plan (TBA)
- Link to our fourth Sprint Report (TBA)
- Link to our [Scrum Board](https://trello.com/b/3utiz3Fv/scrum-board)

---

##### Online Website https://academi-slug.herokuapp.com/

#### Installation Guide:
- Install [Node.js](https://nodejs.org/en/)
##### To Start Server:
- `cd` into `\webApp\` directory
- In `\webApp\` directory
   1. Check if Node is installed by typing `node -v` this should print Node's version number. It should be v8.x.x.
   2. Check if NPM is installed by typing `npm -v` this should print the NPM's version number. It should be 5.x.x.
   3. To get all dependencies and type 
   		- If on a mac or linux `sudo npm install` then `sudo npm install pm2 -g` 
	 	- If on windows `npm install` then `npm install pm2 -g`
   4. Use `pm2 start` to start server.
      - To connect to server type `localhost:5000` into a web browser.
      - To end the server type `pm2 kill`
      - In `\webApp\` directory
##### To Start Web Scrapper (Use sparingly):
- `cd` into `\webScrapper\` directory
   1. Check if Node is installed by typing `node -v` this should print Node's version number. It should be v8.x.x.
   2. Check if NPM is installed by typing `npm -v` this should print the NPM's version number. It should be 5.x.x.
   3. To get all dependencies and type 
   		- If on a mac or linux `sudo npm install` 
	 	- If on windows `npm install`
   4. Type `node index.js`


### Server Routes
- These routes would be placed in `href=""` Example: `href="login.html"` -> `href="/profile/login"` 
 - `/profile/` to view profile
 - `/profile/signip` to direct client to sign up page
 - `/profile/login` to direct the client to login page
 - `/profile/logout` to logout client
 - `/` for home route

### Mongoose user schema:
	googleID: 123456789,
	email: "samslug@ucsc.edu,	
	name: {firstName: "Sammy", lastName: "Slug"},
	year: "Senior",
	college: "Oakes",
	major: "Computer Science",
	bio: {"Im a slug."},
	coursesTeachable: ["CMPS 115", "CMPS 112", "CMPE 150", "CMPS 121"]
