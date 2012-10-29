var communicator = new function() {
	var socket;
	var newTicks = [];
	
	this.emitMovement = function(direction) {
		if (socket) {
			socket.emit('move input', direction);
			log.addEmit();
		}
		else console.log("EMIT ERROR: Not connected to server");
	}

	this.popTicks = function() {
		
	}
	
	this.getID = function() {
		return socket.socket.sessionid;
	}
	
	this.connect = function(ip) {
		
		socket = io.connect(ip);
		
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
		 * This triggers on a movements update from the server, it is a timed
		 * update that happen on a predetermined interval. It only has data of players
		 * who actually has moved.
		 * {playerID: direction, playerID: direction}
		 */
		socket.on('movements', function(movements) {
			log.addUpdate();
			//console.log("movements inc");
			
			// Update game engine
			//update local obejct
			
			for (var i=0; i<sgame.players.length; i++) {
				var player = sgame.players[i];
				player.moves.push(movements[player.id]);
				player.lastMoveInput = movements[player.id];
			}
			
			// Update GUI (testing)
			for (var i=0; i<sgame.players.length; i++) {
				var imgEle = $("#player"+player.id).find('.movement').children();
				imgEle.removeClass();
				
				var player = sgame.players[i];
				
				if (player.lastMoveInput) {
					imgEle.text("");
					imgEle.addClass('center_inner keyboard_arrow keyboard_'+player.lastMoveInput);
				}
				else {
					imgEle.addClass('undefined');
					imgEle.text("undefined")
				}
				/*if (player.lastMoveInput) {
					imgEle.text(player.lastMoveInput);
					//imgEle.addClass('center_inner keyboard_arrow keyboard_'+player.lastMoveInput);
				}*/
			}
			
		});
		console.log("Connected to ip: " + ip);
		
	}
}
var log = new function() {
	this.start = new Date();
	this.emits = 0;
	this.updates = 0;
	this.draws = 0;
	
	this.emitsPerSec = function() {
		var now = new Date();
		var seconds = (now - this.start)/1000;
		return (this.emits/seconds).toFixed(2);
	}

	this.updatesPerSec = function() {
		var now = new Date();
		var seconds = (now - this.start)/1000;
		return (this.updates/seconds).toFixed(2);
	}
	
	this.FPS = function() {
		var now = new Date();
		var seconds = (now - this.start)/1000;
		return (this.draws/seconds).toFixed(2);
	}
	
	this.addUpdate = function() {
		this.updates++;
		$('#updates_counter').text(this.updates);
		$('#updates_ps').text(this.updatesPerSec());
	}
	
	this.addEmit = function() {
		this.emits++;
		$('#emits_counter').text(this.emits);
		$('#emits_ps').text(this.emitsPerSec());
	}
	
	this.addDraw = function() {
		this.draws++;
		$('#fps').text(this.FPS());
	}
}

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
		if (moveDirection) communicator.emitMovement(moveDirection);
		event.preventDefault();
	});
	
	
	/*var SpamPerSecond = 10;
	var directions = ['left', 'up', 'right', 'down'];
	setInterval(function(){
		var direction = directions[Math.floor(Math.random()*directions.length)];
		communicator.emitMovement(direction);
	}, 1000/SpamPerSecond);*/
});