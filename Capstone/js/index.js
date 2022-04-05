var TestClicked = false;
var interv = null;
var colors = {'A':(360/7), 'B':(360/7) * 2, 'C':(360/7) * 3, 'D':(360/7) * 4, 'E':(360/7) * 5, 'F':(360/7) * 6, 'G':0};
var all_buttons = [null];
var all_channels = [null];
var all_synths = [null];
var button_history = new Map(); // elements are map.get(button) = {color; channel; quiet_bool}
var channel_history = new Map(); //elements are map.get(channel)= {label; volume; synth_bool; soundfile(null); synth(null)}
var synth_history = new Map(); //elements are map.get(synth)= {volume; wave-shape; frequency}
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
	createChannel();
	createSynth();
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
	bs.borderRadius = '10%';
	bs.display = 'inline-block';
	bs.margin = '5px 5px 5px 5px';
	bs.overflow = 'hidden';
	bs.float = 'left';
	//button.addEventListener('mousedown', function () {deleteThis(button.id, button)}, false);
	button.addEventListener("touchstart", function () {Play(button)}, false);
	button.addEventListener('mousedown', function () {Play(button)}, false);
	
	//BUILDING EDIT MENU
	//MAIN DIVS
	let head = document.createElement('div');//holds delete button
	let body = document.createElement('div');//holds top and bottom
	let foot = document.createElement('div');//holds exit button
	let invisibility_cloak = document.createElement('div');
	invisibility_cloak.id = button.id+'cloak';
	
	//structure divs
	let top = document.createElement('div'); //holds color select
	let top_left = document.createElement('div');
	let top_right = document.createElement('div');
	
	let bottom = document.createElement('div'); //holds channel select
	let bottom_left = document.createElement('div');
	let bottom_right = document.createElement('div');
	
	//STYLE INFO
	invisibility_cloak.style.height = '95%';
	invisibility_cloak.style.width = '100%';
	head.style.height = '15%';
	head.style.width = '100%';
	body.style.height = '69%';
	body.style.width = '100%';
	foot.style.height = '15%';
	foot.style.width = '100%';
	
	invisibility_cloak.style.display = 'none';
	head.style.display = 'flex';
	foot.style.display = 'flex';
	
	top.style.display = 'flex';
	top.style.height = '50%';
	top.style.width = '100%';
	bottom.style.display = 'flex';
	bottom.style.height = '49%';
	bottom.style.width = '100%';
	
	top_left.style.flex = '1';
	top_right.style.flex = '1';
	bottom_left.style.flex = '1';
	bottom_right.style.flex = '1';
	
	//ELEMENTS
	//DELETE BUTTON
	let deleteButton = document.createElement('div');
	deleteButton.style.backgroundColor = '#ff0000';
	deleteButton.style.border = '1px solid black';
	deleteButton.style.borderRadius = '10% 40%';
	deleteButton.style.heigth = '100%';
	//deleteButton.style.width = '10%';
	deleteButton.style.flex = '2';
	//deleteButton.style.margin = 'auto';
	
	let ugly_invisible_cardboard_1 = document.createElement('div');
	ugly_invisible_cardboard_1.style.flex = '15';
	head.appendChild(ugly_invisible_cardboard_1);
	let ugly_invisible_cardboard_2 = document.createElement('div');
	ugly_invisible_cardboard_2.style.flex = '1';
	head.appendChild(deleteButton);
	head.appendChild(ugly_invisible_cardboard_2);	
	
	//COLOR SELECT
	let color_select = document.createElement('input');
	color_select.type = "color";
	
	let color = button_history.get(button)['color'];
	
	//archaic handling of colors... sorry!
	if (color[0] == 'h'){
		let some_amount_of_math = RGBtoHex(hslToRGB(stringToHsl(color)));
		color_select.value = some_amount_of_math;
	} else if (color[0] == '#'){
		color_select.value = color;
	}
	
	color_select.style.margin = 'auto';
	color_select.addEventListener("change", function() {console.log('color_changed!');
		button_history.set(button, {color:color_select.value, channel: button_history.get(button)['channel'], quiet_bool:true});}, false);
	top_right.appendChild(color_select);
	
	let color_label = document.createElement('label');
	color_label.for = color_select.name;
	color_label.innerHTML = 'Color:'
	color_label.style.margin = 'auto';
	top_left.appendChild(color_label);
	
	//CHANNEL SELECT
	let channel_select = document.createElement('select');
	channel_select.id = button.id + "ch";
	//let channel = button_history.get(button)['channel'];
	channel_select.value = 'none';
	channel_select.style.margin = 'auto';
	//channel_select.addEventListener("change", function() {console.log('channel_changed!');
	//	button_history.set(button, {color:color_select.value, channel: button_history.get(button)['channel'], quiet_bool:true});}, false);
	buildSelectOptions(channel_select, all_channels);
	console.log(channel_select);
	bottom_right.appendChild(channel_select);
	
	let channel_label = document.createElement('label');
	channel_label.for = channel_select.name;
	channel_label.innerHTML = 'Channel:'
	channel_label.style.margin = 'auto';
	bottom_left.appendChild(channel_label);
	
	//EXIT BUTTON
	let exit = document.createElement('div');
	exit.style.backgroundColor = 'hsl(127, 70%, 50%)';
	exit.style.flex = '12';
	exit.style.border = '1px solid black';
	exit.style.borderRadius = '10%';
	exit.style.height = '90%';
	exit.style.margin = 'auto';
	
	let ugly_invisible_cardboard_3 = document.createElement('div');
	ugly_invisible_cardboard_3.style.flex = '9';
	foot.appendChild(ugly_invisible_cardboard_3);
	let ugly_invisible_cardboard_4 = document.createElement('div');
	ugly_invisible_cardboard_4.style.flex = '9';
	foot.appendChild(exit);
	foot.appendChild(ugly_invisible_cardboard_4);
	
	
	
	
	
	
	
	
	//ACTUAL CONSTRUCTION
	top.appendChild(top_left);
	top.appendChild(top_right);
	bottom.appendChild(bottom_left);
	bottom.appendChild(bottom_right);
	body.appendChild(top);
	body.appendChild(bottom);
	
	invisibility_cloak.appendChild(head);
	invisibility_cloak.appendChild(body);
	invisibility_cloak.appendChild(foot);
	
	button.appendChild(invisibility_cloak);
	
	//troubleshooting borders...
	/*
	head.style.border = '1px solid black';
	body.style.border = '1px solid black';
	top.style.border = '1px solid black';
	top_left.style.border = '1px solid black';
	top_right.style.border = '1px solid black';
	bottom.style.border = '1px solid black';
	bottom_left.style.border = '1px solid black';
	bottom_right.style.border = '1px solid black';
	foot.style.border = '1px solid black';
	invisibility_cloak.style.border = '1px solid black';*/
	
	//make edit button
	let edit_button = document.createElement('div');
	edit_button.id = button.id + 'e';
	edit_button.style.backgroundColor = 'hsl(127, 70%, 50%)';
	edit_button.style.height = '10%';
	edit_button.style.width = '10%';
	edit_button.style.border = '1px solid black';
	edit_button.style.borderRadius = '40% 10%';
	edit_button.style.display = '';
	edit_button.style.margin = '5px 5px 5px 5px';
	edit_button.addEventListener('mousedown', function () {editMenu(button)}, false);
	
	button.appendChild(edit_button);
	
	document.getElementById('toybox1').appendChild(button);
}

