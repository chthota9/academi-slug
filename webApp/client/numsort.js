// sorts rating from best to worst
console.log("sorting-before - for num");
function numSort() {
    console.log("sorting-after - for num");
    var rows, switching, i, x, y, shouldSwitch;
    rows = document.getElementsByTagName("tr");
    console.log(rows);
    switching = true;

        while (switching) {
            switching = false;
            console.log("reading properties of length");
                for (i = 1; i < (rows.length - 1); i++) {
                     shouldSwitch = false;
                     x = rows[i].getElementsByTagName("td")[1];
                     y = rows[i + 1].getElementsByTagName("td")[1];
                        if (x.childElementCount < y.childElementCount) {
                        console.log("got elements");
                        console.log(x.childElementCount);
                        console.log(y.childElementCount);
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