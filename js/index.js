var TestClicked = true;
var interv = null;
var colors = {'A':(360/7), 'B':(360/7) * 2, 'C':(360/7) * 3, 'D':(360/7) * 4, 'E':(360/7) * 5, 'F':(360/7) * 6, 'G':0};
var all_buttons = [null];
var all_channels = [null];
var all_synths = [null];
var button_history = new Map(); // elements are map.get(button) = {color; channel; quiet_bool; current_context}
var channel_history = new Map(); //elements are map.get(channel)= {label; volume; synth_bool; soundfile(null); synth(null)}
var synth_history = new Map(); //elements are map.get(synth)= {volume; wave_shape; frequency}
var increment = 0;
var hasTouched = false;
var	soundfile = ["./audio/Am_Chord_1.wav",
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
		"./audio/Thawck_1.wav",
		"./audio/Ahh!_1.wav"];
//let sound = new Audio("soundfile.wav");
//sound.play();
let noteFreq = null;
function createNoteTable(string) {
	let noteFreq = [];
	for (let i=0; i< 9; i++) {
		noteFreq[i] = [];
	}
	
	let noteNames = ['A', 'A#', 'B', 'C', 'C#',
	'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
	var prev_frequency = 25.95654359874657;
	if (string == 'use_1'){
		let freq_names = [];
		let a = '012345678';
		for (const x in a) {
			for (const y in noteNames){
				freq_names.push(`${noteNames[y]}${a[x]}`);
			}
		}
		return freq_names;
	} else if (string == 'use_2'){
		let freq_names = [];
		let a = '012345678';
		for (const x in a) {
			for (const y in noteNames){
				freq_names.push(`${noteNames[y]}${a[x]}`);
			}
		}
		let freq_values = [];
		for (c in freq_names){
			var freqValue = prev_frequency * (2**(1/12));
				prev_frequency = freqValue;
				freq_values[freq_names[c]] = freqValue;
		}
		return freq_values;
	} else {
		for (const x in noteFreq) {
			for (const y in noteNames){
				var freqValue = prev_frequency * (2**(1/12));
				prev_frequency = freqValue;
				noteFreq[x][noteNames[y]] = freqValue;
			}
		}
	}
	return noteFreq;
}
var freq_names = createNoteTable('use_1');
var freq_values = createNoteTable('use_2');

//console.log(freq_names);
//console.log(freq_values);

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

function divEventBundle(some_element){
	//This is where I will admit...
	//I am going to handle touch/mouse event problems
	//with a bool at the top of the javascript.
	//IF (!(hasTouched)){ run mousedown event}
	
	//this isnt so much a function as it is a clipboard...
	/*
	some_element.addEventListener("touchstart", function(){hasTouched=true;console.log('this');}, false);
	some_element.addEventListener("mousedown", function(){if(!(hasTouched)){console.log('this');}}, false);
	*/
};
document.getElementById('add').addEventListener("touchstart", function(){hasTouched=true;Test();}, false);
document.getElementById('add').addEventListener("mousedown", function(){if(!(hasTouched)){console.log('.'),Test();}}, false);
	

function createButton(){
	let button = document.createElement('div');
	let bs = button.style;
	let array_position = NextNull(all_buttons);
	button.id = "button"+array_position.toString();
	all_buttons[array_position] = button;
	button_history.set(button, {color:`hsl(${colors['A']}, 100%, 50%)`, channel: null, quiet_bool: false, current_context:null});
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
	button.addEventListener("touchstart", function(){
		hasTouched=true;
		Play(button);
		}, false);
	button.addEventListener("mousedown", function(){if(!(hasTouched)){
		Play(button);
		}}, false);
	button.addEventListener("touchend", function(){
		hasTouched=true;
		console.log('touchend!');
		if (!(button_history.get(button)['current_context']===null)){
			//end current context here!
			button_history.get(button)['current_context'].stop()
			button_history.set(button, {color:button_history.get(button)['color'],
									channel:button_history.get(button)['channel'],
									quiet_bool:button_history.get(button)['quiet_bool'],
									current_context:null});
		}
	}, false);
	button.addEventListener("mouseup", function(){if(!(hasTouched)){
		console.log('mouseup!');
		if (!(button_history.get(button)['current_context']===null)){
			//end current context here!
			button_history.get(button)['current_context'].stop()
			button_history.set(button, {color:button_history.get(button)['color'],
									channel:button_history.get(button)['channel'],
									quiet_bool:button_history.get(button)['quiet_bool'],
									current_context:null});
		}
		}}, false);
	//button.addEventListener("touchstart", function () {Play(button)}, false);
	//button.addEventListener('mousedown', function () {Play(button)}, false);
	
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
	deleteButton.style.borderRadius = '100% 100%';
	deleteButton.style.heigth = '100%';
	//deleteButton.style.width = '10%';
	deleteButton.style.flex = '2';
	//deleteButton.style.margin = 'auto';
	deleteButton.addEventListener("touchstart", function(){hasTouched=true;console.log(button.id+'del');deleteThis(button);}, false);
	deleteButton.addEventListener("mousedown", function(){if(!(hasTouched)){console.log(button.id+'del');deleteThis(button);}}, false);
	//deleteButton.addEventListener('mousedown', function(){console.log(`delete ${button.id}`)},false);
	
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
		button_history.set(button, {color:color_select.value, channel: button_history.get(button)['channel'], quiet_bool:button_history.get(button)['quiet_bool'],current_context:button_history.get(button)['current_context']});
		button.style.backgroundColor = button_history.get(button)['color'];}, false);
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
	channel_select.style.margin = 'auto';
	//channel_select.addEventListener("change", function() {console.log('channel_changed!');
	//	button_history.set(button, {color:color_select.value, channel: button_history.get(button)['channel'], quiet_bool:true});}, false);
	buildSelectOptions(channel_select, all_channels);
	bottom_right.appendChild(channel_select);
	
	let channel_label = document.createElement('label');
	channel_label.for = channel_select.name;
	channel_label.innerHTML = 'Channel:'
	channel_label.style.margin = 'auto';
	bottom_left.appendChild(channel_label);
	
	channel_select.addEventListener('input', function(){
		button_history.set(button, {color:button_history.get(button)['color'],
									channel:document.getElementById(channel_select.value),
									quiet_bool:button_history.get(button)['quiet_bool'],
									current_context:button_history.get(button)['current_context']});
	}, false);
	
	//EXIT BUTTON
	let exit = document.createElement('div');
	exit.style.backgroundColor = 'hsl(127, 70%, 50%)';
	exit.style.flex = '12';
	exit.style.border = '1px solid black';
	exit.style.borderRadius = '25% 25%';
	exit.style.height = '90%';
	exit.style.margin = 'auto';
	exit.addEventListener("touchstart", function(){hasTouched=true;console.log(button.id+'exit');editMenu(button,false);}, false);
	exit.addEventListener("mousedown", function(){if(!(hasTouched)){console.log(button.id+'exit');editMenu(button,false);}}, false);
	//exit.addEventListener('mousedown', function(){editMenu(button,false)},false);
	
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
	edit_button.addEventListener("touchstart", function(){hasTouched=true;console.log(button.id+'edit');editMenu(button,true);}, false);
	edit_button.addEventListener("mousedown", function(){if(!(hasTouched)){console.log('this'); editMenu(button,true);}}, false);
	
	button.appendChild(edit_button);
	button_history.set(button, {color:`hsl(${colors['A']}, 100%, 50%)`, channel: null, quiet_bool: false, current_context:null});
	
	document.getElementById('toybox1').appendChild(button);
}

