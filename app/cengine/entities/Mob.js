/**
 * Created by schenn on 3/25/16.
 */
/**
 * Create a Mob Canvas class
 *
 * Mobs are Movable Objects. Sprites with animations based on their movement direction and with the capability to move
 *  built in
 *
 * @param spritesheet - The Spritesheet the mob sprites come from
 * @param directions - A map of the directions and which sprites on the spritesheet match those directions
 * @class
 * @constructor
 * @todo Sanity check
 */
var Mob = function(spritesheet, directions) {
  this.directionAnimations = {};
  this.spritesheet = spritesheet;
  this.direction = "S";
  this.xSpeed = 0;
  this.ySpeed = 0;
  this.x = -50;
  this.y = -50;
  this.height = 50;
  this.width = 50;
  this.animationSpeed = 500;
  this.currentFrame = 0;
  // Animation Timer
  this.atimer = new Timer();
  // Movement Timer
  this.mtimer = new Timer();
  this.fTime = 0;
  this.hasGravity = false;
  this.collides = true;

  var self = this;

  /**
   * Add a compass direction to the mob
   *
   * @type {Function}
   * @method
   * @param direction string - Which compass direction
   * @param spriteNames Array - The names of sprites on the spritesheet to animate through
   */
  this.addDirection = function (direction, spriteNames) {
    this.directionAnimations[direction] = [];
    for (var i = 0; i < spriteNames.length; i++) {
      this.directionAnimations[direction][i] = this.spritesheet[spriteNames[i]];
    }
  };

  /**
   * Set the mob as collidable
   * @type {Function}
   */
  this.setCollidable = function () {
    this.boundryBox = new BoundryBox(this.height, this.width);
  };

  /**
   * Set the mob's movement direction.
   * This changes the mob's animation sprites to match those for the provided direction
   *
   * @type {Function}
   * @param direction string - The direction to move in
   * @param xSpeed int - The movement speed in X
   * @param ySpeed int - The movement speed in Y
   * @method
   */
  this.setDirection = function (direction, xSpeed, ySpeed) {
    this.setAnimationTimes();
    this.direction = direction;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
  };

  this.animates = function(){
    return this.atimer.getMS() > this.fTime || (this.ySpeed > 0 || this.xSpeed > 0);
  };

  /**
   * Update the Mob's rendering sprite
   * @type {Function}
   * @method
   */
  this.animateDirection = function () {
    this.setAnimationTimes();
    if (this.currentFrame === this.directionAnimations[this.direction].length - 1) {
      this.currentFrame = 0;
    }
    else {
      this.currentFrame++;
    }
  };

  this.setAnimationTimes = function(){
    var d = new Date();
    this.fTime = this.directionAnimations[this.direction].length > 0 ?
    d.getTime() + (this.animationSpeed / this.directionAnimations[this.direction].length) :
      0;
  };

  /**
   * Get the Mob's clear box
   *
   * @type {Function}
   * @method
   * @return Object
   */
  this.clearInfo = function () {
    return ({
      x: Math.ceil(this.x - 1), y: Math.ceil(this.y),
      height: Math.ceil(this.height), width: Math.ceil(this.width),
      fromCenter: this.fromCenter
    });
  };

  /**
   * Render the mob on a canvas
   *
   * @type {Function}
   * @method
   * @param canvas jCanvas - A jCanvas wrapped canvas
   */
  this.render = (function (canvas) {
    this.mtimer.update();
    this.atimer.update();
    if(this.animates()) this.animateDirection();
    var spriteInfo = this.spritesheet[this.directionAnimations[this.direction][this.currentFrame]];
    canvas.drawImage({
      source: spriteInfo.source,
      x: this.x,
      y: this.y,
      height: this.height,
      width: this.width,
      sx: spriteInfo.sx,
      sy: spriteInfo.sy,
      sWidth: spriteInfo.sWidth,
      sHeight: spriteInfo.sHeight,
      fromCenter: this.fromCenter,
      cropFromCenter: spriteInfo.cropFromCenter
    });
    if (typeof(this.load) === "function") {
      this.load();
    }
    delete this.load;
  });


  /**
   * Move the mob by it's speed
   *
   * @type {Function}
   * @method
   */
  this.move = function () {
    this.clearLast = this.clearInfo();
    this.lastX = this.x;
    this.lastY = this.y;
    if (this.ySpeed !== 0) {
      this.moveY();
    }
    if (this.xSpeed !== 0) {
      this.moveX();
    }

  };

  /**
   * Move in the Y axis
   *
   * @method
   * @type {Function}
   */
  this.moveY = function () {
    this.y += this.ySpeed * this.mtimer.deltaTime();
  };

  /**
   * Move in the X axis
   *
   * @method
   * @type {Function}
   */
  this.moveX = function () {
    this.x += this.xSpeed * this.mtimer.deltaTime();
  };


  /**
   * Get the pixels along the mobs leading edges
   *
   * @type {Function}
   */
  this.boundryEdgePixels = function () {
    var pixels = [];
    if ((this.x + this.xSpeed) > this.x) {
      pixels.push(this.boundryBox.getEdgePixels("E", {x: this.x, y: this.y}));
    }
    else if ((this.x + this.xSpeed) < this.x) {
      pixels.push(this.boundryBox.getEdgePixels("W", {x: this.x, y: this.y}));
    }
    if ((this.y + this.ySpeed) > this.y) {
      pixels.push(this.boundryBox.getEdgePixels("S", {x: this.x, y: this.y}));
    }
    else if ((this.y + this.ySpeed) < this.y) {
      pixels.push(this.boundryBox.getEdgePixels("N", {x: this.x, y: this.y}));
    }
    if (pixels.length === 0) {
      pixels = false;
    }
    return (pixels);
  };

  directions.forEach(function(direction, index){
    var d = Object.keys(direction)[0];
    if(!self.directionAnimations.hasOwnProperty(d)){
      self.directionAnimations[d] = [];
    }
    self.directionAnimations[d] = self.directionAnimations[d].concat(direction[d]);
  });
};

