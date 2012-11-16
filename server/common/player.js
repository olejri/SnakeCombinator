function Player(id) {
	this.id = id;
	this.nick = "nonicked"
	this.lastMoveInput = null; 	// Last keyboard input move, not neccesary actual move
	this.snake;
	
	this.createSnake = function(startX, startY, startDirection) {
		var parts = [{x: startX, y: startY}]
		// Testdata
		parts.push({x: startX+1, y: startY})
		parts.push({x: startX+2, y: startY})
		parts.push({x: startX+3, y: startY})
		parts.push({x: startX+4, y: startY})
		parts.push({x: startX+5, y: startY})
		parts.push({x: startX+6, y: startY})
		parts.push({x: startX+7, y: startY})
		parts.push({x: startX+8, y: startY})
		parts.push({x: startX+9, y: startY})
		parts.push({x: startX+10, y: startY})
		// Create
		this.snake = new Snake(parts, startDirection);
	}
}

if(typeof exports != 'undefined'){
	module.exports = Player;
}