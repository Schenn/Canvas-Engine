/**
 * Created by schenn on 3/25/16.
 */
var Sprite = function(source, positionInfo){
  this.timer = new Timer();
  // Frame Time - When should the next animation event occur
  this.fTime = 0;
  // Sprites automatically collide with things.
  this.collides = true;
  // The collection of images that make up the sprites animation
  this.frames = [];
  // The current sprite image
  this.sprite = null;
  // The time each cell of animation should be visible
  // If less than 1, the sprite will not animate
  this.duration = 0;

  if(window.utilities.exists(positionInfo.sprite)){
    this.sprite = source[positionInfo.sprite];
    this.spriteName = positionInfo.sprite;
  }
  if(window.utilities.exists(positionInfo.frames)){
    for (var i = 0; i < positionInfo.frames.length; i++) {
      this.frames[i] = $.extend({frameName: positionInfo.frames[i]}, source[positionInfo.frames[i]]);
    }
    this.sprite = this.frames[0];
    this.spriteName = this.frames[0].frameName;
    this.duration = positionInfo.duration || 500;
    this.currentFrame = 0;
    this.lastFrame = -1;
    this.reset();
  }
  if (positionInfo.height) {
    this.sprite.height = positionInfo.height;
  }
  if (positionInfo.width) {
    this.sprite.width = positionInfo.width;
  }
};

/**
 * Reset the sprites time and frame time
 *
 * @type {Function}
 * @method
 */
Sprite.prototype.reset = function(){
  var d = new Date();
  this.fTime = this.frames.length > 0 ? d.getTime() + (this.duration / this.frames.length) : 0;
};

/**
 * If the frame time has expired and this is an animated sprite, move to the next frame
 *
 * @type {Function}
 * @method
 */
Sprite.prototype.animateFrame = (function () {
  if (this.duration > 0) {
    this.reset();
    if (this.currentFrame === this.frames.length - 1) {
      this.currentFrame = 0;
    }
    else {
      this.currentFrame++;
    }
    this.sprite = $.extend({}, this.frames[this.currentFrame]);
  }
});

/**
 * Get the sprite's clear box
 *
 * @type {Function}
 * @method
 * @return Object
 */
Sprite.prototype.clearInfo = (function () {
  return ({
    x: Math.floor(this.x - 1), y: Math.floor(this.y),
    height: Math.ceil(this.sprite.height), width: Math.ceil(this.sprite.width),
    fromCenter: this.fromCenter
  });
});

/**
 * Render the sprite on a canvas
 * @type {Function}
 */
Sprite.prototype.render = (function (canvas) {
  this.timer.update();
  if (this.duration > 0) {
    if (this.timer.getMS() > this.fTime) {
      this.animateFrame();
    }
  }
  //strips out partial pixels.
  var myx = (this.x + 0.5) | 0;
  var myy = (this.y + 0.5) | 0;
  canvas.drawImage({
    source: this.sprite.source,
    x: myx,
    y: myy,
    height: this.sprite.height,
    width: this.sprite.width,
    sx: this.sprite.sx,
    sy: this.sprite.sy,
    sWidth: this.sprite.sWidth,
    sHeight: this.sprite.sHeight,
    fromCenter: this.fromCenter,
    cropFromCenter: this.sprite.cropFromCenter,
    load: this.load
  });
  delete this.sprite.load;
});