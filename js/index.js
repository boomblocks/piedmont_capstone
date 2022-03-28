let x = 360/7
let colors = {'A':x, 'B':x * 2, 'C':x * 3, 'D':x * 4, 'E':x * 5, 'F':x * 6, 'G':0};
/*
function get_color(colors,value){
	let start = colors;
	let howmanytimescolorsrollover = Math.abs(parseInt(value/255));
	let remaindertodealwith = value % 255;
	if ((value == Math.abs(value))||(value = 0)){
		var is_positive = true;
		
	} else {
		var is_positive = false;
	}
	for (howmanytimescolorsrollover;howmanytimescolorsrollover>0;howmanytimescolorsrollover-=1){
		//there is one guaranteed to be full
		//in each of the following steps, 255 is added.
		if (start[0] == 255){
			//if red is full, then a positive VALUE means either
			//we are leaving purple or going to green
			if (start[2] > 0){
				//there is some blue, this means green is empty
				//red will not lose any value in a 255 step
				if (is_positive){
					//this means going towards green
					//blue will equal zero
					start[1] = 255 - start[2];
					start[2] = 0;
				} else {
					//this means going towards blue
					start[0] = 255 - start[2];
					start[2] = 255
				} 
			} else if (start[1] > 0){
				//There is some green
				if (is_positive){
					start[0] = 255 - start[1];
					start[1] = 255;
				} else {
					start[2] = 255 - start[1];
					start[1];
				}
			}else{
				if (is_positive){
					start[1] = 255;
				} else {
					start[2] = 255;
				}
			}
		} else if (start[1] == 255){
			//green is full
			if (start[0] > 0){ //previous color is not empty
				if (is_positive){
					start[2] = 255 - start[0];//next color filling
					start[0] = 0; // previous color drained
				} else {
					start[1] = 255 - start[0]; //current color draining
					start[0] = 255; //previous color filled
				}
			} else if (start[2] > 0){ //next color is not empty
				if (is_positive){
					start[1] = 255 - start[2]; //current color draining
					start[2] = 255; //next color filled
				} else {
					start[0] = 255 - start[2]; //previous color filling
					start[2] = 0; //next color drained
				}
			} else {
				if (is_positive){
					start[2] = 255; 
				} else {
					start[0] = 255;
				}
			}
		} else if (start[2] == 255){
			if (start[1] > 0){
				if (is_positive){
					start[0] = 255 - start[1];
					start[1] = 0;
				} else {
					start[2] = 255 - start[1];
					start[1]; 255;
				}
			} else if (start[0] > 0){
				if (is_positive){
					start[2] = 255 - start[0];
					start[0] = 255;
				} else {
					start[1] = 255 - start[2];
					start[0] = 0;
				}
			} else {
				if (is_positive){
					start[0] = 255;
				} else {
					start[1] = 255;
				}
			}
		}
	}
	//now there is a remaindertodealwith.
	while(remaindertodealwith != 0){
		if (start[0] == 255){
			if (start[2] > 0){
				if (is_positive){
					start[1] = 255 - start[2];
					start[2] = 0;
				} else {
					start[0] = 255 - start[2];
					start[2] = 255
				} 
			} else if (start[1] > 0){
				if (is_positive){
					start[0] = 255 - start[1];
					start[1] = 255;
				} else {
					start[2] = 255 - start[1];
					start[1];
				}
			}else{
				if (is_positive){
					start[1] = 255;
				} else {
					start[2] = 255;
				}
			}
		} else if (start[1] == 255){
			if (start[0] > 0){ //previous color is not empty
				if (is_positive){
					//first drain previous color. add what is left to next.
					let remaindertodealwith - 
					start[2] = 255 - start[0];//next color filling
					start[0] = 0; // previous color drained
				} else {
					start[1] = 255 - start[0]; //current color draining
					start[0] = 255; //previous color filled
				}
			} else if (start[2] > 0){ //next color is not empty
				if (is_positive){
					start[1] = 255 - start[2]; //current color draining
					start[2] = 255; //next color filled
				} else {
					start[0] = 255 - start[2]; //previous color filling
					start[2] = 0; //next color drained
				}
			} else {
				if (is_positive){
					start[2] = 255; 
				} else {
					start[0] = 255;
				}
			}
		} else if (start[2] == 255){
			if (start[1] > 0){
				if (is_positive){
					start[0] = 255 - start[1];
					start[1] = 0;
				} else {
					start[2] = 255 - start[1];
					start[1]; 255;
				}
			} else if (start[0] > 0){
				if (is_positive){
					start[2] = 255 - start[0];
					start[0] = 255;
				} else {
					start[1] = 255 - start[2];
					start[0] = 0;
				}
			} else {
				if (is_positive){
					start[0] = 255;
				} else {
					start[1] = 255;
				}
			}
		}
	}
	
	return start;
}

/*
RULE: At least one is full.

Take these two processes:
	-shave off the difference
	-add 255 to either R, G, or B
	




to subtract x from red...
	if green is full, 





*/

