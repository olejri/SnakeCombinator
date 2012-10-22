function Player(id) {
	this.id = id;
	this.nick = "nonicked"
	this.moves = [];
	this.lastMoveInput = null; 	// Last move input from player, not to be confused by
								// the last element in the moves array, since lastMoveInput
								// can change multiple times before the server read it and set
								// it to the player move.
}

if(typeof exports != 'undefined'){
	module.exports = Player;
}