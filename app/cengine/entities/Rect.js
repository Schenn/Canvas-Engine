/**
 * Created by schenn on 3/24/16.
 */
/**
 * A Rectangle canvas object
 *
 * @class cRect
 */
var Rect = function() {
  this.fromCenter = false;
  this.height = 100;
  this.width = 100;
  this.fillStyle = "#000000";
};

/**
 * Get the clear box for the rect
 *
 * @method
 * @type {Function}
 * @return object
 */
Rect.prototype.clearInfo = (function () {
  return ({
    x: Math.ceil(this.x - 1),
    y: Math.ceil(this.y),
    height: Math.ceil(this.height),
    width: Math.ceil(this.width),
    fromCenter: this.fromCenter
  });
});

/**
 * Draw the rectangle on a canvas
 *
 * @method
 * @type {Function}
 */
Rect.prototype.render = (function (canvas) {
  canvas.drawRect({
    fillStyle: this.fillStyle,
    x: this.x, y: this.y,
    height: this.height, width: this.width,
    fromCenter: this.fromCenter,
    strokeStyle: this.strokeStyle,
    strokeWidth: this.strokeWidth,
    cornerRadius: this.cornerRadius
  });
});