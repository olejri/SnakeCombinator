var eventhandler = new function() {
	
	this.joinedGame = function() {
		console.log("Joined game");
	}
	
	this.playerJoined = function(player) {
		console.log("User "+player.id+" connected");
	}
	
	this.playerLeft = function(player) {
		console.log("User "+player.id+" disconnected");
	}
	
	this.playerDied = function(player) {
		console.log("Player "+player.id+" died");
	}
	
}