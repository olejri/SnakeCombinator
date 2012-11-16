function SnakeGame() {
	this.players = [];
	this.food = [];
	
	this.savedFoodSpawnChance = 0.0; // Remove from client in future
}
SnakeGame.prototype.addPlayer = function(player) {
	var randX = utils.rand(2,this.settings.width-2);
	var randY = utils.rand(2,this.settings.height-2);
	var randDirection = ['left', 'up', 'down'][utils.rand(0,2)];
	player.createSnake(randX, randY, randDirection);
	this.players.push(player);
};
SnakeGame.prototype.addFood = function(food) {
	this.food.push(food);
};
SnakeGame.prototype.deletePlayerById = function(id) {
	for (var i=0; i<this.players.length; i++) {
		if (this.players[i].id == id) return this.players.splice(i,1)[0];
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
			if (player.snake) player.snake.move(tick[player.id]);
		}
		// Event detections for current tick
		if (!this.settings.selfCrashAllowed) this.checkForSelfCrash();
		if (!this.settings.otherCrashAllowed) this.checkForCrash();
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
				crashedCallback(this.players[i]);
				this.players[i].snake = null;
			}
		}
	}
};
SnakeGame.prototype.checkForCrash = function(crashedCallback) {
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
					crashedPlayers.push(this.players[i]);
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
SnakeGame.prototype.rollForFoodSpawn = function() {
	var avgChanceIncrement = 1/(this.settings.foodSpawnRate*this.settings.speed);
	var chanceIncrement = utils.randDec(0.0, avgChanceIncrement*2);
	this.savedFoodSpawnChance = this.savedFoodSpawnChance + chanceIncrement;
	//console.log("Increasing chance by "+chanceIncrement+" to "+this.savedFoodSpawnChance+" when average was "+avgChanceIncrement);
	if (this.savedFoodSpawnChance > Math.random()) {
		this.savedFoodSpawnChance -= 1.0;
		return this.getRandomFoodPos();
	}
	else return false;
};
/**
 * Add a random food to an open space on the game board.
 * Note: Function averages at 8ms runtime at my computer (andre) with a 200x200 sized game.
 */
SnakeGame.prototype.getRandomFoodPos = function() {
	// Create empty two dimensional array of positions
	var positions = new Array(this.settings.width);
	for (var x=0; x<this.settings.width; x++) {
		positions[x] = new Array(this.settings.height);
	}
	// Iterate over all snake parts and set the positions as taken
	for (var i=0; i<this.players.length; i++) {
		for (var p=0; p<this.players[i].snake.parts.length; p++) {
			var part = this.players[i].snake.parts[p];
			if ((positions.length > part.x)&&(part.x >= 0)) {
				if ((positions[part.x].length > part.y)&&(part.y >= 0)) {
					positions[part.x][part.y] = true 
				}
			}
		}
	}
	// Iterate over all food and set positions as taken
	for (var i=0; i<this.food.length; i++) {
		positions[this.food[i].x][this.food[i].y] = true;
	}
	// Create one dimensional array of FREE positions
	var freePositions = [];
	for (var x=0; x<positions.length; x++) {
		for (var y=0; y<positions[x].length; y++) {
			if (positions[x][y] != true) freePositions.push({'x': x, 'y': y});
		}
	}
	if (freePositions.length != 0) {
		var randomPosition = freePositions[utils.rand(0,freePositions.length-1)];
		return randomPosition;
	}
	else console.log("No space for food.");

}
if(typeof exports != 'undefined'){
	module.exports = SnakeGame;
}