// TOP VARIABLES
var gui;
var sgame;
var utils = new Utils();
//var communicator; In addition comes communicator variable created in communicator.js

$(document).ready(function() {
	
	communicator.connect("http://78.91.6.242/", function(serverGameObj){
		// This callback is run when the game data has been received
		
		sgame = new ClientSnakeGame(serverGameObj);

		gui = new GameGUI({
			GSD: 20, // Game Square Dimension, width/height of each game square
			container: 'gamegui', 
			gameWidth: sgame.settings.width,
			gameHeight: sgame.settings.height,
		});
		
		// INITIATE GUI
		var MAX_FPS = 30;
		setInterval(function(){
			var didDraw = gui.draw(sgame.getBoardElements());
			if (!didDraw) console.log("Did not draw!!");
		}, 1000/MAX_FPS);
	});

});