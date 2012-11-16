var SnakeGame = require('./common/snakegame');

// Inherits from SnakeGame
ServerSnakeGame.prototype = new SnakeGame();
ServerSnakeGame.prototype.constructor = ServerSnakeGame;
function ServerSnakeGame(customSettings) {
	
	// Default settings
	this.settings = {
        'width'				: 30,	// Game squares in width
        'height'			: 30,	// Game squares in height
        'playersToStart'	: 2,	// Players needed for game to start ticking
        'speed'				: 2, 	// Snake moves per second
        'foodSpawnRate'		: 1,		// Average seconds between each food spawn
        'selfCrashAllowed'	: false,// A snake can crash with it's own body?
        'otherCrashAllowed'	: false,// A snake can crash with other snakes?
	};

	// Overwrite default values with given options
    for (var setting in customSettings) {
        if (customSettings.hasOwnProperty(setting)) {
            this.settings[setting] = customSettings[setting];
        }
    }
 
	this.started = false;
	this.runGameInterval;
	
	//this.savedFoodSpawnChance = 0.0;
	
}
ServerSnakeGame.prototype.toClientJson = function() {
	return {
		settings: this.settings,
		players: this.players,
		food: this.food,
	}
};
ServerSnakeGame.prototype.generateTick = function() {
	var tick = {};
	for (var i=0; i<this.players.length; i++) {
		var player = this.players[i];
		var lastMove = player.lastMoveInput;
		player.snake.move(lastMove); // Apply move to snake

		if (lastMove) {
			tick[player.id] = lastMove;
			player.lastMoveInput = null;
		}
	}
	
	var foodRoll = this.rollForFoodSpawn();
	if(foodRoll) this.addFood(foodRoll);
	
	return {'movement': tick, 'foodSpawn': foodRoll};
};



module.exports = ServerSnakeGame; // Can require it in node.js