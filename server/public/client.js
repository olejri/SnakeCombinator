// TOP VARIABLES
var gui;
var sgame;
var utils = new Utils();
//var communicator; In addition a communicator "singleton" created in communicator.js

$(document).ready(function() {
	
	communicator.connect(function(serverGameObj){
		// This callback is run when the game data has been received
		sgame = new ClientSnakeGame();
		sgame.initFromJsonObject(serverGameObj);

		gui = new GameGUI({
			GSD: 20, // Game Square Dimension, width/height of each game square
			container: 'gamegui', 
			gameWidth: sgame.settings.width,
			gameHeight: sgame.settings.height,
		});
		
		// INITIATE GUI
		var MAX_FPS = 15;
		setInterval(function(){
			var didDraw = gui.draw(sgame.getGUIElements());
			if (!didDraw) console.log("Did not draw!!");
		}, 1000/MAX_FPS);
	});

	// Create the input capturing mapping
	var keyCodeNameMapper = {
			37: 'left',		// Left arrow
			38: 'up',		// Up arrow
			39: 'right',	// Right arrow
			40: 'down', 	// Down arrow
			65: 'left',		// a
			87: 'up',		// w
			68: 'right',	// d
			83: 'down',		// s
	}
	
	$(document).on('keydown', function(event) {
		var moveDirection = keyCodeNameMapper[event.keyCode];
		if (moveDirection) communicator.emitMovement(moveDirection);
		event.preventDefault();
	});
});