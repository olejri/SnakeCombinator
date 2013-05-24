var arrayOfSnakes = [];
function GameGUI(options) {

	// Options
	var options = options;


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
	
	var powerUpLayer = new Kinetic.Layer();
	stage.add(powerUpLayer);
	
	initBackground();
	stage.draw(); // IS IT NEEDED??? need to test
	
	
	self = this;
	
	//Sprites
	
	var tailSprite = null;
	
	
	
	
	function transform() {
		
	}
	
	this.stageDraw = function() {
		stage.draw();
	}
	
	
	/**
	 * By supplying elements to be drawn, this method will refresh the game.
	 */
	this.draw = function(allElements) {
		drawSnakes(allElements.snakeElements);
		drawFood(allElements.foodElements);
		drawPowerUps(allElements.powerUpElements);
		

		log.addDraw();
		return true;

	}
	
	
	
	
	this.testTransition = function() {
		var snakeparts = stage.get('.snakepart');
		console.log(snakeparts);

        // apply transition to all nodes in the array
		snakeparts.each(function(index, snakepart) {
			var oldX = snakepart.getX();
			var oldY = snakepart.getY();
			
			snakepart.transitionTo({
			x: oldX,
			y: oldY-20,
            duration: 0.25,
          });
        });
	}
	
	
	this.moveSnakes = function(snakePartsFromGameLogic) {
		var snakePartsFromLayer = snakeLayer.getChildren();
		
		for ( var i = 0; i < snakePartsFromGameLogic.length; i++) {
			for ( var s = 0; s < snakePartsFromLayer.length; s++) {
				if(sameSnakePart(snakePartsFromGameLogic[i], snakePartsFromLayer[s])){
					transitionSnakePart(snakePartsFromLayer[s], snakePartsFromGameLogic[i].direction);
				}
			}
		}
	}
	
	this.getLayer = function() {
		return snakeLayer;
		
	}
	
	



	/*************** PRIVATE METHODS ***************/
	function transitionSnakePart(part, direction) {
		var newX = part.getX();
		var newY = part.getY();
		if (direction == "left") newX = newX - options.GSD;			
		else if (direction == "right") newX = newX + options.GSD;
		else if (direction == "up") newY = newY - options.GSD;
		else if (direction == "down") newY = newY + options.GSD;
		part.transitionTo({
			x: newX,
			y: newY,
            duration: 0.25,
          });
		
	}
	
	
	
	
	
	function sameSnakePart(partOne, partTwo) {
		if (((partOne.x * options.GSD)  == partTwo.getX()) && ((partOne.y * options.GSD) == partTwo.getY())) {
			return true;
		}
		return false;
	}
	

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
	
	
	function drawPowerUps(elements) {
		try {
			powerUpLayer.removeChildren();
			for (var i=0; i<elements.length; i++) {
				elements[i].addToLayer(powerUpLayer, options.GSD);
			}
			powerUpLayer.draw();

			return true;
		} catch(err) {
			console.log("Failed at drawing powerup image: "+err);
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
			stroke: '#5C832F',
			strokeWidth: 2,
			cornerRadius: 4
		});

		backgroundLayer.add(validationZone);


		backgroundLayer.draw();
	}


}

//image elements
function BoardImageElement(values) {
	this.x = values.x;
	this.y = values.y;
	this.imageName = values.image;
	this.direction = values.direction;
}
BoardImageElement.prototype.images = false;

//just for testing
BoardImageElement.prototype.transition = function(kineticImage) {
	var oldX = kineticImage.getX();
	var oldY = kineticImage.getY();
	
	kineticImage.transitionTo({
        x: oldX,
        y: oldY-20,
        opacity: 1,
        scale: {
          x: 1,
          y: 1
        },
        duration: 1,
      });
}





BoardImageElement.prototype.loadImages = function() {
	var imgDir = "./images/"
		var sources = {
			up: 'snakehead_v01_up.png',
			right: 'snakehead_v01_right.png',
			down: 'snakehead_v01_down.png',
			left: 'snakehead_v01_left.png',
			upTail: 'snaketail_v01_up.png',
			rightTail: 'snaketail_v01_right.png',
			downTail: 'snaketail_v01_down.png',
			leftTail: 'snaketail_v01_left.png',
			upRed: 'snakehead_v01_up_red.png',
			rightRed: 'snakehead_v01_right_red.png',
			downRed: 'snakehead_v01_down_red.png',
			leftRed: 'snakehead_v01_left_red.png',
			upTailRed: 'snaketail_v01_up_red.png',
			rightTailRed: 'snaketail_v01_right_red.png',
			downTailRed: 'snaketail_v01_down_red.png',
			leftTailRed: 'snaketail_v01_left_red.png',
			body: 'body.png',
			food: 'food.png',
			tail: 'snaketail_v01_right.png',
			snakesprite: 'Snake_sprite_v01.png',
			help: 'info.png',
			fast: 'fast.png',
			bomb: 'bomb.png',
	};
	var images = {};
	var loadedImages = 0;
	for (var imageName in sources) {
		images[imageName] = new Image();
		images[imageName].onload = function() {
			//console.log("Loading image: "+this.src);
		}
		images[imageName].src = imgDir + sources[imageName];
	}
	BoardImageElement.prototype.images = images;
};

BoardImageElement.prototype.addToLayer = function(layer, GSD) {
	if (!this.images) {
		this.loadImages();
	}
	
	if (this.imageName == "head") {
		arrayOfSnakes.push()
		
		var head = new Kinetic.Image({
			x : GSD * this.x,
			y : GSD * this.y,
			image : this.images[this.direction],
			name : "snakepart"
		});
		head.direction = this.direction;
		layer.add(head);
	} else if (this.imageName == "tail") {
		var snakePart = new Kinetic.Image({
			x : GSD * this.x,
			y : GSD * this.y,
			image : this.images[this.direction +"Tail"],
			name : "snakepart"
		});
		layer.add(snakePart);
	} else if (this.imageName == "headRed") {
		var snakePart = new Kinetic.Image({
			x : GSD * this.x,
			y : GSD * this.y,
			image : this.images[this.direction +"Red"],
			name : "snakepart"
		});
		layer.add(snakePart);
	} else if (this.imageName == "tailRed") {
		var snakePart = new Kinetic.Image({
			x : GSD * this.x,
			y : GSD * this.y,
			image : this.images[this.direction +"TailRed"],
			name : "snakepart"
		});
		layer.add(snakePart);
	} else {
		var powerUp = new Kinetic.Image({
			x : GSD * this.x,
			y : GSD * this.y,
			image : this.images[this.imageName],
		});
		layer.add(powerUp);
	}
};


BoardImageElement.prototype.makeTailAninmation = function(x, y, direction) {
	

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
			fill: 'white',
			stroke: 'white',
			strokeWidth: 1,
			cornerRadius: 4,
		});

		// Cache image
		var self = this;
		textEle.toImage({
			width: GSD,
			height: GSD,
			callback: function(img) {
				//console.log("Cached img from Kinetic.Text");
				var textImage = new Kinetic.Image({
					image: img,
					x : GSD * self.x,
					y : GSD * self.y,
				});
				BoardTextElement.prototype.images[self.text] = img;
			},
		})

	}

};