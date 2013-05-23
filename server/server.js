//imports

var SpellingText = require("./public/models").SpellingText;
var MathText = require("./public/models").MathText;
var GameServer = require("./public/models").GameServer;
var SavedGame = require("./public/models").SavedGame;

/** SECTION 1: Create the node, express and socket.io setup **/
/*************************************************************/

var express = require('express')
, http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server, { log: 2 });
io.set('log level', 1);

var myArgs = process.argv.slice(2);


console.log('myArgs: ', myArgs);
server.listen(myArgs[0]);


/** SECTION 2: Project specific  instantiation **/
/*************************************************************/

var Utils = require('./common/utils');
var SpellingMode = require('./common/modes/spelling');
var MathMode = require('./common/modes/math');
utils = new Utils();
var ServerSnakeGame = require('./server-snakegame');
var Player = require('./common/player');
$ = require('jquery');

/** SECTION 3: Http request handling **/
/*************************************************************/

//Manual urls
app.get('/', function (req, res) {
	res.sendfile(__dirname + '/public/snakegame.html');
});

//Setting static folders, all files (recursively) in these will be public
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/common'));




/** SECTION 4: Socket.IO communication **/
/*************************************************************/

io.sockets.on('connection', function (socket) {
	var nick = "";
	socket.on('nick', function(nickObject) {
		console.log("recieved nick from client");
		nick = nickObject.nick;

		// Send game data to new client
		console.log("sending game data")
		socket.emit('game', sgame.toJsonObject());

		// Add new player to game logic
		console.log("adding player");
		var newPlayer = new Player(socket.id);
		newPlayer.nick = nick;
		sgame.addPlayer(newPlayer);
		console.log("It is now "+sgame.players.length+" players");


		// Announce new player to current players
		io.sockets.emit('user connected', newPlayer);

		// If enough players: start game
		if (!sgame.started && (sgame.players.length >= sgame.settings.playersToStart)) {
			sgame.runGameInterval = setInterval(runGame, 1000/sgame.settings.speed);
			sgame.started = true;
			timeAttack();

		}
		updateGameServer(sgame.players.length);
		hasPlayers = true;



		// The internal disconnect trigger
		socket.on('disconnect', function () {
			
			for(var i = 0; i < sgame.players.length; i++){
				if (sgame.players[i].id == socket.id){
					
					console.log("YOYOOY");
					io.sockets.emit('updateResultBoard', {'nick' : sgame.players[i].nick, 'answer' : "NEI"});
				}
			}
			// Remove from game logic
			sgame.deletePlayerById(socket.id);
			// Stop game if not enough players
			if (sgame.players.length < sgame.settings.playersToStart) {
				clearInterval(sgame.runGameInterval);
				sgame.started = false;
			}
			if (sgame.players.length == 0) sgame.resetGame();
			io.sockets.emit('user disconnected', socket.id);
			updateGameServer(sgame.players.length);
			console.log("It is now "+sgame.players.length+" players left");
			if (hasPlayers == true && sgame.players.length == 0) {
				shutDownServer();
			}
		});

		// Custom triggers
		socket.on("move input", function(direction) {
			//console.log("** move input ** "+socket.id+" : "+direction);
			sgame.getPlayerById(socket.id).lastMoveInput = direction;
		});

		socket.on('pause', function(command) {
			if (command.command == "stopp") {
				clearInterval(sgame.runGameInterval);
				sgame.started = false;
			} else if (command.command == "start"){
				sgame.runGameInterval = setInterval(runGame, 1000/sgame.settings.speed);
				sgame.started = true;
			}
		});


		socket.on('exit', function(command) {
			console.log(command.command);
			console.log(process.abort());		
		});

		socket.on('restartGame', function(object) {
			var restart = true;

			console.log("id " + object.id);
			for(var i = 0; i < sgame.players.length; i++){
				if (sgame.players[i].id == object.id){
					sgame.players[i].playingAgain = true;
					io.sockets.emit('updateResultBoard', {'nick' : sgame.players[i].nick, 'answer' : "JA"});
					console.log("playingAgain = true");
				}

				if (sgame.players[i].playingAgain == false){
					restart = false;
					console.log("restart = false");
				}
			}


			if (!sgame.started && (sgame.players.length >= sgame.settings.playersToStart) && restart) {
				sgame.runGameInterval = setInterval(runGame, 1000/sgame.settings.speed);
				sgame.started = true;
				timeAttack();
				sgame.resetGame();
				io.sockets.emit('clearGUI');
				for(var i = 0; i < sgame.players.length; i++){
					sgame.timedSnakeRespawn(sgame.players[i]);
					sgame.players[i].playingAgain = false;
				}
			}
		});

		socket.on('updateDB', function(object) {
			//updateGameServer(object.players);
		});
		
		socket.on('gameTimedOut', function() {
			console.log("gameover");
			var result = {'winner' : sgame.players[0], 'players' : sgame.players}
			io.sockets.emit('sendResult', result);
			saveGame();
		});
		
		

	});



});


