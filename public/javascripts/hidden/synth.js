 audioContext = new webkitAudioContext();

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

                 ]
                 // "synth_octave_pitch_sliders": [

                 // ],

                 // "synth_note_pitch_sliders": [

                 // ],


             },





             makeNewPatch: function() {
                 $("#submit-patch").click(function(event) {
                     event.preventDefault();
                     synth.synthPatch.synths.length = 0;
                     var patchNameOf = document.getElementById('patch-name').value;
                     synth.synthPatch.patchName = patchNameOf;
                     // console.log(synth.synthPatch)



                     $(".synthDiv").each(function() { // finds all divs with class .synth and gets their individual ID and Left/Top CSS positional values
                         var temp = $("#" + this.id);
                         var pos = $(temp).position();



                         synth.synthPatch.synths.push({
                             'synth_name': this.id,
                             'xpos': pos.left,
                             'ypos': pos.top
                         });


                     });

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


                                 console.log(returnedJSON.docs);
                                 for (i = 0; i < returnedJSON.docs.length; i += 1)
                                     $("#application-area").append("<p>" + returnedJSON.docs[i].patchName + "</p>");

                             });

                         }
                     });



                     // console.log(synth.patch);
                 });




             },
             getPatchList: function() {
                 $.ajax({
                     url: "/returneddata"
                 }).done(function(returnedJSON) {

                     console.log(returnedJSON.docs);

                     for (i = 0; i < returnedJSON.docs.length; i += 1)
                         $("#application-area").append("<a href=/patch" + "/" +
                             returnedJSON.docs[i]._id + ">" + returnedJSON.docs[i].patchName + "</a>");


                 });
             },

             createDiv: function() {
                 var synthDiv = document.createElement("div");
                 synthDiv.className = "synthDiv";
                 synthDiv.id = "synthDiv" + (this.idCounter++);
                 var applicationArea = document.getElementById('application-area');
                 var body = document.getElementsByName('body');
                 applicationArea.appendChild(synthDiv);
                 $(synthDiv).draggable({});

                 synthDiv.onmousedown = function() {
                     oscillator = audioContext.createOscillator();
                     oscillator.type = 'sawtooth';
                     oscillator.frequency.value = 300;
                     oscillator.connect(audioContext.destination);
                     oscillator.start(0);
                 }


                 synthDiv.onmouseup = function() {
                     oscillator.stop();

                 };

             },


             init: function() {
                 this.getPatchList();
                 this.makeNewSynth();
                 this.makeNewPatch();

             }


         }
         return synth

     }());

     var newSynth = MODULE;
     newSynth.init();

 });