/**
 * Created by schenn on 3/24/16.
 */
/**
 * A Line Canvas Object
 *
 * @class cLine
 */
var Line = function() {
  this.strokeStyle = "#000000";
  this.strokeCap = "round";
  this.strokeJoin = "miter";
  this.strokeWidth = 10;
  this.rounded = false;
  this.normalPlot = [];

  /**
   * Plot a line
   *
   * @method
   * @type {Function}
   */
  this.plot = function(xyArray){
    this.normalPlot = xyArray;
    for (var i = 1; i <= xyArray.length; i++) {
      this["x" + i] = xyArray[i - 1].x;
      this["y" + i] = xyArray[i - 1].y;
    }
  };


  /**
   * Get the Clear Box for a line
   *
   * @method
   * @type {Function}
   */
  this.clearInfo = function(){
    var smallX = 0;
    var smallY = 0;
    var bigX = 0;
    var bigY = 0;
    for (var i = 0; i < this.normalPlot.length; i++) {
      if (this.normalPlot[i].x <= smallX) {
        smallX = this.normalPlot[i].x;
      }
      if (this.normalPlot[i].y <= smallX) {
        smallX = this.normalPlot[i].y;
      }
      if (this.normalPlot[i].x >= bigX) {
        bigX = this.normalPlot[i].x;
      }
      if (this.normalPlot[i].y >= bigY) {
        bigY = this.normalPlot[i].y;
      }
    }

    return ({
      x: smallX, y: smallY,
      width:  bigX - smallX, height: bigY - smallY, fromCenter: false
    });
  };

  /**
   * Render a line on a canvas
   *
   * @method
   * @type {Function}
   */
  this.render = function (canvas) {
    canvas.drawLine($.extend({}, this));
  };

};