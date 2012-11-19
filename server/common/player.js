if (typeof require != 'undefined') var Snake = require('./snake');

function Player(id) {
	this.id = id;
	this.nick = "nonicked"
	this.lastMoveInput = null; 	// Last keyboard input move, not neccesary actual move
	this.snake;
	
	this.killSnake = function() {
		this.snake = null;
	};
	
	this.createSnake = function(startX, startY, startDirection, startBody) {
		var parts = [{'x': startX, 'y': startY}];
		var partsDetail = [{'type': 'image', 'details': 'head'}];
		for (var i=0; i<startBody.length; i++) {
			parts.push({'x': startX+1+i, 'y': startY});
			partsDetail.push({'type': 'text', 'details': startBody[i]});
		}
		this.snake = new Snake(parts, partsDetail, startDirection);
	}
}

if(typeof exports != 'undefined') module.exports = Player;