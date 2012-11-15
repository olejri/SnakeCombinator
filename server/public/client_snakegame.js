// Inherits from SnakeGame
ClientSnakeGame.prototype = new SnakeGame(); 
ClientSnakeGame.prototype.constructor = ClientSnakeGame;
function ClientSnakeGame() {
	
}
/**
 * @param serverGameObj	Game data object from server
 */
ClientSnakeGame.prototype.makeGameFromObj = function(serverGameObj) {
	this.settings = serverGameObj.settings;
	// Create players
	for (var p=0; p<serverGameObj.players.length; p++) {
		this.joinGameFromObj(serverGameObj.players[p])
	}
	eventhandler.joinedGame();
};
/**
 * Similar to makeGameFromObj this method joins with a Player object from a
 * object.
 */
ClientSnakeGame.prototype.joinGameFromObj = function(objP) {
	var player = new Player(objP.id);
	player.nick = objP.nick;
	player.snake = new Snake(objP.snake.parts, objP.snake.lastDirection);
	// Apply moves
	for (var m=0; m<objP.moves.length; m++) {
		player.snake.move(objP.moves[m]);
	}
	eventhandler.playerJoined(player);
	this.players.push(player);
};
/**
 * Runs the parent method with <this> as object context, and a callBackFunction
 * that should be run if snake crashed with itself.
 */
ClientSnakeGame.prototype.checkForSelfCrash = function() {
	SnakeGame.prototype.checkForSelfCrash.call(this, function(player){
		eventhandler.playerDied(player);
	});
};
/**
 * Runs the parent method with <this> as object context, and a callBackFunction
 * that should be run if snakes crashed with other snakes.
 */
ClientSnakeGame.prototype.checkForCrash = function() {
	SnakeGame.prototype.checkForCrash.call(this, function(player){
		eventhandler.playerDied(player);
	});
};
ClientSnakeGame.prototype.getBoardElements = function() {
	var newTicks = communicator.popTicks();
	if (newTicks.length > 0) this.applyTicks(newTicks);
	
	var elements = [];
	
	for (var i=0; i<this.players.length; i++) {
		var snake = this.players[i].snake;
		if (snake) { 
			// Add head to elements list
			elements.push(new BoardElement({
				type: 'head',
				x: snake.parts[0].x,
				y: snake.parts[0].y,
				details: this.players[i]
			}));
			// Add body parts
			for (var s=1; s<this.players[i].snake.parts.length; s++) {
				elements.push(new BoardElement({
					type: 'body',
					x: snake.parts[s].x,
					y: snake.parts[s].y,
					details: this.players[i]
				}));
			}
		}
	}

	return elements;
	
};