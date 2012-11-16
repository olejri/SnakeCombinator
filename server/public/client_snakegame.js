// Inherits from SnakeGame
ClientSnakeGame.prototype = new SnakeGame(); 
ClientSnakeGame.prototype.constructor = ClientSnakeGame;
function ClientSnakeGame() {
	// DO NOT ADD ANYTHING HERE BUT UNINSTANCIATED VARIABLES
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
	// Create food
	for (var i=0; i<serverGameObj.food.length; i++) {
		this.addFood(serverGameObj.food[i]);
	}
	// Test data
	/*for (var p=0; p<30; p++) {
		this.addPlayer(new Player("lolid"));
	}*/
};
/**
 * Similar to makeGameFromObj this method joins with a Player object from a
 * object.
 */
ClientSnakeGame.prototype.joinGameFromObj = function(objP) {
	var player = new Player(objP.id);
	player.nick = objP.nick;
	player.snake = new Snake(objP.snake.parts, objP.snake.lastDirection);
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
	
	// SNAKE ELEMENTS
	var snakeElements = [];
	
	for (var i=0; i<this.players.length; i++) {
		var snake = this.players[i].snake;
		if (snake) { 
			// Add head to elements list
			snakeElements.push(new BoardElement({
				type: 'head',
				x: snake.parts[0].x,
				y: snake.parts[0].y,
			}));
			// Add body parts
			for (var s=1; s<this.players[i].snake.parts.length; s++) {
				snakeElements.push(new BoardElement({
					type: 'body',
					x: snake.parts[s].x,
					y: snake.parts[s].y,
				}));
			}
		}
	}
	
	// FOOD ELEMENTS
	var foodElements = [];
	
	for (var i=0; i<this.food.length; i++) {
		var food = this.food[i];
		foodElements.push(new BoardElement({
			type: 'food',
			x: food.x,
			y: food.y,
		}));
	}

	return {'snakeElements': snakeElements, 'foodElements': foodElements};
	
};