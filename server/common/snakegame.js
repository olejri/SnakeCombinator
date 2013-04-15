/**
 * Base class for snake game logic.
 * 
 * Has the following triggers that can be subscribed to:
 * @trigger died(player)		: 
 * @trigger foodspawn(food)		: 
 * @trigger foodeaten(food)		: 
 * @trigger joinedgame()		: The client joined a game
 * @trigger playerjoined(player): A new player joined
 * @trigger playerleft(player)	:
 */
function SnakeGame() {
	this.mode;
	this.settings;
	this.players = [];
	this.food = [];	// Each food contains x, y and a type.
}
SnakeGame.prototype.addFood = function(food) {
	this.food.push(food);
	$(this).trigger("foodspawn", food);
};
SnakeGame.prototype.deletePlayerById = function(id) {
	for (var i=0; i<this.players.length; i++) {
		if (this.players[i].id == id) {
			$(this).trigger("playerleft", this.players.splice(i,1)[0]);
		}
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
SnakeGame.prototype.applyTicks = function(newTicks) {
	for (var i=0; i<newTicks.length; i++) {
		var tick = newTicks[i];
		for (var p=0; p<this.players.length; p++) {
			var player = this.players[p];
			if (player.snake) {
				var foodEaten = player.snake.move(tick[player.id], this.food);
				if (foodEaten) $(this).trigger("foodeaten", foodEaten);
			}
		}
		// Event detections for current tick
		if (!this.settings.selfCrashAllowed) this.checkForSelfCrash();
		if (!this.settings.otherCrashAllowed) this.checkForCrash();
		this.checkForTeleportation(this.settings.teleportationAllowed);
		this.checkForValidation();
		//this.enablePowerUps();
	}
};
/**
 * Check if any players snakehead crashed with it's own body. If so it runs 
 * the crashedCallback function with the player object as parameter
 */
SnakeGame.prototype.checkForSelfCrash = function(crashedCallback) {
	for (var i=0; i<this.players.length; i++) {
		if (this.players[i].snake) {
			if (this.players[i].snake.hasSelfCrash()) {
				this.players[i].killSnake();
				$(this).trigger("snakedied", this.players[i]);
			}
		}
	}
};
SnakeGame.prototype.checkForCrash = function() {
	var crashedPlayers = [];
	var counter = 0;
	// Detect crashes
	for (var i=0; i<this.players.length; i++) {
		if (!this.players[i].snake) continue;
		var head = this.players[i].snake.parts[0];
		for (var k=0; k<this.players.length; k++) {
			if (this.players[i].id != this.players[k].id) {
				var snake = this.players[k].snake;
				if (!snake) continue;
				else if (snake.hasPartAtPosition(head.x, head.y)) {
					this.players[i].killSnake();
					$(this).trigger("snakedied", this.players[i]);
					break; // No need to check if crashed with other more players
				}
			}
		}
	}
	// Delete snakes of players who crashed
	for (var c=0; c<crashedPlayers.length; c++) {
		crashedCallback(crashedPlayers[c]);
		crashedPlayers[c].snake = null;
	}
};

/**Check if any snakes crashed with the wall 
 * 
 */
SnakeGame.prototype.checkForTeleportation = function(teleport) {
	var crashedPlayers = [];
	for (var i=0; i<this.players.length; i++) {
		var snake = this.players[i].snake;
		if (snake) {
			if(snake.hasCrashedIntoWall(this.settings.width, this.settings.height)){
				if(teleport){
					var foodEaten = snake.teleportHead(this.settings.width, this.settings.height, this.food);
					if (foodEaten) $(this).trigger("foodeaten", foodEaten);
				}
				else{
					this.players[i].killSnake();
					$(this).trigger("snakedied", this.players[i]);
				}
			}
		}
	}
	// Delete snakes of players who crashed
	for (var c=0; c<crashedPlayers.length; c++) {
		crashedCallback(crashedPlayers[c]);
		crashedPlayers[c].snake = null;
	}
};


SnakeGame.prototype.checkForValidation = function() {
	for (var i=0; i<this.players.length; i++){
		var snake = this.players[i].snake;
		var player = this.players[i];
		if (snake){
			if(snake.isInValidationZone(this.settings.width, this.settings.height, this.settings.validationZoneDim)){
				var word = this.mode.validateSnake(player, snake);
				if(word.score > 0){
					player.addToScore(word.score);
					$(this).trigger("validationsuccess", {'player': this.players[i],'score': word.score, 'word': word.word});
					snake.removeAndAwardParts(1);				
										
				}else {
					$(this).trigger("validationfailure", this.players[i]);
					snake.removeAndAwardParts(0);
				}
				
			}
		}
	}
	
};

SnakeGame.prototype.enablePowerUps = function() {
	for (var i=0; i<this.players.length; i++){
		var snake = this.players[i].snake;
		if (snake){
			
			// powerUp help
			if (snake.powerup == "help") {
				var string = "";
				for (var i=0; i < snake.partsDetail.length; i++) {
					if (snake.partsDetail[i].type == "text"){
						string = string + snake.partsDetail[i].details;
					}
				}
				var result = this.mode.getHelp(string);
				if (result.append) {
					var x = snake.parts[snake.parts.length-1].x;
					var y = snake.parts[snake.parts.length-1].y;
					if (snake.parts[snake.parts.length-1].direction == "left") snake.parts.splice(snake.parts.length-1, 0, {'x': x+1, 'y': y, 'direction': "left"}, {'x': x+2, 'y': y, 'direction': "left"});
					else if (snake.parts[snake.parts.length-1].direction == "right") snake.parts.splice(snake.parts.length-1, 0, {'x': x-1, 'y': y, 'direction': "right"}, {'x': x-2, 'y': y, 'direction': "right"});
					else if (snake.parts[snake.parts.length-1].direction == "top") snake.parts.splice(snake.parts.length-1, 0, {'x': x, 'y': y-1, 'direction': "top"}, {'x': x, 'y': y-2, 'direction': "top"});
					else if (snake.parts[snake.parts.length-1].direction == "down") snake.parts.splice(snake.parts.length-1, 0, {'x': x, 'y': y+1, 'direction': "down"}, {'x': x, 'y': y+1, 'direction': "down"});
					snake.partsDetail.splice(snake.partsDetail.length-1, 0, {'type': "text", 'details': result.string[0]}, {'type': "text", 'details': result.string[1]});
				} else {
					snake.parts.splice(i+1, snake.parts.length-i);
					snake.partsDetail.splice(1, snake.partsDetail.length-1, {'type': "text", 'details': result.string[0]}, {'type': "text", 'details': result.string[1]});
				}
				snake.powerup = "zero";
			}
		}
	}
	
}


if(typeof exports != 'undefined') module.exports = SnakeGame;