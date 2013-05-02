//imports

var SpellingText = require("./public/models").SpellingText;


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
		}



		// The internal disconnect trigger
		socket.on('disconnect', function () {
			// Remove from game logic
			sgame.deletePlayerById(socket.id);

			// Stop game if not enough players
			if (sgame.players.length < sgame.settings.playersToStart) {
				clearInterval(sgame.runGameInterval);
				sgame.started = false;
			}
			if (sgame.players.length == 0) sgame.resetGame();

			io.sockets.emit('user disconnected', socket.id);

			console.log("It is now "+sgame.players.length+" players left");
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
	getWords();

});




//polls words from given spelling theme
function getWords() {
	var themeName = myArgs[2];
	var query = {'name': themeName};
	var words = [];
	SpellingText.find(query , function(err, items) {
		if (items.length == 1) {
			var sText = items[0];
			console.log("found "+ sText.name + " in database");

			for (var i = 0; i < sText.content.length; i++) {
				console.log("TEST");

				words.push(sText.content[i].text);
			}
		} else {
			console.log("Cant find " + query.name);
		}
		console.log(words);
		createGame(words);
	});
};



/** SECTION 6: Game logic **/
/*************************************************************/
var sgame;
function createGame(words) {
	var wordArray = words;
	var themeName = myArgs[2];
	var spellingMode = new SpellingMode({
		title: themeName,
		words: wordArray,
	});

	sgame = new ServerSnakeGame({
		'width': 30,
		'height': 30,
		'playersToStart': 1,
		'speed': 4,
		'foodSpawnRate': 1,
		'selfCrashAllowed': false,
		'otherCrashAllowed': false,
		'teleportationAllowed': true,
		'score' : 40,
	}, spellingMode);
	
	
	$(sgame).on("foodspawn", function(event, food){
		io.sockets.emit('foodspawn', food);
	});
	
	$(sgame).on("sendPos", function(event, pos){
		io.sockets.emit('sendPos', pos);
	});
	
	$(sgame).on("getHelp", function(event, result) {
		io.sockets.emit('getHelp', result);
	});
};

/**
 * Run one game tick.
 */
function runGame() {
	io.sockets.emit('tick', sgame.generateTick());
//	if(sgame.checkForGameOver()) {
//	sgame.resetGame();
//	clearInterval(sgame.runGameInterval);
//	sgame.started = false;

//	}
}




