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
	}
}

if(typeof exports != 'undefined') module.exports = Utils;