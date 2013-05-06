//imports

var SpellingText = require("./public/models").SpellingText;


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

app.get('/spelling', function (req, res) {
	res.sendfile(__dirname + '/public/spelling.html');
});

app.get('/math', function (req, res) {
	res.sendfile(__dirname + '/public/math.html');
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




/**
 * Database methods
 */

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/snakecombinator');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
	console.log("DB Connection open");
});

app.post('/addSpellingText', function(req, res) {
	res.contentType('json');
	var contentIn = [];
	for (var i = 0; i < req.body.content.length; i++) {
		var text = {text : req.body.content[i]}
		contentIn.push(text);
	}

	var query = {'name': req.body.name};
	SpellingText.findOne(query , function(err, item) {
		if (item) {
			item.content = contentIn;
			item.save(function(err) {
				if(err){
					res.send({response: 'fail', error: err});
				}else {
					console.log("Updated " + item.name + " to database");
					res.send({response: 'success', spellingText : item});
				}
			});
		} else {
			var sText = new SpellingText({name: req.body.name, content: contentIn});
			sText.save(function(err, product) {
				if(err) {
					res.send({response: 'fail', error: err});
				} else {
					console.log("Added " + product.name + " to database");
					res.send({response: 'success', spellingText : product});
				}

			});
		}
	});
});


app.post('/editSpellingText', function(req, res) {
});


app.post('/findSpellingText', function(req, res) {
	res.contentType('json');
	var query = {'name': req.body.name};

	SpellingText.find(query , function(err, items) {
		if (items.length == 1) {
			var sText = items[0];
			console.log("found "+ sText.name + "in database");
			res.send({response: 'success', spellingText: sText});

		} else {
			res.send({response: 'fail', 'error': "Cant find in database"});
		}
	});
});


app.post('/fillModeDataList', function(req, res) {
	var modeType = req.body.modetype;
	console.log("MODE?" + modeType);
	res.contentType('json');

	if (modeType == "SPELLINGMODE"){
		var query = {};
		SpellingText.find(query , function(err, items) {
			if (items.length > 0) {
				var names = [];
				console.log("found "+ items.length + " SpellingText in database");
				for (var i = 0; i < items.length; i++) {
					names.push(items[i].name);
				}
				res.send({respones: 'success', names: names});

			} else {
				res.send({response: 'fail', 'error': "Cant find in database"});
			}
		});
	}
});


app.post('/fillArray', function(req, res) {
	var query = {name : req.body.name};
	SpellingText.find(query , function(err, items) {
		if (items.length > 0) {
			res.send({respones: 'success', content: items[0].content});	
		}else {
			res.send({response: 'fail', 'error': "Cant find in database"});
		}
	});
});


app.post('/joinGame', function(req, res) {
	res.contentType('json');
	var succsess = updateListOfGames(req.body.gamemode, req.body.themeName);
	if(succsess) {
		res.send({response: 'success'});
	} else {
		res.send({response: 'error'});
	}
});




//starting a new "game" server 
function startnode(gamename, gamemodename, gamemodedata, powerupset, password, players, mapsize) {
	console.log("Trying to spawn node js server");
	var portnr = getPort();
	child = exec("node ../server/server.js " + portnr + " " +gamemodename+ " " +gamemodedata+ "", function (error, stdout, stderr) {
		sys.print('stdout: ' + stdout);
		sys.print('stderr: ' + stderr);
		if (error !== null) {
			console.log('exec error: ' + error);
		} 
	});
	addgameserver(gamename, portnr, players, gamemodename, gamemodedata);
}

function addgameserver(name, address, playersToStart, gamemodename, gamemodedata){
	console.log("adding server with gamename: " + name + "on port: " +address);
	var gameserver = {
			gamename : name,
			players : 0,
			playersBeforeStart : playersToStart,
			gamemode : gamemodename,
			themeName : gamemodedata,
			address : "http://gribb.dyndns.org:" + address,
	};
	games.push(gameserver);
};


function updateListOfGames(gamemode, themeName) {
	console.log("inside update");
	for (var i = 0; i < games.length; i++){
		if((gamemode == games[i].gamemode) && (themeName == games[i].themeName)){
			console.log("YOYOY " + games[i].players);
			games[i].players = games[i].players + 1;
			return true;
		}
	}
	return false;
}



function getPort(){
	var port = defaultport;
	defaultport++;
	return port;
}


function listCreatedGames(){

}




