Sound Synth Site
================
The goal of this site was simple, so the functions that built it are as well!
Buttons are generated in the top box. They are set to call on a specific channel.
Channels are generated in the bottom left box. They either play a soundfile, or call on a Synth to play sound.
Synths are comprised of wave-shape and frequency options. These Buttons, Channels, and Synths come together
to allow users to program their own soundboard! (however limited and cumbersome it is). The following items
are javascript functions that do all of the building and operating of the site.

**createButton** Adds a new button to the top container of the page
**createChannel** Adds a new channel to the bottom left container of the page
**createSynth** Adds a new synth to the bottom right container of the page
**createNoteTable** Returns a variety of Note-related tables depending on the given string
**NextNull** Finds the first element in an array that is null
**DeleteThis** Recieves a button, channel, or synth, and fully deletes it
**editMenu** Visually and functionally updates a button to an edit mode
**stringToHsl** Parses a string for HSL values, returns an array of 3 values
**hslToRGB** Recieves an array of HSL values, returns an RGB string
**RGBtoHex** Recieves an RGB string, returns a hex value
**buildSelectOptions** recieves a list of strings and a select HTML input, writes in those strings as options
**playSynth** Recieves a button, creates the proper audio contexts and plays the synth correlating to chosen settings
**shuffle_colors** Rotates the list of colors
**update_colors** Returns the correct color value for a given item
**randomColor** Returns a random color