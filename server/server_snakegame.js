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
        'selfCrashAllowed'	: false,// A snake can crash with it's own body?
        'otherCrashAllowed'	: false,// A snake can crash with other snakes?
	};

	// Overwrite default values with given options
    for (var setting in customSettings) {
        if (customSettings.hasOwnProperty(setting)) {
            this.settings[setting] = customSettings[setting];
        }
    }
 
    //
	this.started = false;
	this.runGameInterval;
	
}
ServerSnakeGame.prototype.toClientJson = function() {
	return {
		settings: this.settings,
		players: this.players,
	}
};
ServerSnakeGame.prototype.checkForSelfCrash = function() {
	SnakeGame.prototype.checkForSelfCrash.call(this, function(){});
}
module.exports = ServerSnakeGame;