var express = require('express');
var app = express();
var body_parser = require('body-parser');
var $ = require('jQuery');
var registro = require('./main');
const path = require('path');
const router = express.Router();

var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);

app.use(body_parser.urlencoded({ extended: true }));

// Running Server Details.
var server = app.listen(8000, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at %s:%s Port", host, port);

});
app.use('/', router);
app.use('/css', express.static(__dirname + '/css'));
app.use('/img', express.static(__dirname + '/img'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));


app.post('/registerNote', function(req, res) {
    let cStudent = req.body.cStudent;
    let period = req.body.period;
    let cSubject = req.body.cSubject;
    let nMin = req.body.nMin;
    let nMax = req.body.nMax;
    let observation = req.body.observation;
    if (registro.registro(cStudent, period, cSubject, nMin, nMax, observation)) {
        res.send('ok');
    }


});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
app.get('/registerNote', function(req, res) {
    res.sendFile(path.join(__dirname + '/register.html'));
});