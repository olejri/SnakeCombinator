function GameGUI(options) {
	
	// Options
	var options = options;
	
	// Avoids that the drawing methods runs twice at the same time
	var IsDrawing = false;
	
	// Set up game canvas
	var stage = new Kinetic.Stage({
		container : options.container,	// HTML element add canvas to
		width : options.GSD*options.gameWidth, 			// Canvas dimension
		height : options.GSD*options.gameHeight,		// Canvas dimension
	});
	
	// Layers
	var backgroundLayer = new Kinetic.Layer();
	stage.add(backgroundLayer);

	var snakeLayer = new Kinetic.Layer();
	stage.add(snakeLayer);
	
	var foodLayer = new Kinetic.Layer();
	stage.add(foodLayer);
	
	initBackground();
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
				elements[i].addToLayer(snakeLayer, options.GSD);
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
				elements[i].addToLayer(foodLayer, options.GSD);
			}
			foodLayer.draw();
			
			return true;
		} catch(err) {
			console.log("Failed at drawing food image: "+err);
			return false;
		} 
		
	};
	
	
	function initBackground(){
		var firstValZone = utils.vZonePositions(options.gameWidth, options.gameHeight, options.validationZoneDim)[0];
		var validationZone = new Kinetic.Rect({
	        x: options.GSD*firstValZone.x,
	        y: options.GSD*firstValZone.y,
	        width: options.GSD*options.validationZoneDim,
	        height: options.GSD*options.validationZoneDim,
	        stroke: 'green',
	        strokeWidth: 2,
	        cornerRadius: 4
	      });
			
		backgroundLayer.add(validationZone);
		
		
		backgroundLayer.draw();
	}
	
	
}


function BoardImageElement(values) {
	this.x = values.x;
	this.y = values.y;
	this.imageName = values.image;
}
BoardImageElement.prototype.images = false;
BoardImageElement.prototype.loadImages = function() {
	var imgDir = "./images/"
	var sources = {
			head: 'head.png',
			body: 'body.png',
			food: 'food.png',
			a: 'a.png',
	};
	var images = {};
	for (var imageName in sources) {
		images[imageName] = new Image();
		images[imageName].onload = function() {
			console.log("Preloading image: "+this.src);
		}
		images[imageName].src = imgDir + sources[imageName];
	}
	BoardImageElement.prototype.images = images;
};

BoardImageElement.prototype.addToLayer = function(layer, GSD) {
	if (!this.images) this.loadImages();
	
	var snakePart = new Kinetic.Image({
		x : GSD * this.x,
		y : GSD * this.y,
		image : this.images[this.imageName],
	});
	layer.add(snakePart);
};

function BoardTextElement(values) {
	this.x = values.x;
	this.y = values.y;
	this.text = values.text;
}
BoardTextElement.prototype.images = {}; // Kinetic.Text element cache
BoardTextElement.prototype.addToLayer = function(layer, GSD) {
	if (this.images.hasOwnProperty(this.text)) {
		// Load from cache
		layer.add(new Kinetic.Image({
			image: this.images[this.text],
			x : GSD * this.x,
			y : GSD * this.y,
		}));
	}
	else {
		// Create text element
		var textEle = new Kinetic.Text({
			text : this.text,
	        fontSize: 13,
	        fontFamily: 'Calibri',
	        textFill: 'black',
	        fontStyle: 'bold',
	        align: 'center',
	        width: GSD,
	        height: GSD,
	        padding: 2,
	        fill: '#ddd',
			stroke: '#555',
			strokeWidth: 1,
			cornerRadius: 4,
		});
		
		// Cache image
		var self = this;
		textEle.toImage({
			width: GSD,
			height: GSD,
			callback: function(img) {
				console.log("Cached img from Kinetic.Text");
				var textImage = new Kinetic.Image({
					image: img,
					x : GSD * self.x,
					y : GSD * self.y,
				});
				BoardTextElement.prototype.images[self.text] = img;
			},
		});
		
	}

};