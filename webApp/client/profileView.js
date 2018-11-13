let form = document.getElementById('profileForm');
// eslint-disable-next-line no-undef
let classSelect = ClassSelect;
let oldProf = formDataToObj(new FormData(form));
form.addEventListener('submit', evt => {
    evt.preventDefault();

    let newProf = diffProf(formDataToObj(new FormData(form)));
    console.log(newProf);
    // sendUpdate(newProf);
});

function sendUpdate (formData) {
    fetch('/profile/updateProfile', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'Content-type': 'application/json'
            }
        })
        .then(res => {
            if (res.ok) {
                window.location.href = res.url;
            } else {
                throw new Error(res.statusText);
            }
        })
        .catch(err => {
            console.log(err);
        });
}

function diffProf (updatedProf) {
    let newProf = {};
    for (const key in updatedProf) {
        const newVal = updatedProf[key];
        const oldVal = oldProf[key];
        if(oldVal !== newVal){
            newProf[key] = newVal;
        }
    }
    return newProf;
}

function formDataToObj (formData) {
    let updatedProf = {};
    let courses = classSelect.getCourses();
    for (const data of formData.entries()) {
        if (data[0] != 'query') {
            updatedProf[data[0]] = data[1];
        }
    }
    updatedProf.coursesTeaching = courses;
    return updatedProf;
}