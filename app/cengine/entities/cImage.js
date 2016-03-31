/**
 * Created by schenn on 3/24/16.
 */
/**
 * An Image Canvas Object
 *
 * @class cImage
 */
function cImage() {
  this.height = 0;
  this.width = 0;
  this.fromCenter = false;
  this.source = "";
  this.load = function(){};

  this.clearInfo = function () {
    return ({
      x: Math.ceil(this.x - 1),
      y: Math.ceil(this.y),
      height: Math.ceil(this.height),
      width: Math.ceil(this.width),
      fromCenter: this.fromCenter
    });
  };

  this.render = function(canvas){
    canvas.drawImage({
      source: this.source,
      x: this.x, y: this.y,
      height: this.height, width: this.width, sx: this.sx, sy: this.sy,
      sWidth: this.sWidth, sHeight: this.sHeight,
      fromCenter: this.fromCenter, cropFromCenter: this.cropFromCenter, load: this.load
    });
    delete this.load;
  };
}