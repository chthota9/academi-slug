// Sorts reviewCount most reviewed to least reviewed
function reviewCountSort() {
    var rows, switching, i, x, y, shouldSwitch;
    rows = document.getElementsByTagName('tr');
    switching = true;

    while (switching) {
        switching = false;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName('td')[1];
            y = rows[i + 1].getElementsByTagName('td')[1];
            var changeValue = x.innerText.replace(/\(|\)/g,'');
            var changeValue1 = y.innerText.replace(/\(|\)/g,'');

            changeValue = changeValue.trim();
            changeValue1 = changeValue1.trim();

            changeValue = Number(changeValue);
            changeValue1 = Number(changeValue1);

            if( isNaN(changeValue)) {
                changeValue = 0;
            }
            if( isNaN(changeValue1)) {
                changeValue1 = 0;
            }

            if (changeValue < changeValue1) {
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