/** SECTION 5: Database logic **/
/*************************************************************/
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/snakecombinator');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
	console.log("DB Connection open");
	getContentFromDB();

});




//polls words from given spelling theme
function getContentFromDB() {
	var themeName = myArgs[2];
	var query = {'name': themeName};
	var content = [];
	if (myArgs[1] == "SPELLINGMODE") {
		SpellingText.find(query , function(err, items) {
			if (items.length == 1) {
				var sText = items[0];
				console.log("found "+ sText.name + " in database");

				for (var i = 0; i < sText.content.length; i++) {
					console.log("TEST");

					content.push(sText.content[i].text);
				}
			} else {
				console.log("Cant find " + query.name);
			}
			console.log(content);
			createGame(content);
		});

	} else if (myArgs[1] == "MATHMODE") {
		GameServer.find(query , function(err, items) {
			if (items.length == 1) {
				var sText = items[0];
				console.log("found "+ sText.name + " in database");

				for (var i = 0; i < sText.content.length; i++) {
					console.log("TEST");

					content.push(sText.content[i].text);
				}
			} else {
				console.log("Cant find " + query.name);
			}
			console.log(content);
			createGame(content);
		});
	}
};



/** SECTION 6: Game logic **/
/************************************************************
 * 
 * 
 * Getting all args from main server
 * 
 * */
var sgame;
function createGame(content) {
	var contentFromDB;

	//Input from node args
	var gameModeName = myArgs[1];
	var themeName = myArgs[2];
	var playersToStart = myArgs[3];
	var size = myArgs[4];
	var wallcrashInput = myArgs[5];
	var helppowerupInput = myArgs[6];
	var password = myArgs[7];
	var score = myArgs[9];
	var time = myArgs[10];
	var crashotherInput = myArgs[11];
	var crashselfInput = myArgs[12];
	if (time == "Evig") time = 0;

	//setting gameGUI size
	var width;
	var height;
	if (size == "SMALL") width = 30, height = 30; 
	else if (size == "MEDIUM") width = 40, height = 40; 
	else if (size == "BIG") width = 50, height = 50;



	//setting gamemode and powerups
	var gameMode;
	var wallcrash = true;
	var selfcrash = false;
	var othercrash = false;
	var helpPowerUp = false;

	if (gameModeName == "SPELLINGMODE"){
		contentFromDB = content;
		gameMode = new SpellingMode({
			title: themeName,
			words: contentFromDB,
		});

	} else if(gameModeName == "MATHMODE"){
		contentFromDB = content;
		gameMode = new MathMode({
			title: themeName,
			range: {'minRange': contentFromDB.minRange, 'maxRange' : contentFromDB.maxRange},
		});
	}

	if (wallcrashInput == "wallcrash"){
		wallcrash = false;
	}
	
	if (crashotherInput == "crashother"){
		othercrash = true;
	}

	if (crashselfInput == "crashself"){
		selfcrash = true;
	}


	if (helppowerupInput == "helppowerup"){
		helpPowerUp = true;
	}


	//creating game object
	sgame = new ServerSnakeGame({
		'width': width,
		'height': height,
		'playersToStart': playersToStart,
		'speed': 5,
		'foodSpawnRate': 1,
		'selfCrashAllowed': selfcrash,
		'otherCrashAllowed': othercrash,
		'teleportationAllowed': wallcrash,
		'score' : score,
		'helpPowerUp' : helpPowerUp,
		'time' : time,
	}, gameMode);




	//setting server triggers
	$(sgame).on("foodspawn", function(event, food){
		io.sockets.emit('foodspawn', food);
	});

	$(sgame).on("sendPos", function(event, pos){
		io.sockets.emit('sendPos', pos);
	});

	$(sgame).on("getHelp", function(event, result) {
		io.sockets.emit('getHelp', result);
	});

	$(sgame).on("gameOver", function(event, result) {
		console.log("gameover");
		io.sockets.emit('sendResult', result);
		saveGame();
	});
	
	
	
};

