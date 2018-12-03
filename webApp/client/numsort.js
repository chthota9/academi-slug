// Sorts ratings from best to worst
function numSort() {
    var rows, switching, i, x, y, shouldSwitch;
    rows = document.getElementsByTagName('tr');
    switching = true;

    while (switching) {
        switching = false;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName('td')[1];
            y = rows[i + 1].getElementsByTagName('td')[1];
            if (x.childElementCount < y.childElementCount) {
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