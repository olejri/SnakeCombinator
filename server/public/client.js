var socket = io.connect('http://192.168.0.111');

var GLOBAL_MYID;
var sgame = new SnakeGame();

socket.on('id', function(id) {
	GLOBAL_MYID = id;
	console.log("Connection accepted, id is "+id);
});

socket.on('user connected', function(id) {
	console.log("User "+id+" connected");
	
	// Update game engine
	sgame.players.push(new Player(id));

	// Update gui
	var playerDiv = $('<div id="player'+id+'"></div>');
	playerDiv.append('<div class="title">'+id+'</div>');
	playerDiv.append('<div class="movement center_outer"><div></div></div>');
	$('#players').append(playerDiv)
});

socket.on('user disconnected', function(id) {
	console.log("User "+id+" disconnected");
	
	// Update game engine
	sgame.deletePlayerById(id);
	
	// Update gui
	$("#player"+id).remove();
});

/**
 * This triggers on a movements update from the server, it is a "ticked"
 * update that happen on a predetermined interval. It only data of players
 * who actually has moved.
 */
socket.on('movements', function(movements) {
	$("#movement_number").text(parseInt($("#movement_number").text())+1)
	console.log("movements inc");
	
	// Update game engine
	for (var i=0; i<sgame.players.length; i++) {
		var player = sgame.players[i];
		if (movements[player.id]) player.lastMoveInput = movements[player.id];
		else player.lastMoveInput = null;
	}
	
	// Update GUI (testing)
	for (var i=0; i<sgame.players.length; i++) {
		var imgEle = $("#player"+player.id).find('.movement').children();
		imgEle.removeClass();
		
		var player = sgame.players[i];
		if (player.lastMoveInput) {
			imgEle.text(player.lastMoveInput);
			//imgEle.addClass('center_inner keyboard_arrow keyboard_'+player.lastMoveInput);
		}
	}
});



$(document).ready(function() {
	
	// Create the input capturing
	var keyCodeNameMapper = {
			37: 'left',		// Left arrow
			38: 'up',		// Up arrow
			39: 'right',	// Right arrow
			40: 'down', 	// Down arrow
			65: 'left',		// a
			87: 'up',		// w
			68: 'right',	// d
			83: 'down',		// s
	}
	
	$(document).on('keydown', function(event) {
		var moveDirection = keyCodeNameMapper[event.keyCode];
		if (moveDirection) {
			socket.emit('move input', moveDirection);
		}
	});
	
	
	var SpamPerSecond = 10;
	var directions = ['left', 'up', 'right', 'down'];
	setInterval(function(){
		var direction = directions[Math.floor(Math.random()*directions.length)];
		socket.emit('move input', direction);
	}, 1000/SpamPerSecond)
});
