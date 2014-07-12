

This is a synth experiment where users can create and playback oscillators at different pitches. Delay length and amount are used as two global effects.
Uses Node.js, Express and MongoDB to save state in the form of user created "patches".

You need to have a running instance of mongoDB active as well as all the depndencies installed. I need to add a package.json file as this repo is missing it (oops). This software was built with express 3.x and to run it use:   node app    NOT npm start. For some reason the latter doesn't work


![Alt text](https://raw.githubusercontent.com/wktdev/nodesynthpad/master/public/images/img.PNG)