function deleteThis(thing){
	let is_button = button_history.delete(thing);
	let is_channel = channel_history.delete(thing);
	let is_synth = synth_history.delete(thing);
	if (is_button){
		all_buttons[all_buttons.indexOf(thing)] = null;
	} else if (is_channel){
		let handler = all_channels[all_channels.indexOf(thing)];
		all_channels[all_channels.indexOf(thing)] = null;
		//UPDATE CHANNEL OPTIONS FOR ALL BUTTONS
		//error handle here
		for (c in all_buttons){
			if (!(all_buttons[c] === null)){
				buildSelectOptions(document.getElementById(all_buttons[c].id+'ch'), all_channels);
				if (handler == button_history.get(all_buttons[c])['channel']){
					console.log('your channel is dead bro');
					button_history.set(all_buttons[c], {color:button_history.get(all_buttons[c])['color'],
									channel:null,
									quiet_bool:button_history.get(all_buttons[c])['quiet_bool'],
									current_context:button_history.get(all_buttons[c])['current_context']});
					//selected channel needs to reflect truth...might not!
				}
			}
		}
	} else if (is_synth){
		let handler = all_synths[all_synths.indexOf(thing)];
		all_synths[all_synths.indexOf(thing)] = null;
		//UPDATE SYNTH OPTIONS FOR ALL CHANNELS
		//error handle here
		for (c in all_channels){
			if (!(all_channels[c] === null)){
				if (channel_history.get(all_channels[c])['synth_bool']){
					buildSelectOptions(document.getElementById(all_channels[c].id+'s'), all_synths);
					if (handler == channel_history.get(all_channels[c])['synth']){
						console.log('your synth is dead bro');
						channel_history.set(all_channels[c], {label:channel_history.get(all_channels[c])['label'],
										volume:channel_history.get(all_channels[c])['volume'],
										synth_bool:channel_history.get(all_channels[c])['synth_bool'],
										soundfile: channel_history.get(all_channels[c])['soundfile'],
										synth:null
						//selected synth needs to reflect truth...might not!
						});	
					}
				}
			}
		}
	}
	thing.parentNode.removeChild(thing);
}

