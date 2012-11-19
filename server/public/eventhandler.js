var eventhandler = new function() {
	
	var playerList = $('#players').find('ul');
	
	this.attatchGameTriggers = function(game) {
		$(document).on('keydown', keydown);
		$(game).on("died", onPlayerDied);
		$(game).on("foodspawn", onFoodSpawn);
		$(game).on("foodeaten", onFoodEaten);
		$(game).on("joinedgame", onJoinedGame);
		$(game).on("playerjoined", onPlayerJoined);
		$(game).on("playerleft", onPlayerLeft);
	};
	
	function onPlayerDied(event, player) {
		console.log("Player died: "+player.nick);
	}
	
	function onFoodSpawn(event, food) {
		//console.log(food)
	}
	
	function onFoodEaten(event, food) {
		//console.log(food);
	}
	
	function onJoinedGame() {
		console.log("Joined game");
		drawPlayerList();
	}
	
	function onPlayerJoined(event, player) {
		console.log("Player "+player.nick+" joined");
		drawPlayerList();
	}
	
	function onPlayerLeft(event, player) {
		console.log("Player "+player.nick+" left");
		drawPlayerList();
	}
	
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
	function keydown(event) {
		var moveDirection = keyCodeNameMapper[event.keyCode];
		if (moveDirection) communicator.emitMovement(moveDirection);
		event.preventDefault();
	}
	
	this.playerLeft = function(player) {
		console.log("User "+player.id+" disconnected");
	}
	
	
	function drawPlayerList() {
		playerList.empty();
		for (var i=0; i<sgame.players.length; i++) {
			var player = sgame.players[i];
			playerList.append('<li>'+player.nick+' ('+player.id+')</li>');
		}
	}
	
}