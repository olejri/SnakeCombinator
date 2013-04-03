var http = require("http");
var express = require('express');

var app = express();
var server = http.createServer(app);

var sys = require('sys')
var exec = require('child_process').exec;

app.configure(function(){
	  app.use(express.bodyParser());
});

//var myArgs = process.argv.slice(2);
//console.log('myArgs: ', myArgs);


//server listen @ 8888
server.listen(8888);

console.log('Server listen on port: 8888');



app.get('/', function (req, res) {
	res.sendfile(__dirname + '/public/gamemenu.html');
});


app.get('/hostgame', function (req, res) {
	res.sendfile(__dirname + '/public/hostgame.html');
});

app.get('/gamelobby', function (req, res) {
	res.sendfile(__dirname + '/public/gamelobby.html');
});

app.get('/levelmanager', function (req, res) {
	res.sendfile(__dirname + '/public/levelmanager.html');
});


app.use(express.static(__dirname + '/public'));



// SERVER


app.post('/startnode', function(req, res) {
		console.log("ajax call inc")
	
	// Hent ut data fra req.body
       
		console.log(req.body.gamename + ":"
				+ req.body.gamemodename + ":"
				+ req.body.gamemodedata + ":"
				+ req.body.powerupset +  ":"
				+ req.body.password +  ":"
				+ req.body.players +  ":"
				+ req.body.mapsize );
        
		//startnode();
        // ...
        // Svar
        res.contentType('json');
        res.send({text: 'good shit'});     
});




//starting a new "game" server 
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

	 