/**
 * Run one game tick.
 */
function runGame() {
	io.sockets.emit('tick', sgame.generateTick());
}

function updateGameServer (playersInGame) {
	var gamename = myArgs[8];
	var query = {'name': gamename};
	var res;

	console.log("name" +gamename);
	console.log("players" +playersInGame);


	GameServer.findOne(query , function(err, item) {
		if (item) {
			item.players.inGamePlayers = playersInGame;
			console.log("set players in db to" + playersInGame);
			if(item.players.playersNeededToStart <= playersInGame) {
				item.status = "Startet";
			} else if (item.players.playersNeededToStart > playersInGame){
				item.status = "Trenger spillere...";
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
			console.log("Cant find");
		}
	});

	return res;
}


/** SECTION 7: Exit **/
/************************************************************
 * 
 * 
 * Getting all args from main server
 * 
 * */
var hasPlayers = false;



function shutDownServer() {
	var gamename = myArgs[8];
	var query = {'name': gamename};
	GameServer.findOne(query , function(err, item) {
		if (item) {
			item.remove(function(err) {
				if(err){
					res = {response: 'fail', error: err};
				}else {
					console.log("Remove " + item.name + " from database");
					setTimeout(function(){
						exit();
					}, 3000);
				}
			});
		} else {
			console.log("notrhing to remove");
		}
	});
}

function exit() {
	process.exit(1);
}


function timeAttack() {
	var time = myArgs[10];
	var getMilli = time * 60000;
	console.log("Time set to" + getMilli);
	if (time != "Evig"){
		io.sockets.emit('startClock', getMilli);
	}
}



function saveGame(){
	var date = new Date();
	var min = date.getMinutes();
	var hours = date.getHours();
	var day = date.getDate();
	var month = date.getMonth()+1;
	var year = date.getFullYear();
	var dateString = hours+":"+min+ " " + day+"/"+month+"/"+year; 
	var players = [];
	for(var i = 0; i < sgame.players.length; i++){
		var words = [];
		for(var k = 0; k < sgame.players[i].validated.length; k++){
			words.push({text : sgame.players[i].validated[k]});
		}
		
		var player = {playername : sgame.players[i].nick.toLowerCase(), score : sgame.players[i].score, words : words}
		players.push(player);
	}
	
	var savedGame = new SavedGame({
		date : dateString,
		gametime : myArgs[10],
		gamescore : myArgs[9],
		gamename : myArgs[8],
		gamemode : myArgs[1],
		themename : myArgs[2],
		players : players 
	});
	
	savedGame.save(function(err, product) {
		if(err) {
			console.log("ERROR = " + err);
		} else {
			console.log("Saved " + product.gamename + " to database with " +product.players.length+ " players");
			clearInterval(sgame.runGameInterval);
			sgame.started = false;
			sgame.resetGame();
		}

	});
}


