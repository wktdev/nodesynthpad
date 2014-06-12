var audioContext;
if (typeof AudioContext !== "undefined") {
    audioContext = new AudioContext();
} else if (typeof webkitAudioContext !== "undefined") {
    audioContext = new webkitAudioContext();
} else if (typeof mozAudioContext !== "undefined") {
    audioContext = new webkitAudioContext();
} else {
    throw new Error('AudioContext not supported');
}

"use strict"
$(function() {
    var MODULE = (function() {

        var synth = {
            idCounter: null,
            synthName: null,

            makeNewSynth: function() {
                $('#new-synth').click(function(event) {
                    event.preventDefault();
                    synth.createDiv();

                });

            },

            synthPatch: {

                "patchName": "",
                "synths": [

                ],
                // "synth_octave_pitch_sliders": [

                // ],

                "synthNotePitchSliders": [

                ]
            },

            clearSynths: function() {
                $("#clear-synths").click(function(event) {
                    event.preventDefault();
                    $(".synthDiv").remove();

                });

            },

            makeNewPatch: function() {
                $("#submit-patch").click(function(event) {
                    event.preventDefault();
                    synth.synthPatch.synths.length = 0;
                    synth.synthPatch.synthNotePitchSliders.length = 0;
                    var patchNameOf = document.getElementById('patch-name').value;
                    synth.synthPatch.patchName = patchNameOf;
                    // console.log(synth.synthPatch)



                    $(".synthDiv").each(function() { // finds all divs with class .synth and gets their individual ID and Left/Top CSS positional values
                        var temp = $("#" + this.id);
                        var pos = $(temp).position();



                        synth.synthPatch.synths.push({ // Pushed the synths to a json object called 'synthPatch.synths'
                            'synth_name': this.id,
                            'xpos': pos.left,
                            'ypos': pos.top
                        });


                    });


                    /******************************************************************/


                    $(".oscNoteValueInput").each(function() { // finds all sliders by class and get their ID and slider value
                        var temp = $("#" + this.id);
                        var sliderPitchValue = temp.val();
                        console.log(sliderPitchValue)


                        synth.synthPatch.synthNotePitchSliders.push({
                            'synthNotePitchSliderName': this.id,
                            'synthNotePitchSliderValue': sliderPitchValue

                        });


                    });

                    /****************************************************************/









                    $.ajax({
                        type: 'POST',
                        data: JSON.stringify(

                            synth.synthPatch
                        ), // has to be a property of a property in the synth schema
                        contentType: 'application/json',
                        url: '/',
                        success: function(datastuff) {
                            $.ajax({
                                url: "/returneddata"
                            }).done(function(returnedJSON) {

                                $("#application-patch-list li").remove();

                                synth.getPatchList();


                            });

                        }
                    });



                    console.log(synth.synthPatch)
                });




            },
            getPatchList: function() {
                $.ajax({
                    url: "/returneddata"
                }).done(function(returnedJSON) {

                    // console.log(returnedJSON.docs);

                    for (i = 0; i < returnedJSON.docs.length; i += 1) {
                        $("#application-patch-list").append("<li><a class= 'patch_url' href=/patch/" +
                            returnedJSON.docs[i]._id + ">" + returnedJSON.docs[i].patchName + "</a></li>");
                    }

                    var list = $('#application-patch-list');
                    var listItems = list.children('li');
                    list.append(listItems.get().reverse());

                    // after you load the search results ...
                    $('#application-patch-list').children('li').slice(15).hide();

                });
            },

            getCurrentPatch: function() {
                $.ajax({
                    url: "/loadedpatch"
                }).done(function(returnedJSON) {

                    // console.log(returnedJSON.docs);
                    // console.log(returnedJSON.docs[0].patchName);
                    // console.log(returnedJSON.docs[0].synths.length);

                    for (i = 0; i < returnedJSON.docs[0].synths.length; i += 1) {

                        console.log(returnedJSON.docs[0].synths[i].synth_name)


                        var synthDiv = document.createElement("div");
                        synthDiv.className = "synthDiv";
                        synthDiv.id = returnedJSON.docs[0].synths[i].synth_name;
                        var applicationArea = document.getElementById('application-area');
                        $(synthDiv).fadeIn(1000);
                        applicationArea.appendChild(synthDiv);



                        $(synthDiv).draggable({
                            containment: applicationArea
                        });






                        console.log(returnedJSON.docs[0].synths[i].xpos)
                        $(synthDiv).css("left", returnedJSON.docs[0].synths[i].xpos + "px");
                        $(synthDiv).css("top", returnedJSON.docs[0].synths[i].ypos + "px");




                        synthDiv.onmouseover = function() {
                            oscillator = audioContext.createOscillator();
                            oscillator.type = 'sawtooth';
                            oscillator.frequency.value = 100;
                            oscillator.connect(audioContext.destination);
                            oscillator.start(0);

                        }




                        synthDiv.onmouseout = function() {
                            oscillator.stop();

                        };



                        // Create handles for divSynths //
                        var synthDivHandle = document.createElement("div");
                        synthDivHandle.className = "synthDivHandle";
                        synthDivHandle.id = "handle-" + (Math.random().toString(36).slice(2));
                        synthDiv.appendChild(synthDivHandle);


                        $(synthDiv).draggable({
                            handle: synthDivHandle
                        });
                        synthDivHandle.onmousemove = function() {
                            oscillator.stop(0)
                        }

                        synth.onmouseout = function() {
                            oscillator.stop(0);

                        };

                    };






                });
            },

            createDiv: function() {
                var synthDiv = document.createElement("div");
                synthDiv.className = "synthDiv";
                synthDiv.id = "synthDiv" + "-" + (Math.random().toString(36).slice(2));
                var applicationArea = document.getElementById('application-area');
                var body = document.getElementsByName('body');



                // osc Note Value Slider Creation.
                var oscNoteValueInput = document.createElement('input');
                oscNoteValueInput.type = "range";
                oscNoteValueInput.min = '100';
                oscNoteValueInput.max = '1200';
                oscNoteValueInput.step = '100';
                // oscNoteValueInput.value = synthQueForLoad[i][3]; 
                oscNoteValueInput.className = "oscNoteValueInput";
                oscNoteValueInput.id = "oscNoteValueInput_" + synthDiv.id;
                synthDiv.appendChild(oscNoteValueInput);




                // Create handles for divSynths //
                var synthDivHandle = document.createElement("div");
                synthDivHandle.className = "synthDivHandle";
                synthDivHandle.id = "handle-" + (Math.random().toString(36).slice(2));;
                synthDiv.appendChild(synthDivHandle);



                // $(html).hide().appendTo("#mycontent").fadeIn(1000);
                $(synthDiv).hide().appendTo(applicationArea).fadeIn(1000);
                $(synthDiv).draggable({
                    containment: applicationArea
                });



                synthDiv.onmouseover = function() {
                    oscillator = audioContext.createOscillator();
                    oscillator.type = 'sawtooth';
                    oscillator.frequency.value = oscNoteValueInput.value;
                    oscillator.connect(audioContext.destination);
                    oscillator.start(0);
                }


                synthDiv.onmouseout = function() {
                    oscillator.stop();

                };

                $(synthDiv).draggable({
                    handle: synthDivHandle
                });
                synthDivHandle.onmousemove = function() {
                    oscillator.stop(0)
                }

                synth.onmouseout = function() {
                    oscillator.stop(0);

                };




            },

            getUrlPatchID: function() {
                var pathArray = window.location.pathname.split('/');
                var patchIDfromURL = pathArray[2];
                console.log(patchIDfromURL);


                $.ajax({
                    type: 'GET',
                    data: patchIDfromURL,
                    contentType: 'application/json',
                    url: '/',
                    success: function(datastuff) {


                    }
                });

            },







            init: function() {
                this.getPatchList();
                this.makeNewSynth();
                this.makeNewPatch();
                this.getCurrentPatch();
                this.getUrlPatchID();
                this.clearSynths();


            }


        }
        return synth

    }());

    var newSynth = MODULE;
    newSynth.init();

});