let form = document.getElementById('profileForm');
// eslint-disable-next-line no-undef
let classSelect = ClassSelect;

form.addEventListener('submit', evt => {
    evt.preventDefault();
    let updatedProf = {};
    let formData = new FormData(form);
    let courses = classSelect.getCourses();
    for (const data of formData.entries()) {
        if (data[0] != 'query') {
            updatedProf[data[0]] = data[1];
        }
    }
    updatedProf.coursesTeaching = courses;
    console.log(JSON.stringify(updatedProf, null, 3));

    sendUpdate(updatedProf);
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