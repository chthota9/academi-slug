let classNames;

fetch('/classSearch/allClasses/', { method: 'POST' })
    .then((res) => res.text())
    .then((data) => {
        classNames = JSON.parse(data);
        autocomplete(document.getElementById('searchBar'), classNames);
    });

// Takes two argument (userinput, array)
function autocomplete (classInput, classNames) {
    // /Listening for input from user
    classInput.addEventListener('input', function() {
        var eValue, mValue, i, val = this.value;
        eValue = document.createElement('DIV');

        // Close any already-open lists of autocompleted values
        closeAllLists();
        if (!val) {
            return false;
        }

        // Div element with values
        eValue.setAttribute('id', this.id + 'autocomplete-list');
        eValue.setAttribute('class', 'autocomplete-items');

        // Append the div element as a child autocomplete items
        this.parentNode.appendChild(eValue);

        for (i = 0; i < classNames.length; i++) {
            // Checks if the item starts with the same letters as the text field value:
            if (classNames[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                // Div element for matching values (shown in bold)
                mValue = document.createElement('DIV');
                mValue.innerHTML = '<strong>' + classNames[i].substr(0, val.length) + '</strong>';
                mValue.innerHTML += classNames[i].substr(val.length);

                // Insert a input field that will hold the current array item's value:
                mValue.innerHTML += '<input type=\'hidden\' value=\'' + classNames[i] + '\'>';

                // Execute a function when someone clicks on the item value 
                mValue.addEventListener('click', function() {
                    // Insert the value for the autocomplete text field:
                    classInput.value = this.getElementsByTagName('input')[0].value;

                    // Close the list of autocompleted values,
                    closeAllLists();
                });
                eValue.appendChild(mValue);
            }
        }
    });

    function closeAllLists (elementInput) {
        // Close all autocomplete lists in the document, except the matching one
        var x = document.getElementsByClassName('autocomplete-items');
        for (var i = 0; i < x.length; i++) {
            if (elementInput != x[i] && elementInput != classInput) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    // Execute a function when someone clicks in the document:
    document.addEventListener('keypress', function(e) {
        var key = e.which || e.keyCode;
        if (key === 13) {
            closeAllLists(e.target);
        }
    });
}