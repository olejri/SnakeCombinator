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

var SnakeGame = require('./common/snake');
var Player = require('./common/player');
var Coordinate = require('./common/coordinate');

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

	// Send initial game data
	for (var i=0; i<sgame.players.length; i++) {
		socket.emit('user connected', sgame.players[i].id);
	}
	
	// Add to game logic
	sgame.players.push(new Player(socket.id));
	console.log("It is now "+sgame.players.length+" players");
	
	// Announce new user
	io.sockets.emit('user connected', socket.id);
	
	// The internal disconnect trigger
	socket.on('disconnect', function () {
		// Remove from game logic
		sgame.deletePlayerById(socket.id);
		
		io.sockets.emit('user disconnected', socket.id);
		
		console.log("It is now "+sgame.players.length+" players left");
	});
	
	// Custom triggers
	socket.on("move input", function(direction) {
		sgame.getPlayerById(socket.id).lastMoveInput = direction;
	});
});


/** SECTION 5: Game logic **/
/*************************************************************/
var MovesPerSecond = 10;

var sgame = new SnakeGame();

setInterval(function(){
	var movements = {};
	for (var i=0; i<sgame.players.length; i++) {
		var player = sgame.players[i];
		if (player.lastMoveInput) {
			movements[player.id] = player.lastMoveInput;
			player.lastMoveInput = null;
		}
	}
	
	io.sockets.emit('movements', movements);
}, 1000/MovesPerSecond)