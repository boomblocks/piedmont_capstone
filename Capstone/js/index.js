var TestClicked = false;
var interv = null;
var colors = {'A':(360/7), 'B':(360/7) * 2, 'C':(360/7) * 3, 'D':(360/7) * 4, 'E':(360/7) * 5, 'F':(360/7) * 6, 'G':0};
var all_buttons = [null];
var button_history = new Map(); // elements are map.get(button) = {color; channel; quiet_bool}
var channel_history = new Map(); //elements are map.get(channel)= {volume; synth_bool; soundfile; synth}
var increment = 0;
var	soundfile = ["./audio/Ahh!_1.wav",
		"./audio/Am_Chord_1.wav",
		"./audio/Bass_1.wav",
		"./audio/C_Chord_1.wav",
		"./audio/Chinese.wav",
		"./audio/Clap_1.wav",
		"./audio/Cowbell_1.wav",
		"./audio/D_Chord_1.wav",
		"./audio/D7_Chord_1.wav",
		"./audio/Deep_Hit_1.wav",
		"./audio/Em_Chord_1.wav",
		"./audio/G_Chord_1.wav",
		"./audio/Hat_1.wav",
		"./audio/Huah!_1.wav",
		"./audio/Kick_1.wav",
		"./audio/Punch_1.wav",
		"./audio/Snare_1.wav",
		"./audio/Thawck_1.wav"];
//let sound = new Audio("soundfile.wav");
//sound.play();



function Test(){
	createButton();
	shuffle_colors();
	
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
	button.id = "button"+array_position.toString();
	all_buttons[array_position] = button;
	button_history.set(button, {color:`hsl(${colors['A']}, 100%, 50%)`, channel: null, quiet_bool: false});
	//button.style = `background-color:${color}; height: 125px; width:125px; border:1px solid black`;
	bs.backgroundColor = `hsl(${colors['A']}, 100%, 50%)`;
	bs.height = '120px';
	bs.width = '120px';
	bs.border = 'solid black 1px';
	bs.display = 'inline-block';
	bs.margin = '5px 5px 5px 5px';
	bs.float = 'left';
	//button.addEventListener('mousedown', function () {deleteThis(button.id, button)}, false);
	button.addEventListener("touchstart", function () {Play(button)}, false);
	button.addEventListener('mousedown', function () {Play(button)}, false);
	document.getElementById("toybox").appendChild(button);
	
	//make edit button
	let edit_button = document.createElement('div');
	edit_button.id = button.id + 'e';
	edit_button.style.backgroundColor = 'hsl(127, 50%, 50%)';
	edit_button.style.height = '12px';
	edit_button.style.width = '12px';
	edit_button.style.float = 'right';
	edit_button.addEventListener('mousedown', function () {editMenu(button)}, false);
	
	button.appendChild(edit_button);
}

function deleteThis(id, button){
	var item = document.getElementById(id);
	item.parentNode.removeChild(item);
	all_buttons[all_buttons.indexOf(button)] = null;
	button_history.delete(button);
}

function editMenu(button){
	//make quiet, remove edit_button
	button.removeChild(document.getElementById(button.id + 'e'));
	button.style.backgroundColor = 'grey';
	let color = button_history.get(button)['color'];
	let channel = button_history.get(button)['channel'];
	button_history.set(button, {color: color, channel: channel, quiet_bool: true});
	
	//make delete button
	let delete_button = document.createElement('div');
	delete_button.style.backgroundColor = 'hsl(0, 50%, 50%)';
	delete_button.style.height = '12px';
	delete_button.style.width = '12px';
	delete_button.id = button.id + 'd';
	delete_button.addEventListener('mousedown', function () {deleteThis(button.id, button)}, false);
	button.appendChild(delete_button);
	
	//make color chooser
	//<input type="color" id="head" name="head" value="#e66465">
	let color_select = document.createElement('input');
	color_select.type = "color";
	if (color[0] == 'h'){
		let hilarious_amount_of_math = RGBtoHex(hslToRGB(stringToHsl(color)));
		console.log(hilarious_amount_of_math);
		color_select.value = hilarious_amount_of_math;
	} else if (color[0] == '#'){
		color_select.value = color;
	}
	color_select.style.margin = '10px';
	color_select.style.float = 'centered';
	color_select.addEventListener("change", function() {
		console.log(`${color_select.value}`); button_history.set(button, {color:color_select.value, channel: channel, quiet_bool:true});}, false);
	button.appendChild(color_select);
	
	//make channel select
	//let channel_select = document.createElement('select');
	
	//exit button
	let exit = document.createElement('button');
	exit.style.text = 'Exit';
	exit.onclick = function () {
		button.removeChild(document.getElementById(button.id+'d'));
		button.removeChild(color_select);
		let edit_button = document.createElement('div');
		edit_button.id = button.id + 'e';
		edit_button.style.backgroundColor = 'hsl(127, 50%, 50%)';
		edit_button.style.height = '12px';
		edit_button.style.width = '12px';
		edit_button.style.float = 'right';
		edit_button.addEventListener('mousedown', function () {editMenu(button)}, false);
		button.appendChild(edit_button);
		color = button_history.get(button)['color'];
		channel = button_history.get(button)['channel'];
		button_history.set(button, {color:color, channel: channel, quiet_bool:false});
		button.style.backgroundColor = `${color}`;
		setTimeout(function(){button.removeChild(exit)},1);
	}
	button.appendChild(exit);
		
	
}

function stringToHsl(string){
	let array = ['','',''];
	let i = 0;
	for (c in string){
		if ('.0123456789'.includes(string[c])){
			array[i] += string[c];
		} else if (string[c] == ','){
			i++;
		}
	}
	return array;
}

function hslToRGB(array) {
	let h = parseInt(array[0]);
    let s = parseInt(array[1])/100;
    let l = parseInt(array[2])/100;
	let C = (1 - Math.abs(2 * l - 1)) * s;
	let X = C * (1 - Math.abs(((h/60)%2) -1));
	let m = l - C/2;
	let handler = [];
	if ((0 <= h) && (h < 60)){
		handler = [C, X, 0];
	} else if ((60 <= h) && (h < 120)){
		handler = [X, C, 0];
	} else if ((120 <= h) && (h < 180)){
		handler = [0, C, X];
	} else if ((180 <= h) && (h < 240)){
		handler = [0, X, C];
	} else if ((240 <= h) && (h < 300)){
		handler = [X, 0, C];
	} else if ((300 <= h) && (h <= 360)){
		handler = [C, 0, X];
	}
	let result = [((handler[0]+m)*255).toFixed(0), ((handler[1]+m)*255).toFixed(0), ((handler[2]+m)*255).toFixed(0)];
	handler = [parseInt(result[0]),parseInt(result[1]),parseInt(result[2])];
	return handler;
}

function RGBtoHex(array){
	console.log(`lastly...${array}`);
	let r = array[0].toString(16);
	let g = array[1].toString(16);
	let b = array[2].toString(16);
	console.log(`r=${r}...g=${g}...b=${b}`);
	if (r.length == 1){
		r = '0' + r;
	} if (g.length == 1){
		g = '0' + g;
	} if (b.length == 1){
		b = '0' + b;
	}
	return `#${r}${g}${b}`;
}

function shuffle_colors(){
	colors = {'A':colors["B"], 'B':colors["C"], 'C':colors["D"], 'D':colors["E"],
		'E':colors["F"], 'F':colors["G"], 'G':colors["A"]};
}