function editMenu(button, bool){
	//make quiet, hide edit_button, reveal edit menu
	//MAKE QUIET
	if (bool){
		button_history.set(button, {color:button_history.get(button)['color'],
									channel:button_history.get(button)['channel'],
									quiet_bool:true,
									current_context:button_history.get(button)['current_context']});
		document.getElementById(button.id+'e').style.display = 'none';
		document.getElementById(button.id+'cloak').style.display = 'inline-block';
	} else {
		button_history.set(button, {color:button_history.get(button)['color'],
									channel:button_history.get(button)['channel'],
									quiet_bool:false,
									current_context:button_history.get(button)['current_context']});
		document.getElementById(button.id+'e').style.display = '';
		document.getElementById(button.id+'cloak').style.display = 'none';
	}
}

function editMenu_VER_0(button){
	//make quiet, remove edit_button
	button.removeChild(document.getElementById(button.id + 'e'));
	button.style.backgroundColor = 'grey';
	let color = button_history.get(button)['color'];
	let channel = button_history.get(button)['channel'];
	button_history.set(button, {color: color, channel: channel, quiet_bool: true, current_context:button_history.get(button)['current_context']});
	
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
		button_history.set(button, {color:color_select.value, channel: channel, quiet_bool:button_history.get(button)['quiet_bool']});}, false);
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
	let result = `<option value="null">${null}</option>`;
	for (c in array){
		if ((array == soundfile)||(array == freq_names)){
			result += `<option value="${array[c]}">${array[c]}</option>`;
		} else if (!(array[c] === null)){
			result += `<option value="${array[c].id}">${array[c].id}</option>`;
		}
	}
	select_object.innerHTML = result;
}

