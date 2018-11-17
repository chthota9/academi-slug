// eslint-disable-next-line no-unused-vars
var ClassSelect = (function() {
    let list = document.querySelector('.classlist');
    let inputNode = list.querySelector('.classinput');
    let chosenClasses = Array.from(list.getElementsByClassName('classname'), el => {
        el.addEventListener('click', deleteClass);
        return el;
    });
    let inputTimer = null;
    let inputTimeout = 1000;
    let inputBox = inputNode.children[0];
    let infoNode = inputNode.children[1];
    let courseList = null;
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
    });
    inputBox.addEventListener('focus', () => {
        showInfo();
    });
    inputBox.addEventListener('blur', evt => {
        hideInfo();
        setInfoHelp();
        removeCourseList();
        evt.currentTarget.value = '';
    });
    inputBox.addEventListener('keydown', evt => {
        let key = evt.key || evt.keyCode;
        if (evt.target.value.length === 0) {
            if (key === 'Backspace' || key === 'Delete' || key === 46 || key === 8) {
                deleteClass();
            }
        }
    });


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
        req.open('GET', `/classSearch/?q=${param}`);
        req.addEventListener('loadend', () => {
            if (req.status === 404) {
                hideInfo();
                console.log(req.responseText + '404');
                return;
            }
            hideInfo();
            console.log(req.responseText);
            
            let results = JSON.parse(req.responseText);

            createList(results);
        });
        req.addEventListener('error', () => {
            console.log(req.responseText + 'err');
            infoNode.classList.add('helper');
        });
        req.send(null);
    }



    /**
     * @param {Array} courses
     */
    function createList (courses) {
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
                list.removeChild(classRemoved);
            }
        } else {
            classRemoved = evt.currentTarget;
            chosenClasses = chosenClasses.filter(el => {
                return el !== classRemoved;
            });
            list.removeChild(classRemoved);
        }
    }

    function addClass (chosenClass) {
        if (chosenClasses.length < 10 && !containClass(chosenClass.textContent)) {
            let newClass = document.createElement('li');
            newClass.textContent = chosenClass.textContent;
            newClass.onclick = deleteClass;
            newClass.classList.add('classname');
            list.insertBefore(newClass, inputNode);
            chosenClasses.push(newClass);
        }
    }

    this.getCourses = function() {
        return chosenClasses.map(el => el.textContent);
    };

    function containClass(courseName){
        for (let i = 0; i < chosenClasses.length; i++) {
            const element = chosenClasses[i].textContent;
            if(element === courseName){
                return true;
            }
        }
        return false;
    }

    return this;
})();