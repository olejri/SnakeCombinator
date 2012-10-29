function SnakeGame() {
	this.players = [];
	var board = [];
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
SnakeGame.prototype.applyTicks = function() {

}
SnakeGame.prototype.getBoardElements = function() {
	
	var elements = [];
	
	var posX = Math.floor(Math.random()*30);
	var posY = Math.floor(Math.random()*30);
	
	elements.push(new BoardElement({
		type: 'head',
		x: posX,
		y: posY
	}));
	elements.push(new BoardElement({
		type: 'body',
		x: posX+1,
		y: posY
	}));
	elements.push(new BoardElement({
		type: 'body',
		x: posX+2,
		y: posY
	}));
	
	return elements;
	
}

if(typeof exports != 'undefined'){
	module.exports = SnakeGame;
}