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
	//this.enablePowerUps();
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
				this.players[i].killSnake();
				if(callback){
					callback(this.players[i]);
				}
				$(this).trigger("snakedied", this.players[i]);
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
					this.players[i].killSnake();
					$(this).trigger("snakedied", this.players[i]);
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
					this.players[i].killSnake();
					if(callback){
						callback(this.players[i]);
					}
					$(this).trigger("snakedied", this.players[i]);
				}
			}
		}
	}
	// Delete snakes of players who crashed
	for (var c=0; c<crashedPlayers.length; c++) {
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
				if (!snake.insideValidationZone){
					if(word.score > 0){
						player.addToScore(word.score);
						$(this).trigger("validationsuccess", {'player': this.players[i],'score': word.score, 'word': word.word});
						snake.removeAndAwardParts(1);
						snake.insideValidationZone = true;

					}else {
						$(this).trigger("validationfailure", {'player': this.players[i], 'word': word.word});
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


SnakeGame.prototype.testForId = function() {
	for (var i=0; i<this.players.length; i++){
		if (this.players[i].id == this.socketId) {
			console.log(this.players[i].id + "==" + this.socketId);
		}
	}

}

SnakeGame.prototype.checkForGameOver = function() {
	for (var i=0; i<this.players.length; i++){
		var snake = this.players[i].snake;
		var player = this.players[i];
		if (snake){
			if (player.score >= this.settings.score){
				$(this).trigger("gameover", player);
				return true;

			}
		}
	}
	return false;

};

SnakeGame.prototype.enablePowerUps = function() {
	for (var i=0; i<this.players.length; i++){
		var snake = this.players[i].snake;
		var indexOfLastPlain = 0;
		if (snake){
			// powerUp help
			if (snake.powerup == "help") {
				var string = "";
				for (var i=0; i < snake.partsDetail.length; i++) {
					if (snake.partsDetail[i].type == "text"){
						string = string + snake.partsDetail[i].details;
					} else if (snake.partsDetail[i].type == "plain") {
						indexOfLastPlain = i;
					}
				}
				var result = this.mode.getHelp(string);
				console.log(result.append +"string: " + result.string[0] + result.string[1]);
				if (result.append) {
					var index = snake.parts.length-1;
					var x = snake.parts[index].x;
					var y = snake.parts[index].y;

					for (var i=0; i < result.string.length; i++){
						if (snake.parts[index].direction == "left") snake.parts.splice(index+1+i, 0, {'x': x+(i+1), 'y': y, 'direction': "left"});
						else if (snake.parts[index].direction == "right") snake.parts.splice(index+1+i, 0, {'x': x-(i+1), 'y': y, 'direction': "right"});
						else if (snake.parts[index].direction == "top") snake.parts.splice(index+1+i, 0, {'x': x, 'y': y-(i+1), 'direction': "top"});
						else if (snake.parts[index].direction == "down") snake.parts.splice(index+1+i, 0, {'x': x, 'y': y+(i+1), 'direction': "down"});
						snake.partsDetail.splice(index+i, 0, {'type': "text", 'details': result.string[i]});
					}
				} 
				else {
					if (snake.parts.length >= 4) {
						for (var i=0; i < result.string.length; i++){
							snake.partsDetail[indexOfLastPlain+i+1] = {'type': "text", 'details': result.string[i]};
						}
						snake.partsDetail[indexOfLastPlain+3] = {'type': "image", 'details': 'tail'};
						snake.cutFromIndex(indexOfLastPlain+4);
					} else if (snake.parts.length == 3) {
						var index = snake.parts.length-1;
						var x = snake.parts[index].x;
						var y = snake.parts[index].y;

						if (snake.parts[index].direction == "left") snake.parts.splice(index+1, 0, {'x': x+1, 'y': y, 'direction': "left"});
						else if (snake.parts[index].direction == "right") snake.parts.splice(index+1, 0, {'x': x-1, 'y': y, 'direction': "right"});
						else if (snake.parts[index].direction == "top") snake.parts.splice(index+1, 0, {'x': x, 'y': y-1, 'direction': "top"});
						else if (snake.parts[index].direction == "down") snake.parts.splice(index+1, 0, {'x': x, 'y': y+1, 'direction': "down"});
						snake.partsDetail[indexOfLastPlain+1] = {'type': "text", 'details': result.string[0]};
						snake.partsDetail.splice(index+indexOfLastPlain, 0, {'type': "text", 'details': result.string[1]});

					} else if (snake.parts.length == 2){
						var index = snake.parts.length-1;
						var x = snake.parts[index].x;
						var y = snake.parts[index].y;
						for (var i=0; i < result.string.length; i++){
							if (snake.parts[index].direction == "left") snake.parts.splice(index+1+i, 0, {'x': x+(i+1), 'y': y, 'direction': "left"});
							else if (snake.parts[index].direction == "right") snake.parts.splice(index+1+i, 0, {'x': x-(i+1), 'y': y, 'direction': "right"});
							else if (snake.parts[index].direction == "top") snake.parts.splice(index+1+i, 0, {'x': x, 'y': y-(i+1), 'direction': "top"});
							else if (snake.parts[index].direction == "down") snake.parts.splice(index+1+i, 0, {'x': x, 'y': y+(i+1), 'direction': "down"});
							snake.partsDetail.splice(index+i, 0, {'type': "text", 'details': result.string[i]});
						}
					}
				}
				snake.powerup = "zero";
			}
		}
	}

}

//SnakeGame.prototype.checkForRespawn = function() {
//for (var i=0; i<this.players.length; i++){
//var snake = this.players[i].snake;
//var player = this.players[i];

//if(snake) {
//}
//else {
//if (player.respawnTimer == 3){
//var pos = this.pos;
//player.respawnSnake(pos.x, pos.y, pos.direction);
//player.respawnTimer = 0;
//} else {
//player.respawnTimer++;
//}
//}
//}
//}


SnakeGame.prototype.respawn = function(pos) {
	for (var i=0; i<this.players.length; i++){
		var player = this.players[i];
		if (player.id == pos.id) {
			player.respawnSnake(pos.x, pos.y, pos.direction);
		}
	}
}







if(typeof exports != 'undefined') module.exports = SnakeGame;