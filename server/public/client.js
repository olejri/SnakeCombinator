// TOP VARIABLES
var gui;
var sgame;
var utils = new Utils();
//var communicator; In addition a communicator "singleton" created in communicator.js
//var eventhandler; Singleton created in eventhandler.js

$(document).ready(function() {
	communicator.connect(function(serverGameObj){
		// This callback is run when the game data has been received
		sgame = new ClientSnakeGame();
		eventhandler.attatchGameTriggers(sgame);
		sgame.initFromJsonObject(serverGameObj);
		sgame.socketID = communicator.getID();

		gui = new GameGUI({
			GSD: 20, // Game Square Dimension, width/height of each game square
			container: 'gamegui', 
			gameWidth: sgame.settings.width,
			gameHeight: sgame.settings.height,
			validationZoneDim: sgame.settings.validationZoneDim,
		});
		
		// INITIATE GUI
		var MAX_FPS = 100;
		setInterval(function(){
			var didDraw = gui.draw(sgame.getGUIElements());
			if (!didDraw) console.log("Did not draw!!");
		}, 1000/MAX_FPS);

	});

});

