let form = document.getElementById('profileForm');
let alertBox = document.getElementById('alert');
let subBtn = document.querySelector('button[form="profileForm"]');
let alertTimer;
// eslint-disable-next-line no-undef
let classSelect = ClassSelect;
let oldProf = formDataToObj(new FormData(form));

form.addEventListener('submit', evt => {
    evt.preventDefault();
    let newProf = diffProf(formDataToObj(new FormData(form)));
    if (Object.keys(newProf).length > 0) {
        sendUpdate(newProf);
    }
});

form.addEventListener('keydown',function (evt) {
    var key = evt.key || evt.keyCode;
    if(key === 'Enter'){
        evt.preventDefault();
    }
});

function sendUpdate (formData) {
    subBtn.disabled = true;
    fetch('/profile/updateProfile', {
            method: 'POST',
            mode: 'same-origin',
            body: JSON.stringify(formData),
            headers: {
                'Content-type': 'application/json'
            }
        })
        .then(res => {
            if (res.ok) {
                return res.text();
            } else {
                throw new Error(res.statusText);
            }
        })
        .then(data => {
            let res = JSON.parse(data);
            if (res.sucessful) {
                alertBox.children[0].textContent = 'Updated profile successful';
                oldProf = formDataToObj(new FormData(form));
            } else {
                alertBox.children[0].textContent = 'Something went wrong with the update';
            }
            alertBox.classList.remove('hidden');
            subBtn.disabled = false;
            if (alertTimer) {
                clearTimeout(alertTimer);
            }
            alertTimer = setTimeout(() => alertBox.classList.add('hidden'), 1000);
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
        if (newVal.constructor === Array) {
            let updatedCourses = compareCourses(oldVal, newVal);
            if (updatedCourses.length > 0) {
                newProf[key] = updatedCourses;
            }
        } else {
            if (oldVal !== newVal) {
                newProf[key] = newVal;
            }
        }
    }
    return newProf;
}

/**
 * @param {Array} oldVal 
 * @param {Array} newVal 
 */
function compareCourses (oldVal, newVal) {
    //see if theres new courses compared to old
    //see if any of the old courses were removed
    let courses;
    courses = newVal.filter(el => oldVal.indexOf(el) < 0);
    oldVal.forEach(el => {
        if (!newVal.includes(el)) {
            courses.push('-' + el);
        }
    });
    return courses;
}

function formDataToObj (formData) {
    let prof = {};
    let courses = classSelect.getCourses();
    for (const data of formData.entries()) {
        if (data[0] != 'query') {
            prof[data[0]] = data[1];
        }
    }
    prof.coursesTeaching = courses;
    return prof;
}