function createChannel(){
	/*quick note:
	need to handle channel lists of all current buttons at the end of this function
	
	the following elements still need listener events...
	rename - structural issues
	minimize - structural issues
	delete
	radio buttons
	volume
	variable_select
	*/
	
	
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
	
	//LISTENER EVENTS FOR RADIO BUTTONS
	radio_1.addEventListener("touchstart", function(){
		hasTouched=true;
		console.log(radio_1.id);
		buildSelectOptions(document.getElementById(channel.id+'s'),all_synths);
		channel_history.set(channel, 
			{label:channel_history.get(channel)['label'],
				volume:channel_history.get(channel)['volume'],
				synth_bool:true,
				soundfile: null,
				synth:document.getElementById(document.getElementById(channel.id+'s').value)});
	}, false);
	radio_1.addEventListener("mousedown", function(){
		if(!(hasTouched)){
			console.log(radio_1.id);
			buildSelectOptions(document.getElementById(channel.id+'s'),all_synths);
			channel_history.set(channel, 
				{label:channel_history.get(channel)['label'],
					volume:channel_history.get(channel)['volume'],
					synth_bool:true,
					soundfile: null,
					synth:document.getElementById(document.getElementById(channel.id+'s').value)});
		}
	}, false);
	
	radio_2.addEventListener("touchstart", function(){
		hasTouched=true;
		console.log(radio_2.id);
			buildSelectOptions(document.getElementById(channel.id+'s'),soundfile);
			channel_history.set(channel, 
				{label:channel_history.get(channel)['label'],
					volume:channel_history.get(channel)['volume'],
					synth_bool:false,
					soundfile:document.getElementById(channel.id+'s').value,
					synth:null});
			//updating all buttons with this channel
			for (c in all_buttons){
				if (button_history.get(all_buttons[c])['channel']==channel){
					button_history.set(all_buttons[c], {color:button_history.get(all_buttons[c])['color'],
									channel:channel,
									quiet_bool:button_history.get(all_buttons[c])['quiet_bool'],
									current_context:button_history.get(all_buttons[c])['current_context']});
				}
			}
	}, false);
	radio_2.addEventListener("mousedown", function(){if(!(hasTouched)){
		console.log(radio_2.id);
		console.log(radio_2.id);
		buildSelectOptions(document.getElementById(channel.id+'s'),soundfile);
		channel_history.set(channel, 
			{label:channel_history.get(channel)['label'],
				volume:channel_history.get(channel)['volume'],
				synth_bool:false,
				soundfile:document.getElementById(channel.id+'s').value,
				synth:null});
	}}, false);
	
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
	volume.addEventListener('input', function(){
		console.log(`volume=${volume.value}`);
		channel_history.set(channel, 
			{label:channel_history.get(channel)['label'],
				volume:volume.value,
				synth_bool:channel_history.get(channel)['synth_bool'],
				soundfile:channel_history.get(channel)['soundfile'],
				synth:channel_history.get(channel)['synth']});
	}, false);
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
	variable_select.addEventListener('input', function(){
		if (channel_history.get(channel)['synth_bool']){
			console.log('handle synth');
			channel_history.set(channel,
			{label:channel_history.get(channel)['label'],
			volume:channel_history.get(channel)['volume'],
			synth_bool:true,
			soundfile:null,
			synth:variable_select.value});
		} else {
			channel_history.set(channel, 
				{label:channel_history.get(channel)['label'],
					volume:channel_history.get(channel)['volume'],
					synth_bool:false,
					soundfile:document.getElementById(channel.id+'s').value,
					synth:null});
		}
		for (c in all_buttons){
				if (button_history.get(all_buttons[c])['channel']==channel.id){
					button_history.set(all_buttons[c], {color:button_history.get(all_buttons[c])['color'],
									channel:channel,
									quiet_bool:button_history.get(all_buttons[c])['quiet_bool'],
									current_context:button_history.get(all_buttons[c])['current_context']});
				}
			}
	}, false);
	
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
	minButton.addEventListener("touchstart", function(){hasTouched=true;;minimize(channel);}, false);
	minButton.addEventListener("mousedown", function(){if(!(hasTouched)){minimize(channel);}}, false);
	//creating invis
	let invisibility_cloak = document.createElement('div');
	invisibility_cloak.style.display = '';
	invisibility_cloak.id = channel.id+'i';
	invisibility_cloak.style.height = '100%';
	invisibility_cloak.style.width = '100%';
	invisibility_cloak.style.margin = 'auto';
	
	
	let deleteButton = document.createElement('div');
	deleteButton.style.backgroundColor = '#ff0000';
	deleteButton.style.flex = '1';
	deleteButton.style.border = '1px solid black';
	deleteButton.style.borderRadius = '10% 40%';
	deleteButton.style.margin = '2px 2px 2px 2px';
	deleteButton.addEventListener("touchstart", function(){hasTouched=true;console.log(channel.id+'del');deleteThis(channel);}, false);
	deleteButton.addEventListener("mousedown", function(){if(!(hasTouched)){console.log(channel.id+'del');deleteThis(channel);}}, false);
	
	
	let channelName = document.createElement('div');
	channelName.id = channel.id + 'n'
	channelName.innerHTML = channel.id + ' (default name)';
	channelName.style.margin = '5px 5px 5px 5px';
	channelName.style.flex = '15';
	
	banner.appendChild(editButton);
	banner.appendChild(channelName);
	banner.appendChild(minButton);
	banner.appendChild(deleteButton);
	
	invisibility_cloak.appendChild(body);
	
	channel.appendChild(banner);
	channel.appendChild(invisibility_cloak);
	
	//might cause issues assigning variables...
	channel_history.set(channel, {label: channelName.id, volume: volume.value, synth_bool: false, soundfile:variable_select.value, synth: null});
	document.getElementById("toybox2").appendChild(channel);
	
	for (c in all_buttons){
		if (!(all_buttons[c] === null)){
			buildSelectOptions(document.getElementById(all_buttons[c].id+'ch'), all_channels);
		}
	}
}

