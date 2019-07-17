var express = require('express');
var app = express();
var body_parser = require('body-parser');
var registro = require('./main');
const path = require('path');
const router = express.Router();

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


app.post('/reg', function(req, res) {

    let nota = req.body.nMin;
    res.send('<h1>La nota es:' + registro.registro(nota) + '</h1>');

});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
app.post('/registerNote', function(req, res) {
    res.sendFile(path.join(__dirname + '/register.html'));
});