/**
 * Created by schenn on 3/25/16.
 */
/**
 * A collection of pixels for a collidable object
 *
 * @class BoundryBox
 * @param height
 * @param width
 * @constructor
 */
function BoundryBox(height, width) {
  this.V = []; //top and bottom y
  this.V[0] = []; //West
  this.H = []; //left and right x
  this.H[0] = []; //North
  this.maxY = parseInt(height - 1);
  this.maxX = parseInt(width - 1);
  this.V[this.maxX] = []; //west
  this.H[this.maxY] = []; //south
  //fill edges
  for (var x = 0; x <= this.maxX; x++) {
    if (x === 0) {
      for (var y = 0; y <= this.maxY; y++) {
        this.V[0][y] = true; //load north line
        this.V[this.maxX][y] = true; //load south line
      }
    }
    this.H[0][x] = true; //load west line
    this.H[this.maxY][x] = true; //load east line
  }
}

/**
 * Get the pixels that make up the edge of a mob
 *
 * @method
 * @type {Function}
 * @return Array
 */
BoundryBox.prototype.getEdgePixels = (function (edge, coords) { //top-left coords of mob
  var pixels = [];
  var x, y;
  switch (edge){
    case "N":
    case "S":
      y = edge === "N" ? coords.y : this.maxY + coords.y;
      for (var xc = 0; xc < this.H[0].length; xc++) {
        pixels[(xc + coords.x)] = y;
      }
      break;
    case "E":
    case "W":
      x = edge === "W" ? coords.x : this.maxX + coords.x;
      for (var yc = 0; yc < this.V[this.maxX].length; yc++) {
        pixels[x] = yc + coords.y;
      }
      break;
  }
  return (pixels);
});
