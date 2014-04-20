
 
    audioContext = new webkitAudioContext();
    var MODULE = (function() {

        var synth = {
            idCounter: null,
            synthName: null,

            getNameFromForm: function() {
                $('#submit-synth').click(function(event) {
                    event.preventDefault();
                    synthName = document.getElementById('synth-name').value;
                    synth.createDiv();
                });

            },


            createDiv: function() {
                var synthDiv = document.createElement("div");
                synthDiv.className = "synth";
                synthDiv.id = "synth" + (this.idCounter++);
                var applicationArea = document.getElementById('application-area');
                var body = document.getElementsByName('body');
                applicationArea.appendChild(synthDiv);
                $(synthDiv).draggable({ });
          
                synthDiv.onmousedown = function(){
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
                this.getNameFromForm();
                this.createDiv();
            }


        }
        return synth

    }());

    var newSynth = MODULE;
    newSynth.init();
   

   