//Inherits from SnakeGame
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
	// Create food
	for (var i=0; i<serverGameObj.food.length; i++) {
		this.addFood(serverGameObj.food[i]);
	}

	$(this).trigger("joinedgame", this);
};
/**
 * Similar to makeGameFromObj this method joins with a Player object from a
 * object.
 */
ClientSnakeGame.prototype.addPlayerFromJsonObject = function(objP) {
	var player = new Player(objP.id);
	player.nick = objP.nick;
	if (objP.snake) {
		player.snake = new Snake(objP.snake.parts, objP.snake.partsDetail, objP.snake.lastDirection);
	}
	this.players.push(player);
	$(this).trigger("playerjoined", player);
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

			if (this.socketID == this.players[i].id){
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
							direction: snake.parts[s].direction,
						}));
					}
					else if (snake.partsDetail[s].type == "plain") {
						snakeElements.push(new BoardTextElement({
							text: " ",
							x: snake.parts[s].x,
							y: snake.parts[s].y,
						}));
					}
					else console.log("Unkown part type: "+snake.partsDetail[s].type);
				}
			} else {
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
							image: "tail",
							x: snake.parts[s].x,
							y: snake.parts[s].y,
							direction: snake.parts[s].direction,
						}));
					}
					else if (snake.partsDetail[s].type == "plain") {
						snakeElements.push(new BoardTextElement({
							text: " ",
							x: snake.parts[s].x,
							y: snake.parts[s].y,
						}));
					}
					else console.log("Unkown part type: "+snake.partsDetail[s].type);

				}
			}

		}

	}

	// FOOD ELEMENTS
	var foodElements = [];
	var powerUpElements = [];

	for (var i=0; i<this.food.length; i++) {
		var food = this.food[i];
		if (food.type == "powerup") {
			powerUpElements.push(new BoardImageElement({
				image: food.details,
				x: food.x,
				y: food.y,
			}));
		} else {
			foodElements.push(new BoardTextElement({
				text: this.food[i].details,
				x: food.x,
				y: food.y,
			}));
		}
	}

	return {'snakeElements': snakeElements, 'foodElements': foodElements, 'powerUpElements' : powerUpElements};

};