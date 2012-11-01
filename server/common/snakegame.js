function SnakeGame(width, height) {
	this.width = width;
	this.height = height;
	this.players = [];
}
/**
 * Since the WebSocket communicator can't transfer classes, but instead a plain 
 * JavaScript object, we need to convert the object to a SnakeGame class object.
 * In addition the server only contains the original positions of the snake parts, 
 * and the movements that has happened since. Therefore this method has to apply
 * ALL movements that has happen since the start of the game
 */
SnakeGame.prototype.makeGameFromObj = function(obj) {
	// Set normal game settings
	this.width = obj.width;
	this.height = obj.height;
	// Create players
	for (var p=0; p<obj.players.length; p++) {
		this.joinGameFromObj(obj.players[p])
	}
};
/**
 * Similar to makeGameFromObj this method joins with a Player object from a
 * object.
 */
SnakeGame.prototype.joinGameFromObj = function(objP) {
	var player = new Player(objP.id);
	player.nick = objP.nick;
	player.snake = new Snake(objP.snake.parts, objP.snake.lastDirection);
	// Apply moves
	for (var m=0; m<objP.moves.length; m++) {
		player.snake.move(objP.moves[m]);
	}
	this.players.push(player);
};
SnakeGame.prototype.joinGame = function(player) {
	var randX = utils.rand(2,this.width-2);
	var randY = utils.rand(2,this.height-2);
	var randDirection = ['left', 'right', 'up', 'down'][utils.rand(0,3)];
	player.createSnake(randX, randY, randDirection);
	this.players.push(player);
};
SnakeGame.prototype.deletePlayerById = function(id) {
	for (var i=0; i<this.players.length; i++) {
		if (this.players[i].id == id) this.players.splice(i,1);
	}
};
SnakeGame.prototype.getPlayerById = function(id) {
	for (var i=0; i<this.players.length; i++) {
		if (this.players[i].id == id) return this.players[i];
	}
	console.log("No player with id "+id);
};
/**
 * Apply new ticks that the communicator has received.
 */
SnakeGame.prototype.applyTicks = function() {
	var newTicks = communicator.popTicks();
	for (var i=0; i<newTicks.length; i++) {
		var tick = newTicks[i];
		for (var p=0; p<this.players.length; p++) {
			this.players[p].snake.move(tick[this.players[p].id]);
		}
	}
};
SnakeGame.prototype.getBoardElements = function() {
	this.applyTicks();
	
	var elements = [];
	
	for (var i=0; i<this.players.length; i++) {
		var snake = this.players[i].snake;
		// Add head to elements list
		elements.push(new BoardElement({
			type: 'head',
			x: snake.parts[0].x,
			y: snake.parts[0].y
		}));
		// Add body parts
		for (var s=1; s<this.players[i].snake.parts.length; s++) {
			elements.push(new BoardElement({
				type: 'body',
				x: snake.parts[s].x,
				y: snake.parts[s].y
			}));
		}
	}

	return elements;
	
};

if(typeof exports != 'undefined'){
	module.exports = SnakeGame;
}