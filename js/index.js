var TestClicked = false;
var interv = null;
var colors = {'A':(360/7), 'B':(360/7) * 2, 'C':(360/7) * 3, 'D':(360/7) * 4, 'E':(360/7) * 5, 'F':(360/7) * 6, 'G':0};
var all_buttons = [null];

function Test(){
	console.log("running test...");
	if (!(TestClicked)){
		//TestClicked = true;
		createButton();
		shuffle_colors();
		//interv = setInterval(createP, 500);
	} else {
		TestClicked = false;
		//clearInterval(interv);
	}
}

function NextNull(array){
	for (i=0;i<array.length;i++){
		if (array[i] === null){
			return i;
			}
		}
	array.push(null);
	return array.length-1;
};

function createButton(){
	let button = document.createElement('div');
	let bs = button.style;
	let array_position = NextNull(all_buttons);
	all_buttons[array_position] = button.id;
	button.id = "button"+array_position.toString();
	//button.style = `background-color:${color}; height: 125px; width:125px; border:1px solid black`;
	bs.backgroundColor = `hsl(${colors['A']}, 100%, 50%)`;
	bs.height = '125px';
	bs.width = '125px';
	//bs.border = '1px solid black';
	bs.display = 'inline-block';
	bs.marginLeft = '5px';
	
	console.log(button.style);
	button.addEventListener('mousedown', function () {deleteThis(button.id)}, false);
	button.addEventListener("touchstart", function () {deleteThis(button.id)}, false);
	document.getElementById("toybox").appendChild(button);
}

function deleteThis(id){
	var item = document.getElementById(id);
	item.parentNode.removeChild(item);
}

function shuffle_colors(){
	colors = {'A':colors["B"], 'B':colors["C"], 'C':colors["D"], 'D':colors["E"],
		'E':colors["F"], 'F':colors["G"], 'G':colors["A"]};
}

function lava() {
	for (c in all_buttons){
		if (!(c === null)){
			document.getElementById(c).style.background = 'red';
		}
	}
}