function deleteThis(id, button){
	var item = document.getElementById(id);
	item.parentNode.removeChild(item);
	all_buttons[all_buttons.indexOf(button)] = null;
	button_history.delete(button);
}

function editMenu(button){
	//make quiet, hide edit_button, reveal edit menu
	console.log('show edit menu');
	document.getElementById(button.id+'e').style.display = 'none';
	document.getElementById(button.id+'cloak').style.display = 'inline-block';
}

function editMenu_VER_0(button){
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
	delete_button.style.float = 'right';
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
		button_history.set(button, {color:color_select.value, channel: channel, quiet_bool:true});}, false);
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
		edit_button.style.float = 'left';
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
	let r = array[0].toString(16);
	let g = array[1].toString(16);
	let b = array[2].toString(16);
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

function buildSelectOptions(select_object, array){//MAYBE DOESNT WORK
	//take an array of strings, possibly nulls,
	//and fill out option values painstakingly.
	let result = '';
	for (c in array){
		if (!(array[c] === null)){
			result += `<option value="${array[c]}">${array[c]}</option>`;
		}
	}
	select_object.innerHTML = result;
}

function createChannel(){
	//SO MANY DIVS!
	let channel = document.createElement('div'); //will have banner and body
	let banner = document.createElement('div'); // will have edit button, text, minimize, delete
	let body = document.createElement('div'); //will have left and right columns
	let left_column = document.createElement('div'); // will have top and bottom divs
	let right_column = document.createElement('div'); //will have dropdown menu
	let left_column_top = document.createElement('div'); //will have left/right divs
	let left_column_bottom = document.createElement('div'); //will have volume bar
	let left_column_top_left = document.createElement('div'); //will have radio button for synth
	let left_column_top_right = document.createElement('div'); //will have radio button for soundfile
	
	//first, handle channel object stuff
	channel.style.height = '30%';
	channel.style.width = '100%';
	//channel.style.overflow = 'hidden';
	let array_position = NextNull(all_channels);
	channel.id = 'channel'+array_position.toString();
	all_channels[array_position] = channel;
	
	//MAJOR STRUCTURAL INFORMATION
	banner.style.height = '20%';
	banner.style.width = '100%';
	banner.style.display = 'flex';
	
	
	body.style.height = '79%';
	body.style.width = '100%';
	body.style.display = 'flex';
	
	banner.style.backgroundColor = '#cccccc';
	body.style.backgroundColor = '#999999';
	
	left_column_top.style.height = '50%';
	left_column_top.style.width = '100%';
	left_column_top.style.display = 'flex';
	
	left_column_bottom.style.height = '49%';
	left_column_bottom.style.width = '100%';
	left_column_bottom.style.display = 'flex';
	
	left_column_top_left.style.display = 'flex';
	left_column_top_right.style.display = 'flex';
	
	//lets build inside out...start from the bottom of this list and work upwards
	let radio_1 = document.createElement('input');
	radio_1.id = channel.id + 'r1';
	radio_1.type = 'radio';
	radio_1.name = channel.id + 'rname'; //NEED TO IDENTIFY CHANNEL UP TOP.
	radio_1.value = 'Synth';
	let radio_1_label = document.createElement('label');
	radio_1_label.for= radio_1.name;
	radio_1_label.innerHTML = 'Synth';
	
	radio_1.style.flex = '1';
	radio_1.style.margin = 'auto';
	radio_1_label.style.flex = '2';
	radio_1_label.style.margin = 'auto';
	left_column_top_left.appendChild(radio_1);
	left_column_top_left.appendChild(radio_1_label);
	
	let radio_2 = document.createElement('input');
	radio_2.id = channel.id + 'r2'
	radio_2.type = 'radio';
	radio_2.name = channel.id + 'rname'; //NEED TO IDENTIFY CHANNEL UP TOP.
	radio_2.value = 'Soundfile';
	radio_2.checked = true;
	let radio_2_label = document.createElement('label');
	radio_2_label.for = radio_2.name;
	radio_2_label.innerHTML = 'Soundfile';
	
	radio_2.style.flex = '1';
	radio_2.style.margin = 'auto';
	radio_2_label.style.flex = '2';
	radio_2_label.style.margin = 'auto';
	left_column_top_right.appendChild(radio_2);
	left_column_top_right.appendChild(radio_2_label);
	
	//NEED LISTENER EVENTS FOR RADIO BUTTONS
	
	left_column_top_left.style.flex = '1';
	left_column_top_right.style.flex = '1';
	left_column_top.appendChild(left_column_top_left);
	left_column_top.appendChild(left_column_top_right);
	
	let volume = document.createElement('input');
	volume.type = 'range';
	volume.id = channel.id + 'v';
	volume.min = '0';
	volume.max = '100';
	volume.step = '10';
	volume.value = '100';
	volume.name = channel.id + 'vname';
	let volume_label = document.createElement('label');
	volume_label.for = volume.name;
	volume_label.innerHTML = 'Volume:'
	
	//NEED LISTENER EVENTS FOR VOLUME
	volume.style.flex = '2';
	volume.style.margin = 'auto';
	volume_label.style.flex = '5';
	volume_label.style.margin = 'auto';
	left_column_bottom.appendChild(volume_label);
	left_column_bottom.appendChild(volume);
	
	left_column.appendChild(left_column_top);
	left_column.appendChild(left_column_bottom);
	
	let variable_select = document.createElement('select');
	variable_select.id = channel.id + 's'
	variable_select.name = channel.id + 'sname';
	variable_select.margin = 'auto';
	buildSelectOptions(variable_select, soundfile);
	
	//NEED LISTENER EVENTS FOR SELECT OBJECT
	
	right_column.appendChild(variable_select);
	
	left_column.style.flex = '3';
	right_column.style.flex = '1';
	body.appendChild(left_column);
	body.appendChild(right_column);
	
	let editButton = document.createElement('div');
	editButton.style.backgroundColor = 'green';
	//editButton.style.height = '100%';
	//editButton.style.width = '10%';
	//editButton.style.display = 'inline-block';
	editButton.style.flex = '1';
	editButton.style.border = '1px solid black';
	editButton.style.borderRadius = '40% 10%';
	editButton.style.margin = '2px 2px 2px 2px';
	
	let minButton = document.createElement('div');
	minButton.style.backgroundColor = '#7777ff';
	//minButton.style.height = '100%';
	//minButton.style.width = '10%';
	//minButton.style.display = 'inline-block';
	minButton.style.flex = '1';
	minButton.style.border = '1px solid black';
	minButton.style.borderRadius = '10% 40%';
	minButton.style.margin = '2px 2px 2px 2px';
	
	let deleteButton = document.createElement('div');
	deleteButton.style.backgroundColor = '#ff0000';
	deleteButton.style.flex = '1';
	deleteButton.style.border = '1px solid black';
	deleteButton.style.borderRadius = '10% 40%';
	deleteButton.style.margin = '2px 2px 2px 2px';
	
	
	let channelName = document.createElement('div');
	channelName.id = channel.id + 'n'
	channelName.innerHTML = channel.id + ' (default name)';
	channelName.style.margin = '5px 5px 5px 5px';
	channelName.style.flex = '15';
	
	banner.appendChild(editButton);
	banner.appendChild(channelName);
	banner.appendChild(minButton);
	banner.appendChild(deleteButton);
	
	channel.appendChild(banner);
	channel.appendChild(body);
	
	//might cause issues assigning variables...
	channel_history.set(channel, {label: channelName.id, volume: volume.value, synth_bool: false, soundfile:variable_select.value, synth: null});
	document.getElementById("toybox2").appendChild(channel);
}

