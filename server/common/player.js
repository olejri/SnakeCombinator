if (typeof require != 'undefined') var Snake = require('./snake');

function Player(id) {
	this.id = id;
	this.nick = "nonicked"
	this.lastMoveInput = null; 	// Last keyboard input move, not neccesary actual move
	this.snake;
	this.validated = [];
	this.score = 0;
	
	
	
	
	
	
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
		
		// adding tail
		parts.push({'x': startX+1+startBody.length, 'y': startY});
		partsDetail.push({'type': 'image', 'details': 'tail'});
		
		this.snake = new Snake(parts, partsDetail, startDirection);
	}
	
	
	this.addToValidated = function(word) {
		this.validated.push(word);
		var count = 0;
		for (var i=0; i<this.validated.length; i++) {
			if (word == this.validated[i]) count++;
		}
		return {'word': word, 'count': count};
	}
	
	this.addToScore = function(score) {
		this.score = this.score + score;
	}
	
	
	
}

if(typeof exports != 'undefined') module.exports = Player;