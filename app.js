// START  Module dependencies.

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var formidable = require('formidable');
var util = require('util');
var app = express();
// END module dependencies

// START genera setup all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public'))); // static path for html/javascript and css. This is a directory for front end files.


mongoose.connect('mongodb://localhost/supersynth'); // Set mongoDB database to push to


var db = mongoose.connection;


db.on('error', console.error.bind(console, 'connection error:')); // Verify mong/mongoose connection
db.once('open', function callback() {
    console.log('mongo/mongoose connected')
});
http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));


});

// END general setup



// START Schema & Models

var synthSchema = mongoose.Schema({
    patchName: String,
    synths: Object,

});

var SynthObject = mongoose.model('SynthObject', synthSchema);



app.get('/', function(req, res) { // ***HOMEPAGE***  Route a view file ( html or jade) to the '/' directory 
    res.render('synth');
});




app.post('/', function(req, res) {
    var synthJSON = new SynthObject(req.body); // req.body holds parameters that are sent up from the client as part of a POST request
    synthJSON.save(function(err) {
        if (!err) {
            console.log(synthJSON);

            res.redirect('/');
        } else {
            throw err;
        }
    });
});









app.get('/returnedData', function(req, res) {
    SynthObject.find({}, function(err, docs) {
        res.render('returnedData', {
            title: 'Tasks index view',
            docs: docs
        });
    });
});