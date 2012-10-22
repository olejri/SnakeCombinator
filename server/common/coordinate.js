function Coordinate(x,y) {
	this.x = x;
	this.y = y;
	console.log(this.x, this.y)
}

if(typeof exports != 'undefined'){
	module.exports = Coordinate;
}