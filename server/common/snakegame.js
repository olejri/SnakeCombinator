function SnakeGame() {
	this.mode;
	this.settings;
	this.players = [];
	this.food = [];	// Each food contains x, y and a type.
}
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
			if (player.snake) player.snake.move(tick[player.id], this.food);
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

if(typeof exports != 'undefined') module.exports = SnakeGame;