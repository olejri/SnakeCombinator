var http = require("http");
var express = require('express');

var app = express();
var server = http.createServer(app);

var sys = require('sys')
var exec = require('child_process').exec;


server.listen(8888);

console.log('Server listen @ 8888');



app.get('/', function (req, res) {
	res.sendfile(__dirname + '/frontpage.html');
});


app.get('/test', function (req, res) {
	res.sendfile(__dirname + '/secondPage.html');
});


app.use(express.static(__dirname + '/'));

// SERVER
app.use(express.bodyParser());
app.post('/startnode', function(req, res) {
        // Hent ut data fra req.body
        //var username = req.body.username;
		
        startnode();
        // ...
        // Svar
        res.contentType('json');
        res.send({response: 'good shit'});     
});





function startnode() {
	console.log("Trying to spawn node js server");
	child = exec("node ../server/server.js", function (error, stdout, stderr) {
		sys.print('stdout: ' + stdout);
		sys.print('stderr: ' + stderr);
		if (error !== null) {
			console.log('exec error: ' + error);
		}
	});
	
}

	 
