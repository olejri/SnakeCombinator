function Utils() {
	this.rand = function(min, max) {
		return min + Math.floor(Math.random()*(max-min+1));
	};
	this.randDec = function(min, max, decimals) {
		if (!decimals) decimals = 4;
		var pow = Math.pow(10, decimals);
		return this.rand(min*pow, max*pow)/pow;
	};
	this.samePosition = function(pos1, pos2) {
		if (pos1.x == pos2.x) {
			if (pos1.y == pos2.y) {
				return true;
			}
		}
		return false;
	};
	this.vZonePositions = function(gameWidth, gameHeight, vZoneDim) {
		var positions = [];
		for (var x=0; x<vZoneDim; x++) {
			for (var y=0; y<vZoneDim; y++) {
				positions.push({
					'x': gameWidth/2 - vZoneDim/2 + x, 
					'y': gameHeight/2 - vZoneDim/2 + y
				});
			}	
		}
		return positions;
	};

}

if(typeof exports != 'undefined') module.exports = Utils;