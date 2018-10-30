let classNames;
let bucketSize;


function classSort(classNames, bucketSize){
	//empty check
	if(classNames.length === 0){
		return classNames;
	}

	//initialize buckets
	var bucketSize = new Array();

	for (var i = 'a'; aToz <= 'z'; aToz++){
		bucketSize.push(new Array());
	}

	//Detect first letter of each ith String and put it in the right bucket
	for ( var i = 0; i <= classNames.length; i++){

		for (var aToz = 'a'; aToz <= 'z'; aToz++){
			if (className[i].startsWith(String.valueOf(aToz)){
				bucketSize.find(aToz).push(classNames[i]);
			}
		}
	}

function classSearch(inputSearch){

	document.getElementById("submit").onsubmit = function()

	inputSearch = document.getElementById("search").value;

	if (inputSearch === ""){
		return ("Nothing was typed!")
	}else{
	for (var aToz = 'a'; aToz <= 'z'; aToz++){
		if (inputSearch.startsWith(String.valueOf(aToz)){
			for (var i = 0; i <= )
			bucketSize.find(aToz).push(classNames[i]);
			}
		}

	}

}




