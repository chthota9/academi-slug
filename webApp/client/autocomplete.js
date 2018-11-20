
let classNames;

fetch('/classSearch/allClasses/',{method:'POST'})
.then((res) => res.text())
.then((data) => {
  classNames = JSON.parse(data);
  autocomplete(document.getElementById('searchBar'), classNames);
  });

  //takes two argument (userinput, array)
function autocomplete(classInput, classNames) {
  /*Listening for input from user*/
  classInput.addEventListener('input', function() {
      var eValue, mValue, i, val = this.value;
      eValue = document.createElement('DIV');
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) {
        return false;
      }
      /*div element with values*/
      eValue.setAttribute('id', this.id + 'autocomplete-list');
      eValue.setAttribute('class', 'autocomplete-items');
      /*append the div element as a child autocomplete items*/
      this.parentNode.appendChild(eValue);
      for (i = 0; i < classNames.length; i++) {
        /*checks if the item starts with the same letters as the text field value:*/
        if (classNames[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*div element for matching values (shown in bold)*/
          mValue = document.createElement('DIV');
          mValue.innerHTML = '<strong>' + classNames[i].substr(0, val.length) + '</strong>';
          mValue.innerHTML += classNames[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          mValue.innerHTML += '<input type=\'hidden\' value=\'' + classNames[i] + '\'>';
          /*execute a function when someone clicks on the item value */
          mValue.addEventListener('click', function() {
              /*insert the value for the autocomplete text field:*/
              classInput.value = this.getElementsByTagName('input')[0].value;
              /*close the list of autocompleted values,*/
              closeAllLists();
          });
          eValue.appendChild(mValue);
        }
      }
  });


  function closeAllLists(elementInput) {
    /*close all autocomplete lists in the document, except the matching one */
    var x = document.getElementsByClassName('autocomplete-items');
    for (var i = 0; i < x.length; i++) {
      if (elementInput != x[i] && elementInput != classInput) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }

  /*execute a function when someone clicks in the document:*/

  document.addEventListener('keypress', function(e) {
    var key = e.which || e.keyCode;
      if(key === 13){
      closeAllLists(e.target);
  }
  });
}




