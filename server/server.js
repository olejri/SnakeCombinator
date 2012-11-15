/** SECTION 1: Create the node, express and socket.io setup **/
/*************************************************************/

var express = require('express')
, http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(80);


/** SECTION 2: Project specific class instanciation **/
/*************************************************************/

var Utils = require('./common/utils');
utils = new Utils();
ServerSnakeGame = require('./server_snakegame');
Player = require('./common/player');
Snake = require('./common/snake');

/** SECTION 3: Http request handling **/
/*************************************************************/

// Manual urls
app.get('/', function (req, res) {
	res.sendfile(__dirname + '/public/index.html');
});

// Setting static folders, all files in these will be public
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/common'));


/** SECTION 4: Socket.IO communication **/
/*************************************************************/

io.sockets.on('connection', function (socket) {

	// Send game data to new client
	socket.emit('game', sgame.toClientJson());
	
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
		console.log("** move input ** "+socket.id+" : "+direction);
		sgame.getPlayerById(socket.id).lastMoveInput = direction;
	});
	
});



/** SECTION 5: Game logic **/
/*************************************************************/
var sgame = new ServerSnakeGame({
	'width': 20,
	'height': 20,
	'playersToStart': 2,
	'speed': 3,
	'selfCrashAllowed': true,
	'otherCrashAllowed': true,
});

/**
 * Run one game tick, checking if players want to move their snake, updating
 * BUT NOT applying the moved direction to the players snake move history.
 * Then finally emiting the tick to all players.
 */
function runGame() {
	var tick = {};
	for (var i=0; i<sgame.players.length; i++) {
		var player = sgame.players[i];
		var lastMove = player.lastMoveInput;

		if (lastMove) {
			tick[player.id] = lastMove;
			player.lastMoveInput = null;
		}
		
		// Set that last move input has happened
		player.moves.push(lastMove);
	}
	
	io.sockets.emit('tick', tick);
}