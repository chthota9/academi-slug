// sorts alphabetically
console.log("sorting-before");
function alphaSort() {
  console.log("sorting-after");
  var rows, switching, i, x, y, shouldSwitch;
  rows = document.getElementsByTagName("tr");
  console.log(rows);
  switching = true;
    while (switching) {
        switching = false;
        console.log("reading properties of length");
          for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("td")[0];
            console.log(x);
            y = rows[i + 1].getElementsByTagName("td")[0];
            console.log(y);
      if (x.innerText.toLowerCase() > y.innerText.toLowerCase()) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}
