function Player(id) {
	this.id = id;
	this.nick = "nonicked"
	this.moves = [];
	this.lastMoveInput = null;
}

if(typeof exports != 'undefined'){
	module.exports = Player;
}