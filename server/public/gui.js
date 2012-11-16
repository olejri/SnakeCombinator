function GameGUI(options) {
	
	// Avoids that the drawing methods runs twice at the same time
	var IsDrawing = false;
	
	// Load images
	var imgDir = "./images/"
	var sources = {
			head: 'head.png',
			body: 'body.png',
			food: 'food.png',
	};
	var images = {};
	for (var type in sources) {
		images[type] = new Image();
		images[type].onload = function() {
			console.log("Preloading image: "+this.src);
		}
		images[type].src = imgDir + sources[type];
	}
	
	// Set up game canvas
	var stage = new Kinetic.Stage({
		container : options.container,	// HTML element add canvas to
		width : options.GSD*options.gameWidth, 			// Canvas dimension
		height : options.GSD*options.gameHeight,		// Canvas dimension
	});
	
	// Layers
	var snakeLayer = new Kinetic.Layer();
	stage.add(snakeLayer);
	
	var foodLayer = new Kinetic.Layer();
	stage.add(foodLayer);
	
	stage.draw(); // IS IT NEEDED??? need to test
	
	/**
	 * By supplying elements to be drawn, this method will refresh the game.
	 */
	this.draw = function(allElements) {
		
		// Stop drawing if a previously run draw() hasn't completed		
		if (IsDrawing) return false;
		
		IsDrawing = true;
		if(!drawSnakes(allElements.snakeElements)) {
			IsDrawing = false;
			return false;
		}
		if(!drawFood(allElements.foodElements)) {
			IsDrawing = false;
			return false;
		}
		
		IsDrawing = false;
		log.addDraw();
		return true;
		
	}
	
	
	/*************** PRIVATE METHODS ***************/
	
	function drawSnakes(elements) {
		
		try {
			snakeLayer.removeChildren();
			
			for (var i=0; i<elements.length; i++) {
				drawImageOn(elements[i], snakeLayer);
			}
			snakeLayer.draw();
			
			return true;
		} catch(err) {
			console.log("Failed at drawing snake image: "+err);
			return false;
		} 
		
	};
	
	function drawFood(elements) {
		
		try {
			foodLayer.removeChildren();
			
			for (var i=0; i<elements.length; i++) {
				drawImageOn(elements[i], foodLayer);
			}
			foodLayer.draw();
			
			return true;
		} catch(err) {
			console.log("Failed at drawing food image: "+err);
			return false;
		} 
		
	};
	
	function drawImageOn(element, layer) {
		var snakePart = new Kinetic.Image({
			x : options.GSD * element.x,
			y : options.GSD * element.y,
			image : images[element.type],
		});
		layer.add(snakePart);
	};
	
	
}

function BoardElement(data) {
	this.type = data.type;
	this.details = data.details;
	this.x = data.x;
	this.y = data.y;
}