function makeMozilla() {
	let audioContext = new (window.AudioContext || window.webkitAudioContext)();
	let oscList = [];
	let mainGainNode = null;
	
	let keyboard = document.querySelector(".keyboard");
	let wavePicker = document.querySelector("select[name='waveform']");
	let volumeControl = document.querySelector("input[name='volume']");

	let noteFreq = null;
	let customWaveform = null;
	let sineTerms = null;
	let cosineTerms = null;

	function createNoteTable() {
		let noteFreq = [];
		for (let i=0; i< 9; i++) {
			noteFreq[i] = [];
		}
		
		let noteNames = ['A', 'A#', 'B', 'C', 'C#',
		'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
		var prev_frequency = 25.95654359874657;
		for (const x in noteFreq) {
			for (const y in noteNames){
				var freqValue = prev_frequency * (2**(1/12));
				prev_frequency = freqValue;
				noteFreq[x][noteNames[y]] = freqValue;
			}
		}
		return noteFreq
	}

	function setup() {
		noteFreq = createNoteTable();
		
		volumeControl.addEventListener("change", changeVolume, false);
		
		mainGainNode = audioContext.createGain();
		mainGainNode.connect(audioContext.destination);
		mainGainNode.gain.value = volumeControl.value;
		
		//Create the keys, separate into octave divs
		noteFreq.forEach(function(keys, idx) {
			let keyList = Object.entries(keys);
			let octaveElem = document.createElement("div");
			octaveElem.className = "octave";
			
			keyList.forEach(function(key) {
				if (key[0].length == 1) {
					octaveElem.appendChild(createKey(key[0], idx, key[1]));
					
				}
			});
			keyboard.appendChild(octaveElem);
		});
		document.querySelector("div[data-note='B'][data-octave='5']").scrollIntoView(false);
		sineTerms = new Float32Array([0, 0, 1, 0, 1]);
		cosineTerms = new Float32Array(sineTerms.length);
		customWaveform = audioContext.createPeriodicWave(cosineTerms, sineTerms);
		for (i=0; i<9; i++) {
			oscList[i] = {};
		}
	}

	function createKey(note, octave, freq) {
	  let keyElement = document.createElement("div");
	  let labelElement = document.createElement("div");

	  keyElement.className = "key";
	  keyElement.dataset["octave"] = octave;
	  keyElement.dataset["note"] = note;
	  keyElement.dataset["frequency"] = freq;

	  labelElement.innerHTML = note + "<sub>" + octave + "</sub>";
	  keyElement.appendChild(labelElement);
	  keyElement.id = String(note) + String(octave);//`${note}${octave}`
	  keyElement.addEventListener("mousedown", notePressed, false);
	  keyElement.addEventListener("mouseup", noteReleased, false);
	  keyElement.addEventListener("mouseover", notePressed, false);
	  keyElement.addEventListener("mouseleave", noteReleased, false);
	  let value = 0;
	  keyElement.style.backgroundColor = `hsl(${colors[note]}, 100%, 50%)`; //Need to define value
	  return keyElement;
	}

	function playTone(freq) {
	  let osc = audioContext.createOscillator();
	  osc.connect(mainGainNode);

	  let type = wavePicker.options[wavePicker.selectedIndex].value;

	  if (type == "custom") {
		osc.setPeriodicWave(customWaveform);
	  } else {
		osc.type = type;
	  }

	  osc.frequency.value = freq;
	  osc.start();

	  return osc;
	}

	function notePressed(event) {
	  if (event.buttons & 1) {
		let dataset = event.target.dataset;

		if (!dataset["pressed"]) {
		  let octave = +dataset["octave"];
		  oscList[octave][dataset["note"]] = playTone(dataset["frequency"]);
		  dataset["pressed"] = "yes";
		}
	  }
	}

	function changeVolume(event) {
	  mainGainNode.gain.value = volumeControl.value
	}

	function noteReleased(event) {
	  let dataset = event.target.dataset;

	  if (dataset && dataset["pressed"]) {
		let octave = +dataset["octave"];
		oscList[octave][dataset["note"]].stop();
		delete oscList[octave][dataset["note"]];
		delete dataset["pressed"];
	  }
	}
	setup();
}
function changeHue(init, callback) {
	const result = init + 1;
	callback(result);
}
function changeSat(init, callback) {
	const result = init + 2;
	callback(result);
}
function changeLit(init, callback) {
	const result = init + 3;
	callback(result);
}
function changeColor() {
	changeHue(0, result1 => {
		changeSat(result1, result2 => {
			changeLit(result2, result3 => {
				console.log("result: "+String(result3));
			});
		});
	});
}
/*
function wow(){
	let timer = 0;
	let color = 0;
	while (true){
		var key = document.getElementById("A0");
		key.style.backgroundColor = "hsl("+String(color + (timer % 360)) + ", 100%, 50%)";
		console.log("hsl("+String(color + (timer % 360)) + ", 100%, 50%)");
		timer += 1;
	}	
	
}
*/
/*---------------^from Mozilla above^----------------------*/
var all_channels = [null];
var all_synths = [null];
var all_buttons = [null];
var all_wav_files = [];

function BuildWavFiles(){
	//
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

function AddButton() {
	var number = NextNull(all_buttons);
	var sumber = number.toString();
	//open div tag
	var txt = '<div id="bu_' + sumber + '">';
	//Play button tag
	txt += '<button onmousedown="PlayButton('+sumber+');">' + sumber + '</button>';
	//Remove button tag
	txt += '<button onclick="RemoveButton('+sumber+');">Remove</button>';
	//close div tag
	txt += '</div>';
	document.getElementById('button').innerHTML += txt;
	all_buttons[number] = "bu_"+sumber;
	//add itself to all current channels
	for (const x in all_channels){
		if (!(all_channels[x]===null)){
			BuildButtonOptions(x);
		}
	}
}

function RemoveButton(index) {
	//remove channel physically from HTML document
	document.getElementById(all_buttons[index]).parentNode.removeChild(document.getElementById(all_buttons[index]));
	//make spot open in buttons list
	all_buttons[index]=null
	if (all_buttons[all_buttons-1]===null){
		all_buttons.pop()
	}
	//remove button option from all channels
	for (const x in all_channels) {
		if (!(all_channels[x]===null)){
			//update channel options
			BuildButtonOptions(x);
		}
	}
}

function PlayButton(index){
	/*
	for x in all_channels:
		if x.value == red:
			//sound should play
	*/
};

//These bozos need doctoring...
function AddChannel() {
	var number = NextNull(all_channels);
	var sumber = number.toString();
	//open div tag
	var txt = '<div id="ch_' + sumber + '">';
    //input range
	txt += '<input type="range" min=0 max=100 value=100>';
	//input button options
	txt += '<select id="ch_' + sumber +  '_sel"></select>';
    txt += '<button id="ch_' + sumber + '_rem" onclick="RemoveChannel('+sumber+');">Remove</button>';
	//close div tag
	txt += '</div>';
	document.getElementById('channel').innerHTML += txt;
	all_channels[number] = "ch_"+sumber;
	BuildButtonOptions(number);
	//add itself to all current synths
	for (const x in all_synths){
		if (!(all_synths[x]===null)){
			BuildChannelOptions(x);
		}
	}
	//NOT DONE
};

function RemoveChannel(index) {
	//remove channel physically from HTML document
	document.getElementById(all_channels[index]).parentNode.removeChild(document.getElementById(all_channels[index]));
	//make spot open in channels list
	all_channels[index]=null
	if (all_channels[all_channels-1]===null){
		all_channels.pop()
	}
	//remove channel option from all synths
	for (const x in all_synths) {
		if (!(all_synths[x]===null)){
			//update channel options
			BuildChannelOptions(x);
		}
	}
}

function BuildChannelOptions(index){
	//clear channel options under the select tag
	document.getElementById(all_synths[index]+"_sel").innerHTML = '';
	for (const x in all_channels){
		if (!(all_channels[x]===null)){
			let txt = '<option>'+all_channels[x]+'</option>';
			document.getElementById(all_synths[index]+"_sel").innerHTML += txt;
		}
	}
}

function BuildButtonOptions(index){
	//clear channel options under the select tag
	document.getElementById(all_channels[index]+"_sel").innerHTML = '';
	for (const x in all_buttons){
		if (!(all_buttons[x]===null)){
			let txt = '<option>'+all_buttons[x]+'</option>';
			document.getElementById(all_channels[index]+"_sel").innerHTML += txt;
		}
	}
}

function AddSynth() {
	var number = NextNull(all_synths);
	var sumber = number.toString();
	//open div tag
	var txt = '<div id="sy_' + sumber + '">';
    //input radio
	txt += '<input type="radio" name="wave-shape_' + sumber + '" value="sine" checked="checked">';
	txt += '<input type="radio" name="wave-shape_' + sumber + '" value="square">';
	txt += '<input type="radio" name="wave-shape_' + sumber + '" value="saw">';
	txt += '<input type="radio" name="wave-shape_' + sumber + '" value="triangle">';
	//input range
	txt += '<input type="range" min=0 max=100 value=100>';
	//channels
	txt += '<select id="sy_'+ sumber +'_sel">';
	for (const x in all_channels){
		if (!(all_channels[x]===null)){
			txt += '<option>'+all_channels[x]+'</option>'
		}
	}
	txt += '</select>'
    txt += '<button id="sy_' + sumber + '_rem" onclick="RemoveSynth('+sumber+');">Remove</button>';
	//close div tag
	txt += '</div>';
	document.getElementById('synth').innerHTML += txt;
	all_synths[number] = "sy_"+sumber;
};

function RemoveSynth(index) {
	//remove synth physically from HTML document
	document.getElementById(all_synths[index]).parentNode.removeChild(document.getElementById(all_synths[index]));
	//make spot open in synths list
	all_synths[index]=null
	//notify channels
}

function SoundPrep(){
	for (i=0;i<all_synths.length;i++) {
		//Acknowledge where synths send sound
		//let wav_file = wav_array[synth_pitch][synth_wave-shape][synth_pattern]
		
	};
	for (i=0;i<all_channels.length;i++)  {
		if (!(all_channels[i] === null)){
			//Acknowledge where channels send sound
			let listy = document.getElementById("ch_"+ i.toString() +"_sel");
			let chan_button = listy.options[listy.selectedIndex].text;
			//use this string to index something
			
		};
	};
};