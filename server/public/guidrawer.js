var GSD = 20; // Game Square Dimension, width/height of each game square

function GameGUI(options) {
	
	var IS_DRAWING = false;
	
	// Load images
	var imgDir = "./images/"
	var sources = {
			head: 'head.png',
			body: 'body.png',
	}
	this.images = {};
	for (var type in sources) {
		this.images[type] = new Image();
		this.images[type].onload = function() {
			console.log("Loading "+type);
		}
		this.images[type].src = imgDir + sources[type];
	}
	
	
	// Set up game board
	stage = new Kinetic.Stage({
		container : options.container,	// HTML element add canvas to
		width : GSD*options.gameWidth, 			// Canvas dimension
		height : GSD*options.gameHeight,		// Canvas dimension
	});
	
	snakeLayer = new Kinetic.Layer();
	stage.add(snakeLayer);
	stage.draw();
	
	/**
	 * By supplying elements to be drawn, this method will refresh the game.
	 */
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
				image : this.images[ele.type],
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
		else console.log("DrawImageError: Type not found");
		return imageObj;
	}
	/*
	var imgObj = new Image();
	imgObj.src = "./images/body.png";
	imgObj.onload = function() {
		var snakePart = new Kinetic.Image({
			x : 20,
			y : 20,
			image : imgObj,
		});
		snakeLayer.add(snakePart);
		snakeLayer.draw();
	}
	
    var rect = new Kinetic.Rect({
        x: 239,
        y: 75,
        width: 100,
        height: 50,
        fill: 'green',
        stroke: 'black',
        strokeWidth: 4
      });
    snakeLayer.add(rect);
	
	snakeLayer.draw();*/
	
}

function BoardElement(data) {
	this.type = data.type;
	this.details = data.details;
	this.x = data.x;
	this.y = data.y;
}