let categories = document.getElementsByClassName('rating'); //get all categories
let reviewForm = document.querySelector('#reviewForm'); //get form
let finalRating = {}; //the final ratings that will be sent to the server on submit
reviewForm.addEventListener('submit', evt => {
    evt.preventDefault();
    console.log('submiting final ratings!');
    //figure out how to send an object to the server
    //by using fetch API or the xmlhttprequest API
});



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