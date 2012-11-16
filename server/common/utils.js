function Utils() {
	this.rand = function(min, max) {
		return min + Math.floor(Math.random()*(max-min+1));
	};
	this.randDec = function(min, max, decimals) {
		if (!decimals) decimals = 4;
		var pow = Math.pow(10, decimals);
		return this.rand(min*pow, max*pow)/pow;
	};
}

if(typeof exports != 'undefined'){
	module.exports = Utils;
}