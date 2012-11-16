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

	/**
	 * Fetch all new ticks, and remove them from object
	 */
	this.popTicks = function() {
		return newTicks.splice(0, newTicks.length);
	}
	
	this.getID = function() {
		return socket.socket.sessionid;
	}
	
	/**
	 * Connects to a node.js WebSocket server to given IP, an essential part
	 * of connecting to a server is receiving the game object afterwards. The
	 * callback is run when this happen.
	 */
	this.connect = function(gameReceivedCallback) {
		
		socket = io.connect();
		
		// Received game object from server
		socket.on('game', function(gameObj) {
			gameReceivedCallback(gameObj);
		});

		socket.on('user connected', function(playerObj) {
			sgame.joinGameFromObj(playerObj)
		});

		socket.on('user disconnected', function(id) {
			eventhandler.playerLeft(sgame.deletePlayerById(id));
		});


		/**
		 * This triggers on a tick update from the server, it is a timed
		 * update that happen on a predetermined interval. It only has data of players
		 * who actually has moved.
		 * 
		 * Tick Object Format: {playerID: direction, playerID: direction, ...}
		 * 
		 * One tick contains player movements, an empty tick means that all players
		 * are continueing in the same direction
		 */
		socket.on('tick', function(tick) {
			log.addUpdate();
			
			newTicks.push(tick);
			
			// Update Movement Output (debug only)
			for (var i=0; i<sgame.players.length; i++) {
				var player = sgame.players[i];
				
				var imgEle = $("#player"+player.id).find('.movement').children();
				imgEle.removeClass();

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
		
		socket.on("food", function(food) {
			sgame.addFood(food);
		});
		
		console.log("Connected to WebSocket server");
		
	}
}
var log = new function() {
	var smoothFactor = 0.7; // Higher makes the PerSecond change slower and smoother
	
	this.emits = 0;
	this.lastEPS = 1;
	this.lastEmit = new Date();
	
	this.updates = 0;
	this.lastUPS = 1;
	this.lastUpdate = new Date();
	
	this.draws = 0;
	this.lastFPS = 1;
	this.lastDraw = new Date();
	
	this.smoothCalculator = function(lastDate, lastPS) {
		// Calculate seconds since last calculation
		var now = new Date();
		var seconds = (now - lastDate)/1000;
		// Calculate per second value using smoothness factor
		var newPS = 1/seconds;
		var smoothPS = newPS*(1-smoothFactor) + lastPS*smoothFactor;
		return smoothPS.toFixed(2);
	};
		
	this.emitsPerSec = function() {
		this.lastEPS = this.smoothCalculator(this.lastEmit, this.lastEPS);
		this.lastEmit = new Date();
		return this.lastEPS;
	}

	this.updatesPerSec = function() {
		this.lastUPS = this.smoothCalculator(this.lastUpdate, this.lastUPS);
		this.lastUpdate = new Date();
		return this.lastUPS;
	}
	
	this.FPS = function() {
		this.lastFPS = this.smoothCalculator(this.lastDraw, this.lastFPS);
		this.lastDraw = new Date();
		return this.lastFPS;
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
		//sgame.players[0].snake.move(moveDirection);
//		gui.draw(sgame.getBoardElements());
		
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