function minimize(thing){
	/* still in beta
	console.log(`minimizing ${document.getElementById(thing.id+'i')}...`);
	let stat = document.getElementById(thing.id+'i').style.display;
	if (stat== ''){console.log('here');document.getElementById(thing.id+'i').style.display='none';}
	else if (stat == 'none') {console.log('there');document.getElementById(thing.id+'i').style.display='';}
	*/
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
	deleteButton.addEventListener("touchstart", function(){hasTouched=true;console.log(synth.id+'del');deleteThis(synth);}, false);
	deleteButton.addEventListener("mousedown", function(){if(!(hasTouched)){console.log(synth.id+'del');deleteThis(synth);}}, false);
	
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
	buildSelectOptions(freq_select, freq_names);
	freq_select.addEventListener('input', function(){
		//update synth and channel history here
		synth_history.set(synth, {volume:synth_history.get(synth)['volume'], wave_shape:synth_history.get(synth)['wave_shape'], frequency:freq_select.value});
		for (c in all_channels){
			if (channel_history.get(all_channels[c])['synth_bool']){
				if (channel_history.get(all_channels[c])['synth'] == synth.id){
				channel_history.set(all_channels[c], {label:channel_history.get(all_channels[c])['label'],
					volume:channel_history.get(all_channels[c])['volume'],
					synth_bool:channel_history.get(all_channels[c])['synth_bool'],
					soundfile: channel_history.get(all_channels[c])['soundfile'],
					synth:synth.id});	
				}
			}
		}
	}, false);
	
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
	volume.addEventListener('input', function(){
		synth_history.set(synth, {volume:volume.value,
			wave_shape:synth_history.get(synth)['wave_shape'],
		frequency: synth_history.get(synth)['frequency']});
	},false);
	
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
	saw_radio.value = 'sawtooth';
	saw_radio.style.margin = 'auto';
	
	right_column_bottom_left_left.appendChild(saw_radio);
	
	let saw_label = document.createElement('label');
	saw_label.for = saw_radio.name;
	saw_label.innerHTML = 'sawtooth';
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
	
	//RADIO LISTEN EVENTS
	sine_radio.addEventListener('input', function(){
		synth_history.set(synth, {volume:synth_history.get(synth)['volume'], wave_shape:'sine', frequency:synth_history.get(synth)['frequency']});
		for (c in all_channels){
			if (channel_history.get(all_channels[c])['synth_bool']){
				if (channel_history.get(all_channels[c])['synth'] == synth.id){
				channel_history.set(all_channels[c], {label:channel_history.get(all_channels[c])['label'],
					volume:channel_history.get(all_channels[c])['volume'],
					synth_bool:channel_history.get(all_channels[c])['synth_bool'],
					soundfile: channel_history.get(all_channels[c])['soundfile'],
					synth:synth.id});	
				}
			}
		}
	}, false);
	square_radio.addEventListener('input', function(){
		synth_history.set(synth, {volume:synth_history.get(synth)['volume'], wave_shape:'square', frequency:synth_history.get(synth)['frequency']});
		for (c in all_channels){
			if (channel_history.get(all_channels[c])['synth_bool']){
				if (channel_history.get(all_channels[c])['synth'] == synth.id){
					console.log('square checkin');
				channel_history.set(all_channels[c], {label:channel_history.get(all_channels[c])['label'],
					volume:channel_history.get(all_channels[c])['volume'],
					synth_bool:channel_history.get(all_channels[c])['synth_bool'],
					soundfile: channel_history.get(all_channels[c])['soundfile'],
					synth:synth.id});	
				}
			}
		}
	}, false);
	saw_radio.addEventListener('input', function(){
		synth_history.set(synth, {volume:synth_history.get(synth)['volume'], wave_shape:'sawtooth', frequency:synth_history.get(synth)['frequency']});
		for (c in all_channels){
			if (channel_history.get(all_channels[c])['synth_bool']){
				if (channel_history.get(all_channels[c])['synth'] == synth.id){
				channel_history.set(all_channels[c], {label:channel_history.get(all_channels[c])['label'],
					volume:channel_history.get(all_channels[c])['volume'],
					synth_bool:channel_history.get(all_channels[c])['synth_bool'],
					soundfile: channel_history.get(all_channels[c])['soundfile'],
					synth:synth.id});	
				}
			}
		}
	}, false);
	tri_radio.addEventListener('input', function(){
		//update synth history and update channel history
		synth_history.set(synth, {volume:synth_history.get(synth)['volume'], wave_shape:'triangle', frequency:synth_history.get(synth)['frequency']});
		for (c in all_channels){
			if (channel_history.get(all_channels[c])['synth_bool']){
				if (channel_history.get(all_channels[c])['synth'] == synth.id){
				channel_history.set(all_channels[c], {label:channel_history.get(all_channels[c])['label'],
					volume:channel_history.get(all_channels[c])['volume'],
					synth_bool:channel_history.get(all_channels[c])['synth_bool'],
					soundfile: channel_history.get(all_channels[c])['soundfile'],
					synth:synth.id});	
				}
			}
		}
	}, false);
	
	
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
	
	synth_history.set(synth, {volume:volume.value, wave_shape:'sine', frequency:null});	
	document.getElementById('toybox3').appendChild(synth);
}