function createSynth (){
	//lol yeah I am showing I don't understand CSS
	//MAIN DIVS
	let synth = document.createElement('div');
	let banner = document.createElement('div');
	let body = document.createElement('div');
	
	//LEFT COLUMN
	let left_column = document.createElement('div');
	let left_column_top = document.createElement('div');
	let left_column_top_left = document.createElement('div');
	let left_column_top_right = document.createElement('div');
	let left_column_bottom = document.createElement('div');
	let left_column_bottom_left = document.createElement('div');
	let left_column_bottom_right = document.createElement('div');
	
	//RIGHT COLUMN
	let right_column = document.createElement('div');
	let right_column_top = document.createElement('div');
	let right_column_top_left = document.createElement('div');
	let right_column_top_left_left = document.createElement('div');
	let right_column_top_left_right = document.createElement('div');
	let right_column_top_right = document.createElement('div');
	let right_column_top_right_left = document.createElement('div');
	let right_column_top_right_right = document.createElement('div');
	let right_column_bottom = document.createElement('div');
	let right_column_bottom_left = document.createElement('div');
	let right_column_bottom_left_left = document.createElement('div');
	let right_column_bottom_left_right = document.createElement('div');
	let right_column_bottom_right = document.createElement('div');
	let right_column_bottom_right_left = document.createElement('div');
	let right_column_bottom_right_right = document.createElement('div');
	
	//MAJOR STRUCTURAL INFORMATION
	synth.style.height = '30%';
	synth.style.width = '100%';
	let array_position = NextNull(all_synths);
	synth.id = 'synth'+array_position.toString();
	all_synths[array_position] = synth;
	
	banner.style.height = '20%';
	banner.style.width = '100%';
	banner.style.display = 'flex';
	
	body.style.height = '79%';
	body.style.width = '100%';
	body.style.display = 'flex';
	
	banner.style.backgroundColor = '#cccccc';
	body.style.backgroundColor = '#999999';
	
	//LEFT COLUMN STRUCTURAL INFORMATION
	left_column.style.height = '100%';
	left_column.style.flex = '1';
	
	left_column_top.style.height = '50%';
	left_column_top.style.width = '100%';
	left_column_top.style.display = 'flex';
	
	left_column_top_left.style.flex = '1';
	left_column_top_right.style.flex = '1';
	
	left_column_bottom.style.height = '49%';
	left_column_bottom.style.width = '100%';
	left_column_bottom.style.display = 'flex';
	
	left_column_bottom_left.style.flex = '1';
	left_column_bottom_right.style.flex = '1';
	
	//RIGHT COLUMN STRUCTURAL INFORMATION
	right_column.style.height = '100%';
	right_column.style.flex = '1';
	
	right_column_top.style.height = '50%';
	right_column_top.style.width = '100%';
	right_column_top.style.display = 'flex';
	
	right_column_top_left.style.display = 'flex';
	right_column_top_left.style.flex = '1';
	
	right_column_top_left_left.style.flex = '1';
	right_column_top_left_right.style.flex = '1';
	
	right_column_top_right.style.display = 'flex';
	right_column_top_right.style.flex = '1';
	
	right_column_top_right_left.style.flex = '1';
	right_column_top_right_right.style.flex = '1';
	
	right_column_bottom.style.height = '50%';
	right_column_bottom.style.width = '100%';
	right_column_bottom.style.display = 'flex';
	
	right_column_bottom_left.style.display = 'flex';
	right_column_bottom_left.style.flex = '1';
	
	right_column_bottom_left_left.style.flex = '1';
	right_column_bottom_left_right.style.flex = '1';
	
	right_column_bottom_right.style.display = 'flex';
	right_column_bottom_right.style.flex = '1';
	
	right_column_bottom_right_left.style.flex = '1';
	right_column_bottom_right_right.style.flex = '1';
	
	//troubleshooting borders...
	/*
	left_column.style.border = '1px solid black';
	left_column_top.style.border = '1px solid black';
	left_column_top_left.style.border = '1px solid black';
	left_column_top_right.style.border = '1px solid black';
	left_column_bottom.style.border = '1px solid black';
	left_column_bottom_left.style.border = '1px solid black';
	left_column_bottom_right.style.border = '1px solid black';
	
	//RIGHT COLUMN
	right_column.style.border = '1px solid black';
	right_column_top.style.border = '1px solid black';
	right_column_top_left.style.border = '1px solid black';
	right_column_top_left_left.style.border = '1px solid black';
	right_column_top_left_right.style.border = '1px solid black';
	right_column_top_right.style.border = '1px solid black';
	right_column_top_right_left.style.border = '1px solid black';
	right_column_top_right_right.style.border = '1px solid black';
	right_column_bottom.style.border = '1px solid black';
	right_column_bottom_left.style.border = '1px solid black';
	right_column_bottom_left_left.style.border = '1px solid black';
	right_column_bottom_left_right.style.border = '1px solid black';
	right_column_bottom_right.style.border = '1px solid black';
	right_column_bottom_right_left.style.border = '1px solid black';
	right_column_bottom_right_right.style.border = '1px solid black';*/
		
	
	//BUILDING BANNER ELEMENTS
	let editButton = document.createElement('div');
	editButton.style.backgroundColor = 'green';
	editButton.style.flex = '1';
	editButton.style.border = '1px solid black';
	editButton.style.borderRadius = '40% 10%';
	editButton.style.margin = '2px 2px 2px 2px';
	
	let minButton = document.createElement('div');
	minButton.style.backgroundColor = '#7777ff';
	minButton.style.flex = '1';
	minButton.style.border = '1px solid black';
	minButton.style.borderRadius = '10% 40%';
	minButton.style.margin = '2px 2px 2px 2px';
	
	let deleteButton = document.createElement('div');
	deleteButton.style.backgroundColor = '#ff0000';
	deleteButton.style.flex = '1';
	deleteButton.style.border = '1px solid black';
	deleteButton.style.borderRadius = '10% 40%';
	deleteButton.style.margin = '2px 2px 2px 2px';
	
	let synthName = document.createElement('div');
	synthName.id = synth.id + 'n'
	synthName.innerHTML = synth.id + ' (default name)';
	synthName.style.margin = '5px 5px 5px 5px';
	synthName.style.flex = '15';
	
	banner.appendChild(editButton);
	banner.appendChild(synthName);
	banner.appendChild(minButton);
	banner.appendChild(deleteButton);
	
	//BUILDING LEFT COLUMN ELEMENTS
	
	let freq_select = document.createElement('select');
	freq_select.id = synth.id + 's'
	freq_select.name = synth.id + 'select';
	freq_select.margin = 'auto';
	buildSelectOptions(freq_select, ['A','B','C']);
	
	let freq_label = document.createElement('label');
	freq_label.for = freq_select.name;
	freq_label.innerHTML = 'Frequency:'
	freq_label.style.margin = 'auto';
	
	left_column_top_left.appendChild(freq_label);
	left_column_top_right.appendChild(freq_select);
	
	let volume = document.createElement('input');
	volume.type = 'range';
	volume.id = synth.id + 'v';
	volume.min = '0';
	volume.max = '100';
	volume.step = '10';
	volume.value = '100';
	volume.name = synth.id + 'vname';
	volume.style.margin = 'auto';
	
	let volume_label = document.createElement('label');
	volume_label.for = volume.name;
	volume_label.innerHTML = 'Volume:'
	volume_label.style.margin = 'auto';
	
	left_column_bottom_left.appendChild(volume_label);
	left_column_bottom_right.appendChild(volume);
	
	//BUILDING RIGHT COLUMN ELEMENTS
	//SINE
	let sine_radio = document.createElement('input');
	sine_radio.id = synth.id + 'sir';
	sine_radio.type = 'radio';
	sine_radio.name = synth.id + 'radio';
	sine_radio.value = 'sine';
	sine_radio.checked = true;
	sine_radio.style.margin = 'auto';
	
	right_column_top_left_left.appendChild(sine_radio);
	
	let sine_label = document.createElement('label');
	sine_label.for = sine_radio.name;
	sine_label.innerHTML = 'sine';
	sine_label.style.margin = 'auto';
	
	right_column_top_left_right.appendChild(sine_label);
	
	//SQUARE
	let square_radio = document.createElement('input');
	square_radio.id = synth.id + 'sqr';
	square_radio.type = 'radio';
	square_radio.name = synth.id + 'radio';
	square_radio.value = 'square';
	square_radio.style.margin = 'auto';
	
	right_column_top_right_left.appendChild(square_radio);
	
	let square_label = document.createElement('label');
	square_label.for = square_radio.name;
	square_label.innerHTML = 'square';
	square_label.style.margin = 'auto';
	
	right_column_top_right_right.appendChild(square_label);
	
	//SAW
	let saw_radio = document.createElement('input');
	saw_radio.id = synth.id + 'sar';
	saw_radio.type = 'radio';
	saw_radio.name = synth.id + 'radio';
	saw_radio.value = 'saw';
	saw_radio.style.margin = 'auto';
	
	right_column_bottom_left_left.appendChild(saw_radio);
	
	let saw_label = document.createElement('label');
	saw_label.for = saw_radio.name;
	saw_label.innerHTML = 'saw';
	saw_label.style.margin = 'auto';
	
	right_column_bottom_left_right.appendChild(saw_label);
	
	//TRIANGLE
	let tri_radio = document.createElement('input');
	tri_radio.id = synth.id + 'trr';
	tri_radio.type = 'radio';
	tri_radio.name = synth.id + 'radio';
	tri_radio.value = 'triangle';
	tri_radio.style.margin = 'auto';
	
	right_column_bottom_right_left.appendChild(tri_radio);
	
	let tri_label = document.createElement('label');
	tri_label.for = tri_radio.name;
	tri_label.innerHTML = 'triangle';
	tri_label.style.margin = 'auto';
	
	right_column_bottom_right_right.appendChild(tri_label);
	
	//ACTUAL CONSTRUCTION
	left_column_bottom.appendChild(left_column_bottom_left);
	left_column_bottom.appendChild(left_column_bottom_right);
	
	left_column_top.appendChild(left_column_top_left);
	left_column_top.appendChild(left_column_top_right);
	
	left_column.appendChild(left_column_top);
	left_column.appendChild(left_column_bottom);
	
	right_column_bottom_left.appendChild(right_column_bottom_left_left);
	right_column_bottom_left.appendChild(right_column_bottom_left_right);
	right_column_bottom_right.appendChild(right_column_bottom_right_left);
	right_column_bottom_right.appendChild(right_column_bottom_right_right);
	right_column_bottom.appendChild(right_column_bottom_left);
	right_column_bottom.appendChild(right_column_bottom_right);
	
	right_column_top_left.appendChild(right_column_top_left_left);
	right_column_top_left.appendChild(right_column_top_left_right);
	right_column_top_right.appendChild(right_column_top_right_left);
	right_column_top_right.appendChild(right_column_top_right_right);
	right_column_top.appendChild(right_column_top_left);
	right_column_top.appendChild(right_column_top_right);
	
	right_column.appendChild(right_column_top);
	right_column.appendChild(right_column_bottom);
	
	body.appendChild(left_column);
	body.appendChild(right_column);
	
	synth.appendChild(banner);
	synth.appendChild(body);
	
	//HANDLE SYNTH HISTORY HERE
	document.getElementById('toybox3').appendChild(synth);
}