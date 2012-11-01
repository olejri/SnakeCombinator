// TOP VARIABLES
var gui;
var sgame; // Instanciated by the communicator when the game has been received.
var utils = new Utils();
//var communicator; In addition comes communicator variable created in communicator.js

$(document).ready(function() {
	
	communicator.connect("http://localhost", function(gameObj){
		// This callback is run when the game data has been received
		sgame = new SnakeGame();
		sgame.makeGameFromObj(gameObj);
		
		gui = new GameGUI({
			container: 'gamegui', 
			gameWidth: sgame.width,
			gameHeight: sgame.height,
		});
		
		// INITIATE GUI
		var MAX_FPS = 30;
		setInterval(function(){
			var didDraw = gui.draw(sgame.getBoardElements());
			if (!didDraw) console.log("Did not draw!!");
		}, 1000/MAX_FPS);
	});

});