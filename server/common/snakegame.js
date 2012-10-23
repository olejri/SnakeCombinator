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
	
}

if(typeof exports != 'undefined'){
	module.exports = SnakeGame;
}