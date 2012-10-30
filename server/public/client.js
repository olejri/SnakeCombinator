var gui;
var sgame;

$(document).ready(function() {
	var GAME_WIDTH = 30;
	var GAME_HEIGHT = 30;
	
	sgame = new SnakeGame(GAME_WIDTH, GAME_HEIGHT);
	sgame.startGame();
	
	communicator.connect("http://localhost");
	gui = new GameGUI({
		container: 'gamegui', 
		gameWidth: GAME_WIDTH,
		gameHeight: GAME_HEIGHT
	});
	
	gui.draw(sgame.getBoardElements());
	
	var MAX_FPS = 10;
	setInterval(function(){
		var didDraw = gui.draw(sgame.getBoardElements());
		if (!didDraw) console.log("Did not draw!!");
	}, 1000/MAX_FPS);

});


var utils = {
		rand: function(min, max) {
			return min + Math.floor(Math.random()*(max-min+1));
		},
}