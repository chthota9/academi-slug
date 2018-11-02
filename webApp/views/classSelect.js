let list = document.querySelector('.classlist');
let inputNode = list.querySelector('.classinput');
let chosenClasses = Array.from(list.getElementsByClassName('classname'), el => {
    el.addEventListener('click', deleteClass);
    return el;
});
let inputTimer;
let inputTimeout = 1000;
let inputBox = inputNode.children[0];
let infoNode = inputNode.children[1];
let courseList;




function setInfoHelp () {
    infoNode.classList.remove('loader');
    infoNode.classList.add('helper');
}

function showInfo () {
    infoNode.classList.remove('hidden');
}

function hideInfo () {
    infoNode.classList.add('hidden');
}

function setInfoLoad () {
    infoNode.classList.remove('helper');
    infoNode.classList.add('loader');
}

function removeCourseList () {
    if (courseList && inputNode.contains(courseList)) {
        inputNode.removeChild(courseList);
    } else {
        courseList = null;
    }
}

function sendClassQuery (param) {
    let req = new XMLHttpRequest();
    // req.setRequestHeader('Content-type',"application/x-www-form-urlencoded");
    req.open('GET', `/classSearch/?q=${param}`);
    req.addEventListener('loadend', evt => {
        if (req.status === 404) {
            hideInfo();
            console.log(req.responseText + '404');
            let classes = ['CMPS 115', 'CMPS 112', 'CMPS 101', 'CMPS 200', 'CMPE 150'];
            createList(classes);
            return;
        }
        hideInfo();
        console.log(req.responseText);
        console.log(document.activeElement);

        let results = JSON.parse(req.responseText);

        createList(results);

        //display list
    });
    req.addEventListener('error', evt => {
        console.log(req.responseText + 'err');
        infoNode.classList.add('helper');
    });
    req.send(null);
}

inputBox.addEventListener('input', evt => {
    let param = evt.currentTarget.value;
    clearTimeout(inputTimer);
    removeCourseList();
    showInfo();
    if (param.length > 0) {
        setInfoLoad();
        inputTimer = setTimeout(() => sendClassQuery(param), inputTimeout);
    } else {
        setInfoHelp();
    }
})

/**
 * @param {Array} courses 
 */
function createList (courses) {
    console.log('creatingLIST');
    let listNode = document.createElement('ul');
    listNode.classList.add('querylist');
    courseList = listNode;
    courses.forEach(course => {
        let newClassNode = document.createElement('li');
        newClassNode.textContent = course;
        newClassNode.onmousedown = (evt) => addClass(evt.target);
        listNode.appendChild(newClassNode);
    });

    if (courseList == listNode) {
        inputNode.appendChild(listNode);
    }
}


/**
 * 
 * @param {MouseEvent} evt 
 */
function deleteClass (evt) {
    let classRemoved;

    if (evt === undefined) {
        if (chosenClasses.length > 0) {
            classRemoved = chosenClasses.pop();
            console.log(classRemoved);
            list.removeChild(classRemoved)
        }
    } else {
        classRemoved = evt.currentTarget;
        chosenClasses = chosenClasses.filter((el, index, elements) => {
            return el !== classRemoved;
        });
        list.removeChild(classRemoved)
    }
}

function addClass (chosenClass) {
    if (chosenClasses.length < 10) {
        let newClass = document.createElement('li');
        newClass.textContent = chosenClass.textContent;
        newClass.classList.add('classname');
        list.insertBefore(newClass, inputNode);
        chosenClasses.push(newClass)
    }
}
inputBox.addEventListener('focus', evt => {
    showInfo();

})
inputBox.addEventListener('blur', evt => {

    hideInfo();
    setInfoHelp();
    removeCourseList();
    evt.currentTarget.value = '';
})
inputBox.addEventListener('keydown', evt => {
    let key = evt.key || evt.keyCode;
    if (evt.target.value.length === 0) {
        if (key === 'Backspace' || key === 'Delete' || key === 46 || key === 8) {
            deleteClass();
        }
    }
})


let form = document.querySelector('form');
let subBtn = form.querySelector('button[type="submit"]');
form.addEventListener('submit', evt => {
    evt.preventDefault();

    let formData = new FormData(evt.currentTarget);
    chosenClasses.forEach(course => {
        formData.append('classesTeaching', course.textContent)
    });
    // for (const course of formData.entries()) {
    //     console.log(course[0] + ',' + course[1]);

    // }

    subForm(formData);
})

function subForm (form) {
    let formReq = new XMLHttpRequest();
    formReq.open('POST', '/profile/createProfile');
    formReq.send(form);
}