$(document).ready(function() {
	sgame = new SnakeGame();
	communicator.connect("http://localhost");
	var gui = new GameGUI({
		container: 'gamegui', 
		gameWidth: 30,
		gameHeight: 30
	});
	
	var MAX_FPS = 60;
	setInterval(function(){
		var didDraw = gui.draw(sgame.getBoardElements());
		if (!didDraw) console.log("Did not draw!!");
	}, 1000/MAX_FPS);

});