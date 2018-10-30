let list = document.querySelector('.classlist');
let inputNode = list.querySelector('.classinput');
let choosenClasses = Array.from(list.getElementsByClassName('classname'), el => {
    el.addEventListener('click', deleteClass);
    return el;
});

let inputBox = inputNode.children[0];
let queryList = inputNode.children[1];
let helper = queryList.children[0];

let req = new XMLHttpRequest();

function SendQuery(param) {
    // req.setRequestHeader('Content-type',"application/x-www-form-urlencoded");
    console.log(`/classsearch/?q=${param}`);
    req.addEventListener('loadend', ev => {
        console.log(req.responseText);
        //display list
    });
    req.addEventListener('error', evt => {
        console.log(req.responseText);
        // helper.classList.add('helper');

    });
    req.open('GET', `/classSearch/?q=${param}`);
    req.send(null);
}

inputBox.addEventListener('input', evt => {
    let param = evt.currentTarget.value;

    if (param.length > 0) {
        helper.classList.remove('helper');
        SendQuery(param);
    } else {
        helper.classList.add('helper');

    }
})

function CreateList(listOfClasses) {

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
    evt.currentTarget.value = '';
    if (req.readyState === 2) { //if sent
        req.abort();
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