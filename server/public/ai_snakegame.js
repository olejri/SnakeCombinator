// Inherits from ClientSnakeGame

AiSnakeGame.prototype = new ClientSnakeGame(); 
AiSnakeGame.prototype.constructor = AiSnakeGame;
function AiSnakeGame() {

	
}
/**
 * Overwrite SnakeGame method, but still run it. However this method runs the
 * ai tick decision afterwards.
 */
AiSnakeGame.prototype.applyTicks = function(newTicks) {
	SnakeGame.prototype.applyTicks.call(this, newTicks);
	this.SimpleAIMove();
};
/**
 * Decides what move to do
 */
AiSnakeGame.prototype.SimpleAIMove = function() {
	var snake = this.getPlayerById(communicator.getID()).snake; // Controlled snake
	if (snake) {
		var pos = snake.parts[0];	// Position of controlled snake's head
		
		var safeDirections = new DirectionArray(snake.getAllowedDirections());
		
		// Avoid hitting edges of map
		if (pos.x -1 < 0) safeDirections.remove("left");
		else if (pos.x + 1 > this.settings.width - 1) safeDirections.remove("right");
		if (pos.y -1 < 0) safeDirections.remove("up");
		else if (pos.y + 1 > this.settings.height - 1) safeDirections.remove("down");
		
		communicator.emitMovement(safeDirections.getRandom());
	}
};

function DirectionArray(directions) {
	this.directions = directions;
}
DirectionArray.prototype.remove = function(direction) {
	for (var i=0; i<this.directions.length; i++) {
		if (this.directions[i] == direction) this.directions.splice(i,1);
	}
};
DirectionArray.prototype.get = function(index) {
	return this.directions[index];
}
DirectionArray.prototype.getRandom = function(index) {
	return this.directions[utils.rand(0, this.directions.length-1)];
}