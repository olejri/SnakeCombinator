var GSD = 20; // Game Square Dimension, width/height of each game square

function GameGUI(options) {
	
	var IS_DRAWING = false;

	var gameWidth = options.gameWidth;
	var gameHeight = options.gameHeight;
	
	var stage = new Kinetic.Stage({
		container : options.container,	// HTML element add canvas to
		width : GSD*gameWidth, 			// Canvas dimension
		height : GSD*gameHeight,		// Canvas dimension
	});
	
	var snakeLayer = new Kinetic.Layer();
	stage.add(snakeLayer);
	
	this.draw = function(elements) {
		
		// Stop drawing if a previously run draw() hasn't completed
		if (IS_DRAWING) return false;
		
		IS_DRAWING = true;
		
		snakeLayer.removeChildren();
		
		for (var i=0; i<elements.length; i++) {
			var ele = elements[i];
			
			var snakePart = new Kinetic.Image({
				x : GSD * ele.x,
				y : GSD * ele.y,
				image : getImageObjFromType(ele.type),
			});
			snakeLayer.add(snakePart);
		}
		
		snakeLayer.draw();
		log.addDraw();
		IS_DRAWING = false;
		
		return true;
		
	}
	/**
	 * Returns an Image element object with .src attribute set according to
	 * the given element type.
	 */
	var getImageObjFromType = function(type) {
		var imageObj = new Image();
		if (type == "head") imageObj.src = "./images/head.png";
		else if (type == "body") imageObj.src =  "./images/body.png";
		return imageObj;
	}
	
}

function BoardElement(data) {
	this.type = data.type;
	this.details = data.details;
	this.x = data.x;
	this.y = data.y;
}