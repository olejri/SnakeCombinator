//http server
var http = require("http");
var express = require('express');
var app = express();
var server = http.createServer(app);

//child_process
var sys = require('sys')
var exec = require('child_process').exec;

//list of available games
var games = [];

//port for gameserver
var defaultport = 30000;


app.configure(function(){
	app.use(express.bodyParser());
});

//var myArgs = process.argv.slice(2);
//console.log('myArgs: ', myArgs);


//server listen @ 8888
server.listen(8888);
console.log('Server listen on port: 8888');


//MongoDB

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("connection to db successful")
  var spellingmodeSchema = mongoose.Schema({
    name: String
})
  
  
  
  
});


/**
 * Navigation
 */
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



//SERVER

//Ajax call from client thats start a child process
app.post('/startnode', function(req, res) {
	console.log("ajax call inc startnode")
	// Hent ut data fra req.body
	console.log(req.body.gamename + ":"
			+ req.body.gamemodename + ":"
			+ req.body.gamemodedata + ":"
			+ req.body.powerupset +  ":"
			+ req.body.password +  ":"
			+ req.body.players +  ":"
			+ req.body.mapsize );

	startnode(req.body.gamename, req.body.gamemodename, req.body.gamemodedata, req.body.powerupset, req.body.password, req.body.players, req.body.mapsize);
	res.contentType('json');
	res.send(games);     
});



//Ajax from client request available games
app.post('/getgamelist', function(req, res) {
	console.log("ajax call inc getgamelist")
	res.contentType('json');
	res.send(games);
});





//starting a new "game" server 
function startnode(gamename, gamemodename, gamemodedata, powerupset, password, players, mapsize) {
	console.log("Trying to spawn node js server");
	var portnr = getPort();
	child = exec("node ../server/server.js " + portnr + "", function (error, stdout, stderr) {
		sys.print('stdout: ' + stdout);
		sys.print('stderr: ' + stderr);
		if (error !== null) {
			console.log('exec error: ' + error);
		} 
	});
	addgameserver(gamename, portnr);
}

function addgameserver(name, address){
	console.log("adding server with gamename: " + name + ":" + "port: " +address);
	var gameserver = {
			gamename : name,
			address : "localhost:" + address
	};
	games.push(gameserver);
};

function getPort(){
	var port = defaultport;
	defaultport++;
	return port;
}


function listCreatedGames(){

}


