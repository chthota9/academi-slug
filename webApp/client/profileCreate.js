let form = document.querySelector('#profileForm');
// eslint-disable-next-line no-undef
let classSelect = ClassSelect;

form.addEventListener('submit', evt => {
    evt.preventDefault();

    let formData = new FormData(evt.currentTarget);
    formData.delete('query');
    let acctData = {};
    for (const data of formData.entries()) {
        acctData[data[0]] = data[1];
    }
    acctData.coursesTeaching = classSelect.getCourses();
    subForm(JSON.stringify(acctData));
});

form.addEventListener('keydown',function (evt) {
    var key = evt.key || evt.keyCode;
    if(key === 'Enter'){
        evt.preventDefault();
    }
});

function subForm (data) {
    let formReq = new XMLHttpRequest();
    formReq.addEventListener('load', () => {
        location.href = formReq.responseURL;
    });
    formReq.open('POST', '/profile/createProfile');
    formReq.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
    formReq.send(data);
}