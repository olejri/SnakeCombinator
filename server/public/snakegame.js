function SnakeGame(width, height) {
	this.width = width;
	this.height = height;
	this.players = [];
	
	this.startGame = function() {
		for (var i=0; i<this.players.length; i++) {
			var randX = utils.rand(2,this.width-2);
			var randY = utils.rand(2,this.height-2);
			this.players[i].createSnake(randX, randY);
		}
	}
}
SnakeGame.prototype.deletePlayerById = function(id) {
	for (var i=0; i<this.players.length; i++) {
		if (this.players[i].id == id) this.players.splice(i,1);
	}
}
SnakeGame.prototype.getPlayerById = function(id) {
	for (var i=0; i<this.players.length; i++) {
		if (this.players[i].id == id) return this.players[i];
	}
	console.log("No player with id "+id);
}
/**
 * Apply new ticks that the communicator has received.
 */
SnakeGame.prototype.applyTicks = function() {
	var newTicks = communicator.popTicks();
	for (var i=0; i<newTicks.length; i++) {
		var tick = newTicks[i];
		for (var p=0; p<this.players.length; p++) {
			this.players[p].snake.move(tick[this.players[p].id]);
		}
	}
}
SnakeGame.prototype.getBoardElements = function() {
	this.applyTicks();
	
	var elements = [];
	
	for (var i=0; i<this.players.length; i++) {
		var snake = this.players[i].snake;
		// Add head to elements list
		elements.push(new BoardElement({
			type: 'head',
			x: snake.parts[0].x,
			y: snake.parts[0].y
		}));
		// Add body parts
		for (var s=1; s<this.players[i].snake.parts.length; s++) {
			elements.push(new BoardElement({
				type: 'body',
				x: snake.parts[s].x,
				y: snake.parts[s].y
			}));
		}
	}

	return elements;
	
}

if(typeof exports != 'undefined'){
	module.exports = SnakeGame;
}