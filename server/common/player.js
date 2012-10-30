function Player(id) {
	this.id = id;
	this.nick = "nonicked"
	this.moves = [];
	this.lastMoveInput = null; 	// Last keyboard input move, not neccesary actual move
	this.snake;
	
	this.createSnake = function(startX, startY) {
		this.snake = new Snake(startX, startY);
	}
}

if(typeof exports != 'undefined'){
	module.exports = Player;
}