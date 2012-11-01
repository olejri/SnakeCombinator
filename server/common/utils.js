function Utils(startX, startY) {
	this.rand = function(min, max) {
		return min + Math.floor(Math.random()*(max-min+1));
	};
}

if(typeof exports != 'undefined'){
	module.exports = Utils;
}