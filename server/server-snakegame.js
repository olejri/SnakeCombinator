var SnakeGame = require('./common/snakegame');
var Utils = require('./common/utils');
var utils = new Utils();

//Inherits from SnakeGame
ServerSnakeGame.prototype = new SnakeGame();
ServerSnakeGame.prototype.constructor = ServerSnakeGame;
function ServerSnakeGame(customSettings, mode) {

	// Default settings
	this.settings = {
			'width'				: 30,	// Game squares in width
			'height'			: 30,	// Game squares in height
			'playersToStart'	: 2,	// Players needed for game to start ticking
			'speed'				: 2, 	// Snake moves per second
			'foodSpawnRate'		: 1,  // Average seconds between each food spawn
			'powerUpSpawnRate'  : 2, // Average seconds between each powerUp spawn
			'selfCrashAllowed'	: false,// A snake can crash with it's own body?
			'otherCrashAllowed'	: false,// A snake can crash with other snakes?
			'teleportationAllowed'	: false,// A snake can crash with wall or teleport?
			'validationZoneDim' : 2, //
			'score' : 1000, // A player wins if he reaches to score for that level
	};

	// Overwrite default values with given options
	for (var setting in customSettings) {
		if (customSettings.hasOwnProperty(setting)) {
			this.settings[setting] = customSettings[setting];
		}
	}

	this.mode = mode;

	this.started = false;
	this.runGameInterval;

	this.savedFoodSpawnChance = 0.0;
	this.savedPowerUpSpawnChance = 0;

};
ServerSnakeGame.prototype.toJsonObject = function() {
	return {
		settings: this.settings,
		modeType: this.mode.constructor.name,
		mode: this.mode,
		players: this.players,
		food: this.food,
	}
};
ServerSnakeGame.prototype.addPlayer = function(player) {
	var randPos = this.getRandomOpenPos();
	if (randPos) {
		var randDirection = ['left', 'up', 'down'][utils.rand(0,2)];
		player.createSnake(randPos.x, randPos.y, randDirection, this.mode.getStartBody());
		this.players.push(player);
		$(this).trigger("playerjoined", player);
	}
	else console.log("No space for player");
};
ServerSnakeGame.prototype.generateTick = function() {
	var tick = {};
	for (var i=0; i<this.players.length; i++) {
		var player = this.players[i];
		if (player.lastMoveInput) { // Player have set a moved direction
			tick[player.id] = player.lastMoveInput;
			player.lastMoveInput = null;
		}
	}

	this.applyTicks([tick]);
	var foodRoll = this.rollForFoodSpawn();
	if(foodRoll) this.addFood(foodRoll);
	this.checkForRespawn();
	return tick;
};



/**
 * Using the speed and spawn rate setting this function will increment the
 * chance to roll for a food every time the function is run. Eventually it
 * will be a 100% chance and a food will spawn. 
 * 
 * When a food spawn the spawn chance will be decreased by 100%. This ensures 
 * that over time food will have spawned at an average equal to the 
 * foodSpawnRate setting.
 */
SnakeGame.prototype.rollForFoodSpawn = function() {
	var avgChanceIncrement = 1/(this.settings.foodSpawnRate*this.settings.speed);
	var chanceIncrement = utils.randDec(0.0, avgChanceIncrement*2);
	this.savedFoodSpawnChance = this.savedFoodSpawnChance + chanceIncrement;
	//console.log("Increasing chance by "+chanceIncrement+" to "+this.savedFoodSpawnChance+" when average was "+avgChanceIncrement);
	if (this.savedFoodSpawnChance > Math.random()) {
		this.savedFoodSpawnChance -= 1.0;
		this.savedPowerUpSpawnChance += 1;
		var foodPos = this.getRandomOpenPos();
		if (foodPos) {
			if (this.settings.powerUpSpawnRate < this.savedPowerUpSpawnChance) {
				this.savedPowerUpSpawnChance = 0;
				return this.getRandomPowerUp(foodPos);
			}
			else return this.mode.convertToModeFood(foodPos);
		}

		else console.log("No space for food");
	}
	else return false;
};
/**
 * Get a random position that is not occupied
 * Note: Function averages at 8ms runtime at my computer (andre) with a 200x200 sized game.
 * 
 * @returns {x: positionX, y: positionY}
 */
SnakeGame.prototype.getRandomOpenPos = function() {
	// Create empty two dimensional array of positions
	var positions = new Array(this.settings.width);
	for (var x=0; x<this.settings.width; x++) {
		positions[x] = new Array(this.settings.height);
	}
	// Iterate over all snake parts and set the positions as taken
	for (var i=0; i<this.players.length; i++) {
		if (this.players[i].snake) {
			for (var p=0; p<this.players[i].snake.parts.length; p++) {
				var part = this.players[i].snake.parts[p];
				if ((positions.length > part.x)&&(part.x >= 0)) {
					if ((positions[part.x].length > part.y)&&(part.y >= 0)) {
						positions[part.x][part.y] = true 
					}
				}
			}
		}
	}
	// Iterate over all food and set positions as taken
	for (var i=0; i<this.food.length; i++) {
		positions[this.food[i].x][this.food[i].y] = true;
	}
	// Set validation zone as taken
	var vZones = utils.vZonePositions(this.settings.width, this.settings.height, this.settings.validationZoneDim);
	for (var i=0; i<vZones.length; i++) {
		positions[vZones[i].x][vZones[i].y] = true;
	}

	// Create one dimensional array of FREE positions
	var freePositions = [];
	for (var x=0; x<positions.length; x++) {
		for (var y=0; y<positions[x].length; y++) {
			if (positions[x][y] != true) freePositions.push({'x': x, 'y': y});
		}
	}

	if (freePositions.length != 0) {
		var randomPosition = freePositions[utils.rand(0,freePositions.length-1)];
		return randomPosition;
	}
	else return false;

}

SnakeGame.prototype.getRandomPowerUp = function(powerUp) {
	powerUp.details = "help";
	powerUp.type = "powerup";
	return powerUp;

};


SnakeGame.prototype.checkForRespawn = function() {
	for (var i=0; i<this.players.length; i++){
		var snake = this.players[i].snake;
		var player = this.players[i];

		if(snake) {

		}
		else {
			var randPos = this.getRandomOpenPos();
			if (randPos) {
				var randDirection = ['left', 'up', 'down'][utils.rand(0,2)];
				var pos = {'x': randPos.x, 'y': randPos.y, 'direction': randDirection};
				this.pos = pos;
				$(this).trigger("sendPos", pos);
			}
		}
	}
};





SnakeGame.prototype.testGameRandom = function() {
	var number = utils.rand(0, 10);
	this.testGame(number);

}

SnakeGame.prototype.resetGame = function() {
	this.food = [];
};

module.exports = ServerSnakeGame; // Can require it in node.js