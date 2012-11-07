function GameGUI(options) {
	

	
	// Avoids that the drawing methods runs twice at the same time
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
			console.log("Loading image (wrong name??): "+type);
		}
		this.images[type].src = imgDir + sources[type];
	}
	
	// Set up game board
	var stage = new Kinetic.Stage({
		container : options.container,	// HTML element add canvas to
		width : options.GSD*options.gameWidth, 			// Canvas dimension
		height : options.GSD*options.gameHeight,		// Canvas dimension
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
		
		try {
			IS_DRAWING = true;
			
			snakeLayer.removeChildren();
			
			for (var i=0; i<elements.length; i++) {
				var ele = elements[i];
	
				var snakePart = new Kinetic.Image({
					x : options.GSD * ele.x,
					y : options.GSD * ele.y,
					image : this.images[ele.type],
					id: ele.details,
					name: ele.type,
				});
				snakeLayer.add(snakePart);
	
			}
			
			snakeLayer.draw();
			log.addDraw();
			
			IS_DRAWING = false;
			return true;
		} catch(err) {
			console.log("Failed at drawing image: "+err)
			IS_DRAWING = false;
			return false;
		} 
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
	};

	this.checkForHeadCollision = function() {
		var crashes = [];
		var start = new Date();
		var counter = 0;
		for (var t=0; t<1; t++) {
			for (var x=0; x<2; x++) {
				for (var y=0; y<2; y++) {
					var middleX = (x+0.5)*options.GSD;
					var middleY = (y+0.5)*options.GSD;
					counter++;
					var crashedParts = snakeLayer.getIntersections(middleX, middleY);
					console.log(crashedParts);
					/*if (crashedParts.length > 1) {
						for (var p=0; p<crashedParts.length; p++) {
							if (crashedParts[p].getName() == "head") {
								crashes.push(crashedParts[p].getId());
							}
							
						}
					}*/
				}
			}
			console.log(crashes)
		}
		var end = new Date();
		console.log("checkForColl took "+(end-start)+"ms with "+counter+" checks");
	}
	
}

function BoardElement(data) {
	this.type = data.type;
	this.details = data.details;
	this.x = data.x;
	this.y = data.y;
}