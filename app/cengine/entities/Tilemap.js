/**
 * Created by schenn on 3/25/16.
 */
/**
 * A Tilemap Canvas Object
 *
 * @param tilesheet The string pointing to the spritesheet with it's tile images.
 * @class Tilemap
 */
function Tilemap(tilesheet) {
  this.tilesheet = typeof(tilesheet) !== "undefined" ? tilesheet : "rect";
  this.tile = {height: 32, width: 32};
  this.grid = {height: 1000, width: 1000};
  this.map = [];
  this.collides = true;
  this.stopsMovement = true;
  this.scroll = {
    x: 0, y: 0
  };
  this.isDrawn = false;

  /**
   * Render the tiles on a canvas
   *
   * @type {Function}
   * @method
   * @param canvas jCanvas a jCanvas wrapped canvas
   */
  this.render = function (canvas) {
    var startRow = Math.floor(this.scroll.x / this.tile.width);
    var startCol = Math.floor(this.scroll.y / this.tile.height);
    var rowCount = startRow + Math.floor(canvas.width() / this.tile.width) + 1;
    var colCount = startCol + Math.floor(canvas.height() / this.tile.height) + 1;
    rowCount = ((startRow + rowCount) > this.grid.width) ? this.grid.width : rowCount;
    colCount = ((startCol + colCount) > this.grid.height) ? this.grid.height : colCount;
    for (var row = startRow; row < rowCount; row++) {
      for (var col = startCol; col < colCount; col++) {
        var tileX = this.tile.width * row;
        var tileY = this.tile.height * col;
        tileX -= this.scroll.x;
        tileY -= this.scroll.y;
        if (typeof(this.map[row]) !== "undefined") {
          if (typeof(this.map[row][col]) !== "undefined") {
            if (this.tilesheet === "rect") {
              canvas.drawRect({
                x: tileX,
                y: tileY,
                height: this.tile.height,
                width: this.tile.width,
                fillStyle: "#000",
                fromCenter: false
              });
            }
            else {
              canvas.drawImage({
                source: this.tilesheet.source,
                x: tileX, y: tileY,
                height: this.tile.height, width: this.tile.width,
                sx: this.tilesheet[this.map[row][col]].sx,
                sy: this.tilesheet[this.map[row][col]].sy,
                sWidth: this.tilesheet[this.map[row][col]].sWidth,
                sHeight: this.tilesheet[this.map[row][col]].sHeight,
                fromCenter: false,
                cropFromCenter: this.tilesheet[this.map[row][col]].cropFromCenter
              });
            }
          }
        }
      }
    }
  };

  /**
   * Scroll a tilemap along a vector then re-render it
   *
   * @method
   * @type {Function}
   * @param vector Object the x and y direction
   * @param canvas jCanvas jCanvas wrapped canvas
   */
  this.scroll = function (vector, canvas) {
    this.scroll.x += vector.x;
    this.scroll.y += vector.y;
    this.render(canvas);
  };

  /**
   * Clear the tilemap from the canvas
   *
   * @type {Function}
   * @method
   */
  this.clear = function (canvas) {
    canvas.clearCanvas();
  };

  /**
   * Convert a pixel position to a tile
   *
   * @type {Function}
   * @method
   * @param coord Object the x and y position of the click
   * @return Object the tile position
   */
  this.pixelToTile = function (coord) {
    var row = Math.floor(coord.x / this.tile.width);
    var col = Math.floor(coord.y / this.tile.height);
    if (typeof(this.map[row]) !== "undefined") {
      if (typeof(this.map[row][col]) !== "undefined") {
        return ({r: row, c: col});
      }
    }
    return (false);
  };

  /**
   * Placeholder for doing something on a click
   *
   * @type {Function}
   * @method
   * @param coord Object the x and y position
   */
  this.onClick = function (coord) {

    var tile = this.pixelToTile(coord);
    //call this.tileClick(col,row)
  };
}