//down here, at the bottom of this world, we shall forge a paradise
//BUT BEFORE WE START, some context.
/*
the document above has buttons. the button will run a function when clicked, and call on a channel.

the channel when called on will provide volume and EITHER a soundfile, OR a synth.

the synth when called on will provide volume, a waveform, and frequency.

look into managing button presses with MOUSEUP and TOUCHEND events...

DONE! buttons all now have MOUSEUP/TOUCHEND event handlers with a current_context in their histories.

/////
button_history.set(button, {color:button_history.get(button)['color'],
									channel:button_history.get(button)['channel'],
									quiet_bool:button_history.get(button)['quiet_bool'],
									current_context:null});
\\\\\
*/
/*
let audioContext = new (window.AudioContext || window.webkitAudioContext)();
//let oscList = [];
let mainGainNode = null;
mainGainNode = audioContext.createGain();
mainGainNode.connect(audioContext.destination);*/

//let keyboard = document.querySelector(".keyboard"); //still useful?
//let wavePicker = document.querySelector("select[name='waveform']"); //from synth?
//let volumeControl = document.querySelector("input[name='volume']"); //can we make this from synth?
//let sineTerms = null;
//let cosineTerms = null;


function playSynth(synth, button){
	var audioContext = new AudioContext();
	
	var mainGainNode = audioContext.createGain();
	mainGainNode.gain.value = synth_history.get(synth)['volume'];
	mainGainNode.connect(audioContext.destination);
	
	let osc = audioContext.createOscillator();
	osc.connect(mainGainNode);
	
	let type = synth_history.get(synth)['wave_shape'];
	console.log(type === 'sawtooth');
	osc.type = type;
	osc.frequency.value = freq_values[synth_history.get(synth)['frequency']];
	console.log(osc);
	osc.start();

	button_history.set(button,
		{color:button_history.get(button)['color'],
		channel:button_history.get(button)['channel'],
		quiet_bool:button_history.get(button)['quiet_bool'],
		current_context: osc});	
	
}
