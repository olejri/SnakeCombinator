// Inherits from SnakeGame
ClientSnakeGame.prototype = new SnakeGame(); 
ClientSnakeGame.prototype.constructor = ClientSnakeGame;
function ClientSnakeGame() {
	// DO NOT ADD ANYTHING HERE BUT UNINSTANCIATED VARIABLES
}
/**
 * @param serverGameObj	Game data object from server
 */
ClientSnakeGame.prototype.initFromJsonObject = function(serverGameObj) {
	this.settings = serverGameObj.settings;
	// Create the correct Game Mode object with the mode data from server
	this.mode = eval("new "+serverGameObj.modeType+"(serverGameObj.mode)");
	// Create players
	for (var p=0; p<serverGameObj.players.length; p++) {
		this.addPlayerFromJsonObject(serverGameObj.players[p])
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
ClientSnakeGame.prototype.addPlayerFromJsonObject = function(objP) {
	var player = new Player(objP.id);
	player.nick = objP.nick;
	player.snake = new Snake(objP.snake.parts, objP.snake.partsDetail, objP.snake.lastDirection);
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
ClientSnakeGame.prototype.getGUIElements = function() {
	var newTicks = communicator.popTicks();
	if (newTicks.length > 0) this.applyTicks(newTicks);
	
	// SNAKE ELEMENTS
	var snakeElements = [];
	
	for (var i=0; i<this.players.length; i++) {
		var snake = this.players[i].snake;
		if (snake) { 
			if (snake.parts.length != snake.partsDetail.length) {
				console.log("Warning, snake parts and partsDetails not equal length");
			}
			
			for (var s=0; s<snake.parts.length; s++) {
				if (snake.partsDetail[s].type == "text") {
					snakeElements.push(new BoardTextElement({
						text: snake.partsDetail[s].details,
						x: snake.parts[s].x,
						y: snake.parts[s].y,
					}));
				}
				else if (snake.partsDetail[s].type == "image") {
					snakeElements.push(new BoardImageElement({
						image: snake.partsDetail[s].details,
						x: snake.parts[s].x,
						y: snake.parts[s].y,
					}));
				}
				else console.log("Unkown part type: "+snake.partsDetail[s].type);
			}
			
		}
	}
	
	// FOOD ELEMENTS
	var foodElements = [];
	
	for (var i=0; i<this.food.length; i++) {
		var food = this.food[i];
		foodElements.push(new BoardTextElement({
			text: this.food[i].details,
			x: food.x,
			y: food.y,
		}));
	}

	return {'snakeElements': snakeElements, 'foodElements': foodElements};
	
};