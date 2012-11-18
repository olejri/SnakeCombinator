/** SECTION 1: Create the node, express and socket.io setup **/
/*************************************************************/

var express = require('express')
, http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server, { log: 2 });
io.set('log level', 1);

server.listen(80);


/** SECTION 2: Project specific class instanciation **/
/*************************************************************/

var Utils = require('./common/utils');
var SpellingMode = require('./common/modes/spelling');
utils = new Utils();
var ServerSnakeGame = require('./server_snakegame');
var Player = require('./common/player');


/** SECTION 3: Http request handling **/
/*************************************************************/

// Manual urls
app.get('/', function (req, res) {
	res.sendfile(__dirname + '/public/index.html');
});

// Setting static folders, all files (recursively) in these will be public
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/common'));


/** SECTION 4: Socket.IO communication **/
/*************************************************************/

io.sockets.on('connection', function (socket) {

	// Send game data to new client
	socket.emit('game', sgame.toJsonObject());
	
	// Add new player to game logic
	var newPlayer = new Player(socket.id);
	sgame.addPlayer(newPlayer);
	console.log("It is now "+sgame.players.length+" players");
	
	// Announce new player to current players
	io.sockets.emit('user connected', newPlayer);
	
	// If enough players, start game, else stop it
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
		
		io.sockets.emit('user disconnected', socket.id);
		
		console.log("It is now "+sgame.players.length+" players left");
	});
	
	// Custom triggers
	socket.on("move input", function(direction) {
		//console.log("** move input ** "+socket.id+" : "+direction);
		sgame.getPlayerById(socket.id).lastMoveInput = direction;
	});
	
});



/** SECTION 5: Game logic **/
/*************************************************************/
var spellingMode = new SpellingMode({
	title: "Drikke",
	words: ["Brus", "Saft", "Kaffe", "Kakao"],
});

var sgame = new ServerSnakeGame({
	'width': 20,
	'height': 20,
	'playersToStart': 2,
	'speed': 3,
	'foodSpawnRate': 2,
	'selfCrashAllowed': true,
	'otherCrashAllowed': true,
},spellingMode);

/**
 * Run one game tick.
 */
function runGame() {
	var gameTick = sgame.generateTick();
	io.sockets.emit('tick', gameTick.movement);
	if (gameTick.foodSpawn) io.sockets.emit('food', gameTick.foodSpawn);
}