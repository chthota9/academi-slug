// Sorts values alphabetically
function alphaSort () {
    var rows, switching, i, x, y, shouldSwitch;

    rows = document.getElementsByTagName('tr');
    switching = true;

    while (switching) {
        switching = false;

        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName('td')[0];
            y = rows[i + 1].getElementsByTagName('td')[0];

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