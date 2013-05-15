//imports

var SpellingText = require("./public/models").SpellingText;
var MathText = require("./public/models").MathText;
var GameServer = require("./public/models").GameServer;


//http server
var http = require("http");
var express = require('express');
var app = express();
var server = http.createServer(app);


//child_process
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

//portFinder, default starting port is set to 30000
var portfinder = require('portfinder');
portfinder.basePort = 30000;

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
	res.contentType('json');
	console.log("ajax call inc startnode")
	// Hent ut data fra req.body
	console.log(req.body.gamename + ":"
			+ req.body.gamemodename + ":"
			+ req.body.gamemodedata + ":"
			+ req.body.wallcrash +  ":"
			+ req.body.helppowerup + ":"
			+ req.body.password +  ":"
			+ req.body.players +  ":"
			+ req.body.mapsize);

	startnode(res, req.body.gamename, req.body.gamemodename, req.body.gamemodedata, req.body.wallcrash, req.body.helppowerup , req.body.password, req.body.players, req.body.mapsize, req.body.score, req.body.time, req.body.crashother, req.body.crashself);

});


//Ajax call from client request available games
//app.post('/getgamelist', function(req, res) {
//console.log("ajax call inc getgamelist")
//res.contentType('json');
//res.send(games);
//});




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

//Methods for SpellingMode
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
				res.send({'response': 'success', names: names});

			} else {
				res.send({'response': 'fail', 'error': "Cant find in database"});
			}
		});
	} else if (modeType == "MATHMODE"){
		MathText.find(query , function(err, items) {
			if (items.length > 0) {
				var names = [];
				console.log("found "+ items.length + " MathText in database");
				for (var i = 0; i < items.length; i++) {
					names.push(items[i].name);
				}
				res.send({'response': 'success', names: names});

			} else {
				res.send({'response': 'fail', 'error': "Cant find in database"});
			}
		});

	}
});



app.post('/fillArray', function(req, res) {
	var query = {name : req.body.name};
	SpellingText.find(query , function(err, items) {
		console.log(items);
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


//Methods for MathMode
app.post('/addMathText', function(req, res) {
	res.contentType('json');
	var query = {'name': req.body.name};
	var range = req.body.range;
	MathText.findOne(query , function(err, item) {
		if (item) {
			item.range = range;
			item.save(function(err) {
				if(err){
					res.send({response: 'fail', error: err});
				}else {
					console.log("Updated " + item.name + " to database");
					res.send({response: 'success', MathText : item});
				}
			});
		} else {
			var mText = new MathText({name: req.body.name, range: range});
			mText.save(function(err, product) {
				if(err) {
					res.send({response: 'fail', error: err});
				} else {
					console.log("Added " + product.name + " to database");
					res.send({response: 'success', MathText : product});
				}

			});
		}
	});
});


//Methods for GameServer model

function addGameServerToDB (data, results) {
	var query = {'name': data.name};
	var players = data.players;
	var res;


	GameServer.findOne(query , function(err, item) {
		if (item) {
			item.players.inGamePlayers = players.inGamePlayers;
			if(item.players.playersNeededToStart == players.inGamePlayers) {
				item.status = "Playing"
			}
			item.save(function(err) {
				if(err){
					res = {response: 'fail', error: err};
				}else {
					console.log("Updated " + item.name + " in database");
					res = {response: 'success'};
				}
			});
		} else {
			var gameServer = new GameServer({name: data.name, players : players, gameMode : data.gameMode, status : data.status, address : data.address});
			gameServer.save(function(err, product) {
				if(err) {
					res = {response: 'fail', error: err};
				} else {
					console.log("Added " + product.name + " to database");
					res = {response: 'success'};
				}

			});
		}
	});

	findGames(results);
	return res;
}


app.post('/findGameServers', function(req, res) {
	res.contentType('json');
	findGames(res);
});

app.post('/testRemove', function(req, res) {
	res.contentType('json');
	var query = {name: req.body.name};
	GameServer.findOne(query , function(err, item) {
		if (item) {
			item.remove(function(err) {
				if(err){
					res = {response: 'fail', error: err};
				}else {
					console.log("Remove " + item.name + " from database");
				}
			});
		} else {
			console.log("nothing to remove");
		}
	});
});

app.post('/testRemove2', function(req, res) {
	res.contentType('json');
	var query = {};
	SpellingText.find(query , function(err, item) {
		console.log("Found");
		console.log(item);
		if (item) {
			for (var i = 0; i < item.length; i++){
				item[i].remove(function(err) {
					if(err){
						res = {response: 'fail', error: err};
					}else {
						console.log("Remove " + item.name + " from database");
					}
				});
			}
		} else {
			console.log("nothing to remove");
		}
	});
});

app.post('/testRemove3', function(req, res) {
	res.contentType('json');
	var query = {};
	SpellingText.find(query , function(err, item) {
		console.log("Found");
		console.log(item);
		if (item) {
			for (var i = 0; i < item.length; i++){
				item[i].remove(function(err) {
					if(err){
						res = {response: 'fail', error: err};
					}else {
						console.log("Remove " + item.name + " from database");
					}
				});
			}
		} else {
			console.log("nothing to remove");
		}
	});
});





//starting a new "game" server

function startnode(res, gamename, gamemodename, gamemodedata, wallcrash, helppowerup, password, players, mapsize, score, time, crashother, crashself) {
	console.log("Trying to spawn node js server");
	portfinder.getPort(function (err, port) {
		if(!password) password = "default";
		if(!score) score = 0;


		child = exec("node ../server/server.js " + port + " " +gamemodename+ " " +gamemodedata+ " " +players+ " "+mapsize+ " "+wallcrash+" "+helppowerup+" "+password+" "+ gamename+ " "+score+" "+time+" "+crashother+" "+crashself+"", function (error, stdout, stderr) {
			sys.print('stdout: ' + stdout);
			sys.print('stderr: ' + stderr);
			if (error !== null) {
				console.log('exec error: ' + error);
			} else {
				console.log("Spawned node server on port:"+ port + " with args:" +gamemodename+ " " +gamemodedata+ " " +players+ " "+mapsize+ " "+wallcrash+" "+helppowerup+" "+password);
			}
		});

		var data = {name : gamename,
				players : {
					inGamePlayers : 0,
					playersNeededToStart : players
				},
				gameMode : gamemodename,
				status : "Trenger spillere...",
				address : "http://gribb.dyndns.org:" + port
		}
		addGameServerToDB(data, res);
	});

}


function findGames(res) {
	var gameServers = [];
	var query = {};
	GameServer.find(query , function(err, items) {
		if (items.length > 0) {
			console.log("found "+ items.length + " game servers in the database");
			for (var i = 0; i < items.length; i++) {
				gameServers.push(items[i]);
			}
			res.send({'gameServers' : gameServers, 'msg' : "Found " + items.length + " servers in the db"});

		} else {
			res.send({'gameServers' : gameServers, 'msg' : "Found ZERO servers in the db"}); 
		}
	});
}
//TESTING


app.post('/testing', function(req, res) {
	res.contentType('json');
	console.log("PORT" + getPort());
});











