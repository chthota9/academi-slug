let list = document.querySelector('.classlist');
let inputNode = list.querySelector('.classinput');
let choosenClasses = Array.from(list.getElementsByClassName('classname'), el => {
    el.addEventListener('click', deleteClass);
    return el;
});
let inputTimer;
let inputTimeout = 1000;
let inputBox = inputNode.children[0];
let helperList = inputNode.children[1];
let emptyqueryList = queryList.cloneNode(false);
let courseList;
let helper = queryList.children[0];

let req;
function sendQuery(param) {
    req = new XMLHttpRequest();
    // req.setRequestHeader('Content-type',"application/x-www-form-urlencoded");
    console.log(`/classsearch/?q=${param}`);
    req.open('GET', `/classSearch/?q=${param}`);
    req.addEventListener('loadend', ev => {
        if (req.status === 404) {
            helper.classList.add('helper');
            console.log(req.responseText + '404');
            return;
        }
        console.log(req.responseText);
        console.log(document.activeElement);
        
        let results = JSON.parse(req.responseText);

        createList(results);

        //display list
    });
    req.addEventListener('abort',evt =>{
        console.log('aborted!');
        
    })
    req.addEventListener('error', evt => {
        console.log(req.responseText + 'err');
        helper.classList.add('helper');
    });
    req.send(null);
}

inputBox.addEventListener('input', evt => {
    let param = evt.currentTarget.value;
    console.log('called');

    if (param.length > 0) {
        helper.classList.remove('helper');
        clearTimeout(inputTimer);
        inputTimer = setTimeout(() => sendQuery(param), inputTimeout);
    } else {
        helper.classList.add('helper');
        clearList()

    }
})


/**
 * @param {Array} courses 
 */
function createList(courses) {
    console.log('creatingLIST');
    courses.forEach(course => {
        let newClassNode = document.createElement('li');
        newClassNode.textContent = course;
        queryList.appendChild(newClassNode);
    })

}

function clearList() {
    if (queryList.childElementCount > 1) {
        let cleanList = emptyqueryList.cloneNode(true);
        queryList.parentNode.replaceChild(cleanList, queryList);
        queryList = cleanList;
        helper = queryList.children[0];
    }
}

/**
 * 
 * @param {MouseEvent} evt 
 */
function deleteClass(evt) {
    let classRemoved;

    if (evt === undefined) {
        if (choosenClasses.length > 0) {
            classRemoved = choosenClasses.pop();
            console.log(classRemoved);
            list.removeChild(classRemoved)
        }
    } else {
        classRemoved = evt.currentTarget;
        choosenClasses = choosenClasses.filter((el, index, elements) => {
            return el !== classRemoved;
        });
        list.removeChild(classRemoved)
    }
}

function addClass(chosenClass) {
    if (choosenClasses.length < 10) {
        let newClass = document.createElement('li');
        newClass.textContent = chosenClass.name;
        newClass.classList.add('classname');
        newClass.addEventListener('click', deleteClass);
        list.insertBefore(newClass, inputNode);
        choosenClasses.push(newClass)
    }
}
inputBox.addEventListener('focus', evt => {
    queryList.classList.remove('hidden');
})
inputBox.addEventListener('blur', evt => {
    queryList.classList.add('hidden');
    helper.classList.add('helper');
    clearList();
    evt.currentTarget.value = '';
    if(req){
        
    }
})
inputBox.addEventListener('keydown', evt => {
    let key = evt.key || evt.keyCode;

    if (evt.target.value.length === 0) {
        if (key === 'Backspace' || key === 'Delete' || key === 46 || key === 8) {
            deleteClass();
        }

    }

})