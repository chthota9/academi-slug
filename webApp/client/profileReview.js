let categories = document.getElementsByClassName('rating'); //get all categories
let reviewForm = document.querySelector('#reviewForm'); //get form
let finalRating = {}; //the final ratings that will be sent to the server on submit

//sets up the radios to do something when they are clicked/changed
for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    let categoryName = category.id;
    let radios = category.children; // get all radios under category
    for (let j = 0; j < radios.length; j++) {
        const radio = radios[j];
        radio.addEventListener('change', function(evt) {
            //on radio click appy rating to category
            finalRating[categoryName] = Number.parseInt(this.value);
            console.log(`${categoryName} = ${this.value}`);
        });
    }
}

reviewForm.addEventListener('submit', evt => {
    evt.preventDefault();
    let pathArray = window.location.pathname.split('/');
    let userID = parseInt(pathArray[3]);
    let classID = parseInt(pathArray[5]);

    let formReq = new XMLHttpRequest();
    formReq.open('POST', '/profile/user/' + userID + '/review/' + classID + '/sub');
    formReq.setRequestHeader('Content-Type', 'application/json');
    formReq.send(JSON.stringify(finalRating));
});