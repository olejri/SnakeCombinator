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
	this.socketID;
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
SnakeGame.prototype.applyTick = function(newTick) {
	for (var p=0; p<this.players.length; p++) {
		var player = this.players[p];
		if (player.snake) {
			var foodEaten = player.snake.move(newTick[player.id], this.food);
			if (foodEaten) $(this).trigger("foodeaten", foodEaten);
		}
	}
	// Event detections for current tick
	if (!this.settings.selfCrashAllowed) this.checkForSelfCrash();
	if (!this.settings.otherCrashAllowed) this.checkForCrash();
	this.checkForTeleportation(this.settings.teleportationAllowed);
	this.checkForValidation();
	this.enablePowerUps();
	
	//this.checkForRespawn();
	//this.checkForGameOver();
	//	this.testForId();

};
/**
 * Check if any players snakehead crashed with it's own body. If so it runs 
 * the crashedCallback function with the player object as parameter
 */
SnakeGame.prototype.checkForSelfCrash = function(callback) {
	for (var i=0; i<this.players.length; i++) {
		if (this.players[i].snake) {
			if (this.players[i].snake.hasSelfCrash()) {
				var newScore = this.players[i].killSnake();
				if(callback){
					callback(this.players[i]);
				}
				$(this).trigger("snakedied", {'player' : this.players[i], 'score' : newScore});
			}
		}
	}
};
SnakeGame.prototype.checkForCrash = function(callback) {
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
					var newScore = this.players[i].killSnake();
					$(this).trigger("snakedied", {'player' :this.players[i], 'score' : newScore});
					if(callback){
						callback(this.players[i]);
					}
					break; // No need to check if crashed with other more players
				}
			}
		}
	}
	// Delete snakes of players who crashed
	for (var c=0; c<crashedPlayers.length; c++) {
		crashedPlayers[c].snake = null;
	}
};

/**Check if any snakes crashed with the wall 
 * 
 */
SnakeGame.prototype.checkForTeleportation = function(callback) {
	var crashedPlayers = [];
	for (var i=0; i<this.players.length; i++) {
		var snake = this.players[i].snake;
		if (snake) {
			if(snake.hasCrashedIntoWall(this.settings.width, this.settings.height)){
				if(this.settings.teleportationAllowed){
					var foodEaten = snake.teleportHead(this.settings.width, this.settings.height, this.food);
					if (foodEaten) $(this).trigger("foodeaten", foodEaten);
				}
				else{
				var newScore = this.players[i].killSnake();
					if(callback){
						callback(this.players[i]);
					}
					$(this).trigger("snakedied", {'player' :this.players[i], 'score' : newScore});
				}
			}
		}
	}
	// Delete snakes of players who crashed
	for (var c=0; c<crashedPlayers.length; c++) {
		crashedPlayers[c].snake = null;
	}
};


SnakeGame.prototype.checkForValidation = function(callback) {
	for (var i=0; i<this.players.length; i++){
		var snake = this.players[i].snake;
		var player = this.players[i];
		if (snake){
			if(snake.isInValidationZone(this.settings.width, this.settings.height, this.settings.validationZoneDim)){
				var word = this.mode.validateSnake(player, snake);
				if (!snake.insideValidationZone){
					if(word.score.score > 0){
						player.addToScore(word.score.score);
						$(this).trigger("validationsuccess", {'player': this.players[i],'score': word.score.score, 'word': word.word, 'count' : word.score.count});
						snake.removeAndAwardParts(1);
						snake.insideValidationZone = true;
						if(callback) {
							console.log("insidecallback");
							callback(player);
						}
						
					}else {
						$(this).trigger("validationfailure", {'player': this.players[i], 'word': word.word, 'score' : word.score.score});
						snake.removeAndAwardParts(0);
						snake.insideValidationZone = true;
					}
				}

			} else {
				snake.insideValidationZone = false;
			}
		}
	}

};



SnakeGame.prototype.enablePowerUps = function(callback) {
	for (var s=0; s<this.players.length; s++){
		var snake = this.players[s].snake;
		var indexOfLastPlain = 0;
		var snakeText = "";
		if (snake){
			// powerUp help
			if(this.settings.helpPowerUp){
				if (snake.powerup == "help") {
					for (var i=0; i < snake.partsDetail.length; i++) {
						if (snake.partsDetail[i].type == "text"){
							snakeText = snakeText + snake.partsDetail[i].details;
						} else if (snake.partsDetail[i].type == "plain") {
							indexOfLastPlain = i;
						}
					}
					if(callback){
						var player = {'player' : this.players[s], 'string' : snakeText, 'indexOfLastPlain' : indexOfLastPlain};
						callback(player);
					}
					
					
					
					
					snake.powerup = "zero";
				}
				
			}
			
		}
	}

}


SnakeGame.prototype.respawn = function(pos) {
	for (var i=0; i<this.players.length; i++){
		var player = this.players[i];
		if (player.id == pos.id) {
			player.respawnSnake(pos.x, pos.y, pos.direction);
		}
	}
}

SnakeGame.prototype.enableHelp = function(result) {
	
	for (var i=0; i<this.players.length; i++){
		if (this.players[i].id == result.playerID){
			this.players[i].setHelpPowerUp(result);
		}
	}
	
};


SnakeGame.prototype.resetGame = function() {
	for (var i = 0; i < this.players.length; i++) {
		if (this.players[i].snake) {
			this.players[i].killSnake();
		}
		this.players[i].score = 0;
		this.players[i].validated = [];
	}
	this.food = [];
};




/**
 * All methods below are for debugging and testing
 */
SnakeGame.prototype.showText = function() {
	console.log("showText");
	$("#gameInfo").addClass("show");
}



SnakeGame.prototype.writeSnake = function() {
	for (var i=0; i<this.players.length; i++){
		var snake = this.players[i].snake;
		if(snake) {
			var string = "";
			for (var s=0; s<snake.partsDetail.length; s++) {
				if (snake.partsDetail[s].type == "text"){
					string += snake.partsDetail[s].details;
				}
			}
			console.log(string);
		}
	}
}




SnakeGame.prototype.testForId = function() {
	for (var i=0; i<this.players.length; i++){
		if (this.players[i].id == this.socketId) {
			console.log(this.players[i].id + "==" + this.socketId);
		}
	}
	
}






if(typeof exports != 'undefined') module.exports = SnakeGame;