// Javascript Canvas Handler
// Author: Steven Chennault
// Project began: 02/15/12 10AM Pacific
// Dependencies:
//        jQuery
//        jCanvas v5.1 (a jQuery plugin by Caleb Evans which simplifies the drawing process)

/**
 * Create a requestAnimationFrame function to standin for the browsers prefix method.
 */
window.requestAnimationFrame = function () {
  return (

    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
}();

/**
 * The Engine for manipulating a stack of canvases for a game
 *
 * @class jcHandler
 * @param init Object { myCanvas: root canvas, imagePath: path to game images }
 */
function jcHandler(init) {
  // jCanvas wrapped canvases
  this.jcArray = [];
  this.jcArray[0] = $(init.myCanvas);
  // array of z-indexes to exclude from click events
  this.excludes = [];

  // Set the path to the game's images
  this.imagePath = init.imagePath;

  // Position objects - Represents a game objects place in the world
  this.positions = {};

  // The order objects should be drawn
  this.z_index = [];

  // The spritesheets from the game
  this.spritesheets = {};

  // Stored Canvas Gradients
  this.gradients = {};

  // Pixel filters -- Adds an effect to the canvas screen
  this.filters = {};

  // user-generated functions
  this.onCall = {};

  // Is the game loop running
  this.paused = false;

  /**
   * These are the classes that represent the different game object types a game entity can be
   * @module Game Object Types
   */

  /**
   * A Label Class for the canvas
   *
   * @class cLabel
   */
  function cLabel() {

    // Default rendering properties.
    this.fillStyle = "#fff";
    this.align = "left";
    this.baseline = "middle";
    this.font = "normal 1em Georgia, 'Times New Roman', Times, serif";

    // The text to render
    this.text = "";
  }

  /**
   * fontWeight Sets or Gets the font weight on the label
   *
   * @method
   * @type {Function}
   * @return bool|string the font weight
   */
  cLabel.prototype.fontWeight = (function (newWeight) {
    // if the new font weight is set
    if (typeof(newWeight) !== "undefined"){
      var normalIndex = this.font.indexOf("normal");
      var boldIndex = this.font.indexOf("bold");

      if (normalIndex > -1)
      {
        // Remove "normal" from the current font and add in the new weight
        this.font = this.font.slice(0, normalIndex) +  newWeight + this.font.slice((normalIndex + 6));
      } else if (boldIndex > -1)
      {
        // Remove "bold" from the current font and add in the new weight
        this.font = this.font.slice(0, boldIndex) + newWeight + this.font.slice((boldIndex + 4));
      }

      // returns true to verify function was success
      return (true);
    }
    //return the current font weight
    else {
      // if fontwieght normal
      if (this.font.indexOf("normal"))
      {
        return ("normal");
      }
      // if fontweight bold
      else if (this.font.indexOf("bold"))
      {
        return ("bold");
      }
    }
  });

  /**
   * Sets or Gets the labels font size
   *
   * @method
   * @type {Function}
   * @return bool|int the font size
   */
  cLabel.prototype.fontSize = (function (newSize) {
    // search the font for a 2 digit number
    var index = this.font.search(/\d{2}/, this.font);

    //if newSize is set
    if (typeof(newSize) != "undefined"){
      //if fontSize found
      if (index >= 0){
        // Remove the current font size from the font and add in the new size
        this.font = this.font.slice(0, index) + newSize + this.font.slice((index + 2));
        return (true); // returns success
      }
    }
    else {
      // returns the current Size
      return (parseInt(this.font.slice(index, index + 2)));
    }
  });

  /**
   * Sets or Gets the font family from the label
   * @type {Function}
   * @method
   * @return bool|string the Font family
   *
   * @todo Test this
   */
  cLabel.prototype.fontFamily = (function (newFamily) {

    // get string up to the font family
    var index = this.font.indexOf("px") + 3;

    // if new Font Family is set
    if (typeof(newFamily) !== "undefined"){
      // reset font
      this.font = this.font.slice(0, index) + newFamily + (this.font.slice((index + newFamily.length)));
      return (true);
    }
    else {
      // Retrieve the current font from the canvas font string
      var oldFont = this.font.slice(index);
      var trimFont = "";
      //if the current string still has a font size spec - cut it out
      index = oldFont.indexOf("px");
      if (index) {
        trimFont = oldFont.slice(0, index - 1) + oldFont.slice(index + 2);
      }

      //if the current string still has a font size - cut it out
      var numIndex = oldFont.search(/\d{2}/, oldFont);
      if (numIndex) {
        trimFont = oldFont.slice(0, index - 1) + oldFont.slice(index + 2);
      }

      // cut out font weight
      var weightIndex = oldFont.indexOf("normal");
      if (!(weightIndex)) {
        weightIndex = oldFont.indexOf("bold");
        if (weightIndex) {
          trimFont = oldFont.slice(0, weightIndex)+ oldFont.slice(index + 4);
        }
      }
      else {
        trimFont = oldFont.slice(0, weightIndex) + oldFont.slice(index + 6);
      }
      return (oldFont); // return current font name
    }
  });

  /**
   * Return the clear box for a label
   *
   * @method
   * @type {Function}
   * @return object
   */
  cLabel.prototype.clearInfo = (function (canvas) {
    // Measure the current text on a hidden canvas and use those values to determine the end point of the clear box
    var c = canvas.loadCanvas();
    c.font = this.font;
    var s1 = c.measureText(this.text);
    var s2 = c.measureText("M");
    var _x = this.x;
    if (this.align === "left") {
      _x += s1.width / 2;
    }
    else if (this.align === "right") {
      _x -= s1.width / 2;
    }
    return ({
      x: Math.ceil(_x), y: Math.ceil(this.y),
      height: Math.ceil(s2.width * 1.25),
      width: Math.ceil(s1.width * 1.25), fromCenter: true
    });
  });

  /**
   * Render the label on a canvas
   *
   * @method
   * @type {Function}
   */
  cLabel.prototype.render = (function (canvas) {
    if (typeof(this.text) !== "undefined") {
      canvas.drawText({
        fillStyle: this.fillStyle,
        strokeStyle: this.strokeStyle,
        strokeWidth: this.strokeWidth,
        x: this.x,
        y: this.y,
        text: this.text,
        align: this.align,
        baseline: this.baseline,
        font: this.font
      });
    }
  });

  /**
   * A Rectangle canvas object
   *
   * @class cRect
   */
  function cRect() {
    this.fromCenter = false;
    this.height = 100;
    this.width = 100;
    this.fillStyle = "#000000";
  }

  /**
   * Get the clear box for the rect
   *
   * @method
   * @type {Function}
   * @return object
   */
  cRect.prototype.clearInfo = (function () {
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
  cRect.prototype.render = (function (canvas) {
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

  /**
   * A Line Canvas Object
   *
   * @class cLine
   */
  function cLine() {
    this.strokeStyle = "#000000";
    this.strokeCap = "round";
    this.strokeJoin = "miter";
    this.strokeWidth = 10;
    this.rounded = false;
    this.normalPlot = [];
  }

  /**
   * Plot a line
   *
   * @method
   * @type {Function}
   */
  cLine.prototype.plot = (function (xyArray) {
    this.normalPlot = xyArray;
    for (var i = 1; i <= xyArray.length; i++) {
      this["x" + i] = xyArray[i - 1].x;
      this["y" + i] = xyArray[i - 1].y;
    }
  });

  /**
   * Get the Clear Box for a line
   *
   * @method
   * @type {Function}
   */
  cLine.prototype.clearInfo = (function () {
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
  });

  /**
   * Render a line on a canvas
   *
   * @method
   * @type {Function}
   */
  cLine.prototype.render = (function (canvas) {
    canvas.drawLine($.extend({}, this));
  });

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
  }

  /**
   * Get the Clear Box for the image
   *
   * @method
   * @type {Function}
   */
  cImage.prototype.clearInfo = (function () {
    return ({
      x: Math.ceil(this.x - 1),
      y: Math.ceil(this.y),
      height: Math.ceil(this.height),
      width: Math.ceil(this.width),
      fromCenter: this.fromCenter
    });
  });

  /**
   * Render the image on a canvas
   * @type {Function}
   * @method
   */
  cImage.prototype.render = (function (canvas) {
    canvas.drawImage({
      source: this.source,
      x: this.x, y: this.y,
      height: this.height, width: this.width, sx: this.sx, sy: this.sy,
      sWidth: this.sWidth, sHeight: this.sHeight,
      fromCenter: this.fromCenter, cropFromCenter: this.cropFromCenter, load: this.load
    });
    delete this.load;
  });

  /**
   * Create a Timer class
   *
   * This class keeps track of the time between animation requests and should be used to modulate the speed of simulations
   * @constructor
   * @class TIMER
   */
  function TIMER() {
    this.date = new Date();
    this.delta = new Date();
  }

  /**
   * Update the times on the timer
   *
   * @method
   * @type {Function}
   */
  TIMER.prototype.update = (function () {
    this.delta = this.date;
    this.date = new Date();
  });

  /**
   * Get the current last updated time in milliseconds
   * @type {Function}
   * @method
   *
   */
  TIMER.prototype.getMS = (function () {
    return (this.date.getTime());
  });

  /**
   * Get the current last updated time in seconds
   * @type {Function}
   * @method
   */
  TIMER.prototype.getS = (function () {
    return (Math.round(this.date.getTime / 1000));
  });

  /**
   * Get the time since the last update request
   * @type {Function}
   * @method
   */
  TIMER.prototype.deltaTime = (function () {
    return ((this.date.getTime() - this.delta.getTime()) / 1000);
  });

  /**
   *
   * The Sprite Canvas Object
   *
   * @class cSprite
   * @param source The spritesheet the sprite comes from
   * @param positionInfo - the breakdown of how the sprites are rendered
   */
  function cSprite(source, positionInfo) {
    this.timer = new TIMER();
    this.fTime = 0;
    this.collides = true;
    this.frames = [];
    this.sprite = null;
    this.duration = 0;

    if (typeof(positionInfo.sprite) !== "undefined") {
      this.sprite = source[positionInfo.sprite];
      this.spriteName = positionInfo.sprite;
    }
    if (typeof(positionInfo.frames) !== "undefined") {
      for (var i = 0; i < positionInfo.frames.length; i++) {
        this.frames[i] = $.extend({frameName: positionInfo.frames[i]}, source[positionInfo.frames[i]]);
      }
      this.sprite = this.frames[0];
      this.spriteName = this.frames[0].frameName;
      this.duration = positionInfo.duration || 500;
      this.currentFrame = 0;
      this.lastFrame = -1;
      var d = new Date();
      if (this.frames.length > 0) {
        this.fTime = d.getTime() + (this.duration / this.frames.length);
      }
    }
    if (positionInfo.height) {
      this.sprite.height = positionInfo.height;
    }
    if (positionInfo.width) {
      this.sprite.width = positionInfo.width;
    }
  }

  /**
   * Reset the sprites time and frame time
   *
   * @type {Function}
   * @method
   */
  cSprite.prototype.init = (function () {
    var d = new Date();
    if (this.frames.length > 0) {
      this.fTime = d.getTime() + (this.duration / this.frames.length);
    }
  });

  /**
   * If the frame time has expired and this is an animated sprite, move to the next frame
   *
   * @type {Function}
   * @method
   */
  cSprite.prototype.animateFrame = (function () {
    if (this.duration > 0) {
      var d = new Date();
      if (this.frames.length > 0) {
        this.fTime = d.getTime() + (this.duration / this.frames.length);
      }
      else {
        this.fTime = 0;
      }
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
  cSprite.prototype.clearInfo = (function () {
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
  cSprite.prototype.render = (function (canvas) {
    this.timer.update();
    if (this.duration > 0) {
      if (this.timer.getMS() > this.fTime) {
        this.animateFrame();
      }
    }
    var myx = (this.x + 0.5) | 0; //strips out partial pixels.
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

  /**
   * Boundry Box acts a collection of pixels for a given collidable object
   *
   * @class BOUNDRYBOX
   * @param height
   * @param width
   * @constructor
   */
  function BOUNDRYBOX(height, width) {
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
  BOUNDRYBOX.prototype.getEdgePixels = (function (edge, coords) { //top-left coords of mob
    var pixels = [];
    if ((edge === "N") || (edge === "S")) {
      var y;
      if (edge === "N") {
        y = coords.y;
      }
      else {
        y = this.maxY + coords.y;
      }
      for (var xc = 0; xc < this.H[0].length; xc++) {
        pixels[(xc + coords.x)] = y;
      }
    }
    else if ((edge === "E") || (edge === "W")) {
      if (edge === "W") {
        var x = coords.x;
      }
      else {
        var x = this.maxX + coords.x;
      }
      for (var yc = 0; yc < this.V[this.maxX].length; yc++) {
        pixels[x] = yc + coords.y;
      }
    }
    return (pixels);
  });

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
  function cMob(spritesheet, directions) {
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
    this.atimer = new TIMER();
    // Movement Timer
    this.mtimer = new TIMER();
    this.fTime = 0;
    this.hasGravity = false;
    this.collides = true;

    for (var direction in directions) {
      this.directionAnimations[direction] = [];
      for (var i = 0; i < directions[direction].length; i++) {
        this.directionAnimations[direction][i] = directions[direction][i];
      }
    }
  }

  /**
   * Add a compass direction to the mob
   *
   * @type {Function}
   * @method
   * @param direction string - Which compass direction
   * @param spriteNames Array - The names of sprites on the spritesheet to animate through
   */
  cMob.prototype.addDirection = (function (direction, spriteNames) {
    this.directionAnimations[direction] = [];
    for (var i = 0; i < spriteNames.length; i++) {
      this.directionAnimations[direction][i] = this.spritesheet[spriteNames[i]];
    }
  });

  /**
   * Set the mob as collidable
   * @type {Function}
   */
  cMob.prototype.setCollidable = (function () {
    this.boundryBox = new BOUNDRYBOX(this.height, this.width);
  });

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
  cMob.prototype.setDirection = (function (direction, xSpeed, ySpeed) {
    var d = new Date();
    this.fTime = d.getTime() + (this.animationSpeed / this.directionAnimations[direction].length);
    this.direction = direction;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
  });

  /**
   * Update the Mob's rendering sprite
   * @type {Function}
   * @method
   */
  cMob.prototype.animateDirection = (function () {
    var d = new Date();
    if (this.directionAnimations[this.direction].length > 0) {
      this.fTime = d.getTime() + (this.animationSpeed / this.directionAnimations[this.direction].length);
    }
    else {
      this.fTime = 0;
    }
    if (this.currentFrame === this.directionAnimations[this.direction].length - 1) {
      this.currentFrame = 0;
    }
    else {
      this.currentFrame++;
    }
  });

  /**
   * Get the Mob's clear box
   *
   * @type {Function}
   * @method
   * @return Object
   */
  cMob.prototype.clearInfo = (function () {
    return ({
      x: Math.ceil(this.x - 1), y: Math.ceil(this.y),
      height: Math.ceil(this.height), width: Math.ceil(this.width),
      fromCenter: this.fromCenter
    });
  });

  /**
   * Render the mob on a canvas
   *
   * @type {Function}
   * @method
   * @param canvas jCanvas - A jCanvas wrapped canvas
   */
  cMob.prototype.render = (function (canvas) {
    this.atimer.update();
    this.mtimer.update();
    if (this.atimer.getMS() > this.fTime) {
      this.animateDirection();
    }
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
  cMob.prototype.move = (function () {
    this.clearLast = this.clearInfo();
    this.lastX = this.x;
    this.lastY = this.y;
    if (this.ySpeed !== 0) {
      this.moveY();
    }
    if (this.xSpeed !== 0) {
      this.moveX();
    }
  });

  /**
   * Move in the Y axis
   *
   * @method
   * @type {Function}
   */
  cMob.prototype.moveY = (function () {
    this.y += this.ySpeed * this.mtimer.deltaTime();
  });

  /**
   * Move in the X axis
   *
   * @method
   * @type {Function}
   */
  cMob.prototype.moveX = (function () {
    this.x += this.xSpeed * this.mtimer.deltaTime();
  });

  /**
   * Get the pixels along the mobs boundry edge
   *
   * @type {Function}
   */
  cMob.prototype.boundryEdgePixels = (function () {
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
  });

  /**
   * A Tilemap Canvas Object
   *
   * @param tilesheet The string pointing to the spritesheet with it's tile images.
   * @class cTilemap
   */
  function cTilemap(tilesheet) {
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
  }

  /**
   * Render the tiles on a canvas
   *
   * @type {Function}
   * @method
   * @param canvas jCanvas a jCanvas wrapped canvas
   */
  cTilemap.prototype.render = (function (canvas) {
    var startRow = Math.floor(scroll.x / tile.width);
    var startCol = Math.floor(scroll.y / tile.height);
    var rowCount = startRow + Math.floor(canvas.width() / this.tile.width) + 1;
    var colCount = startCol + Math.floor(canvas.height() / this.tile.height) + 1;
    rowCount = ((startRow + rowCount) > this.grid.width) ? grid.width : rowCount;
    colCount = ((startCol + colCount) > this.grid.height) ? grid.height : colCount;
    for (var row = startRow; row < rowCount; row++) {
      for (var col = startCol; col < colCount; col++) {
        var tileX = tile.width * row;
        var tileY = tile.height * col;
        tileX -= scroll.x;
        tileY -= scroll.y;
        if (typeof(this.map[row]) !== "undefined") {
          if (typeof(this.map[row][col]) !== "undefined") {
            if (tilesheet === "rect") {
              canvas.drawRect({
                x: tileX,
                y: tileY,
                height: tile.height,
                width: tile.width,
                fillStyle: "#000",
                fromCenter: false
              });
            }
            else {
              canvas.drawImage({
                source: this.tilesheet.source,
                x: tileX, y: tileY,
                height: tile.height, width: tile.width,
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
  });

  /**
   * Scroll a tilemap along a vector then re-render it
   *
   * @method
   * @type {Function}
   * @param vector Object the x and y direction
   * @param canvas jCanvas jCanvas wrapped canvas
   */
  cTilemap.prototype.scroll = (function (vector, canvas) {
    this.scroll.x += vector.x;
    this.scroll.y += vector.y;
    this.render(canvas);
  });

  /**
   * Clear the tilemap from the canvas
   *
   * @type {Function}
   * @method
   */
  cTilemap.prototype.clear = (function (canvas) {
    canvas.clearCanvas();
  });

  /**
   * Convert a pixel position to a tile
   *
   * @type {Function}
   * @method
   * @param coord Object the x and y position of the click
   * @return Object the tile position
   */
  cTilemap.prototype.pixelToTile = (function (coord) {
    var row = Math.floor(coord.x / tile.width);
    var col = Math.floor(coord.y / tile.height);
    if (typeof(this.map[row]) !== "undefined") {
      if (typeof(this.map[row][col]) !== "undefined") {
        return ({r: row, c: col});
      }
    }
    return (false);
  });

  /**
   * Placeholder for doing something on a click
   *
   * @type {Function}
   * @method
   * @param coord Object the x and y position
   */
  cTilemap.prototype.onClick = (function (coord) {

    //get col and row from pixel
    //call this.tileClick(col,row)
  });


  //////////////////////////
  // CANVAS FUNCTIONS BEGIN
  //////////////////////////

  /**
   * Maximizes the game canvases to their parent container
   * @type {Function}
   * @param modifier int The percentage of the parent container to maximize to
   * @method
   */
  this.maximize = (function (modifier) {
    modifier = typeof(modifier) != 'undefined' ? modifier / 100 : 1; // if modifier is not set, set it to 100%
    var folks = this.jcArray[0].parent(),
      fWidth = parseInt(folks.width()) * modifier,
      fHeight = parseInt(folks.height()) * modifier;
    //for each z_level canvas, maximize the canvas
    for (var i = 0; i < this.jcArray.length; i++) {
      this.jcArray[i].attr("height", fHeight).attr("width", fWidth);
    }
  });

  /**
   * Adds a Map of game objects to the game engine
   *
   * @type {Function}
   * @method
   * @param screenMap Object The map of game objects
   * @param doLoop bool Start the game after adding the game objects
   */
  this.addMap = (function (screenMap, doLoop) {

    //Position Handler Tags
    var defaultPositionInfo = {
      z_index: this.z_index.length
    };

    var ziIndex = [];
    for (var i = 0; i < screenMap.length; i++){
      // extract the position info from screenMap which is translated from a string to an object
      var newPositionInfo = screenMap[i];
      var positionHead = {  // Create a header for the position
        "name": (typeof(newPositionInfo.name) !== "undefined" ? newPositionInfo.name : $.fn.randjcHName()),
        "type": newPositionInfo.type
      };
      // Remove header from the info
      // Place the object header in the this.z_index at a specified position
      // Defaults at the current top level of the z_index
      // jcHandler position management tags are appended to the object
      var positionInfo = $.extend(true, {}, defaultPositionInfo, newPositionInfo);

      // If the z_index for the given position doesn't exist, create it
      if (typeof(this.z_index[positionInfo.z_index]) === "undefined") {
        this.z_index[positionInfo.z_index] = [];
        if (typeof(this.jcArray[positionInfo.z_index]) === "undefined") this.addZLayer(positionInfo.z_index);
      }

      if (typeof(ziIndex[positionInfo.z_index]) === "undefined") {
        ziIndex[positionInfo.z_index] = this.z_index[positionInfo.z_index].length;
      }
      // according to jsPerf, switch is terribly inefficient (88% slower).  Use if-elseif instead
      // Create the canvas object from the given entity type
      if (positionHead.type === "label") {
        var label = $.extend(true, {}, new cLabel, positionInfo);
        positionHead.clearInfo = label.clearInfo(this.jcArray[positionInfo.z_index]);
        this.positions[positionHead.name] = label;
      }
      else if (positionHead.type === "rect") {
        var rect = $.extend(true, {}, new cRect, positionInfo);
        positionHead.clearInfo = rect.clearInfo(this.jcArray[positionInfo.z_index]);
        this.positions[positionHead.name] = rect;
      }
      else if (positionHead.type === "image") {
        var image = $.extend(true, {}, new cImage, positionInfo);
        positionHead.clearInfo = image.clearInfo(this.jcArray[positionInfo.z_index]);
        image.source = this.imagePath + image.source;
        this.positions[positionHead.name] = image;
      }
      else if (positionHead.type === "line") {
        var line = new cLine;
        line.plot(positionInfo.xyArray);
        positionHead.clearInfo = line.clearInfo(this.jcArray[positionInfo.z_index]);
        delete positionInfo.xyArray;
        $.extend(true, line, positionInfo);
        this.positions[positionHead.name] = line;
      }
      else if (positionHead.type === "sprite") {
        var sprite = new cSprite(this.spritesheets[positionInfo.spritesheet], positionInfo);
        delete positionInfo.sprite;
        delete positionInfo.frames;
        $.extend(true, sprite, positionInfo);
        positionHead.clearInfo = sprite.clearInfo(this.jcArray[positionInfo.z_index]);
        this.positions[positionHead.name] = sprite;
      }
      else if (positionHead.type === "mob") {
        var mob = new cMob(this.spritesheets[positionInfo.spritesheet], positionInfo.directions);
        delete positionInfo.spritesheet;
        delete positionInfo.directions;
        $.extend(true, mob, positionInfo);
        positionHead.clearInfo = mob.clearInfo(this.jcArray[positionInfo.z_index]);
        if (mob.collides) {
          mob.setCollidable();
        }
        this.positions[positionHead.name] = mob;
      }
      else if (positionHead.type === "tilemap") {
        var tMap = new cTilemap(this.spritesheets[positionInfo.spritesheet]);
      }
      this.z_index[positionInfo.z_index][ziIndex[positionInfo.z_index]] = positionHead;
      ziIndex[positionInfo.z_index]++;
    }
    if (doLoop) {
      this.LOOP();
    }
  });

  /**
   * Adds a zLayer Canvas to the jcH for drawing zlayers on, delegates the onclick event
   *
   * @method
   * @param z int The z index
   */
  this.addZLayer = (function (z) {
    var tag = "zLayer" + z;
    $("<canvas id='" + tag + "'></canvas>").appendTo(this.jcArray[0].parent());
    tag = "#" + tag;
    $(tag).attr("height", this.jcArray[0].attr("height"))
      .attr("width", this.jcArray[0].attr("width"))
      .css("z_index", z)
      .on("click", this.checkClickMap);
    this.jcArray[z] = $(tag);
  });

  /**
   * Iterates through the z_index, drawing the stored objects
   *
   * @method
   */
  this.drawCanvas = (function () {
    for (var z = 0; z < this.z_index.length; z++) // for each spot in the z_index, starting at the beginning
    {
      if (typeof(this.z_index[z]) !== "undefined") {
        if (typeof(this.z_index[z][0]) !== "undefined") {
          this.drawZ(z, this.z_index[z]);
        }
      }
    }
  });

  /**
   * Takes an object and draws it to the appropriate canvas
   *
   * @method
   * @param Z int the z index being rendered
   * @param zPositions array The objects on that z-index
   */
  this.drawZ = (function (Z, zPositions) {
    for (var i = 0; i < zPositions.length; i++) // for each position in the z_index
    {
      var positionHead = zPositions[i]; // get the position Header
      var positionInfo = this.positions[positionHead.name];
      //Pre-Render
      if (typeof(positionInfo.preDraw) !== "undefined") {
        positionInfo.preDraw(this.jcArray[Z]);
      }
      // RENDERING
      if ((positionHead.type === "tilemap") && (!(positionInfo.isDrawn))) {
        positionInfo.clear(this.jcArray[Z]);
        positionInfo.render(this.jcArray[Z]);
        positionInfo.isDrawn = true;
      }
      var clear = positionHead.clearInfo || positionInfo.clearLast;
      if (typeof(clear) !== "undefined") {

        // get the position Info from the positions
        this.jcArray[Z].clearCanvas(clear);
        positionInfo.render(this.jcArray[Z]);
        // Remove clear info as item is only drawn once.  If it changes, the clearInfo will reset
        if (typeof(positionInfo.duration) === "undefined") {
          delete positionHead.clearInfo;
        }
        else if (positionInfo.duration === 0)  //non-animating sprite/mob  - updating the sprite with a new sprite source will refresh
        {
          delete positionHead.clearInfo;
        }
        delete positionInfo.clearLast;
      }
      //Post-Render
      if ((typeof(positionInfo.postDraw) === "function") || (typeof(positionInfo.postDraw) === "object")) {
        positionInfo.postDraw(this.jcArray[Z]);
      }
    }
  });

  /**
   * Returns a specific position from the canvas
   *
   * @param positionNames array the names of positions to get
   * @method
   * @return Array|bool bool if no positions found for each name
   *
   */
  this.getPositions = (function (positionNames) {
    var found = [];
    for (var i = 0; i < positionNames.length; i++) {
      if (this.positions[positionNames[i]]) {
        found[i] = this.positions[positionNames[i]];
      }
      else {
        found[i] = false;
      }
    }
    if (found.length === 0) {
      return (false);
    }
    else {
      return (found);
    }
  });

  /**
   * Sets positions to be collidable
   *
   * @param: positionNames Array The names of positions to make collidable
   * @method
   */
  this.makePositionsCollidable = (function (positionNames) {
    for (var i = 0; i < positionNames.length; i++) {
      this.positions[positionNames[i]].collides = true;
      this.excludeZIndex(this.positions[positionNames[i]].z_index, true);
      this.positions[positionNames[i]].boundryBox = new BOUNDRYBOX(this.positions[positionNames[i]].height, this.positions[positionNames[i]].width);
    }
  });

  /**
   * triggers collision and returns false if colliding object stops movement or returns true if can move through.
   *  if bothCollisions is true, will fire collision on both objects.
   *
   * @type {Function}
   * @method
   * @param collider Object the object doing the colliding
   * @param trigger bool whether or not to trigger the collision method
   * @param bothCollisions bool whether or not to fire the collision method on both colliding objects
   */
  this.collideOrPass = (function (collider, trigger, bothCollisions) {

    //Collision Detector
    //get direction
    //can have 2 non-opposing directions
    var collidablePixels = collider.boundryEdgePixels();
    var cPositionsFound = [];
    for (var i = 0; i < collidablePixels.length; i++) {
      var pixelList = collidablePixels[i];
      var lastX = pixelList.length - 1;
      if (typeof(pixelList[lastX]) !== "undefined") {
        if (typeof(pixelList[lastX - 1]) !== "undefined") //if x-line
        {
          cPositionsFound.push(this.positionsAtPixel({x: lastX, y: pixelList[lastX]}, collider.width, 1));
        }
        else {
          cPositionsFound.push(this.positionsAtPixel({x: lastX, y: pixelList[lastX]}, 1, collider.height));
        }
      }
    }
    var coords = {};
    for (var z = 0; z < cPositionsFound.length; z++) {
      var bang = this.positions[cPositionsFound[z]];
      if (typeof(trigger) === "undefined") {
        trigger = true;
      }
      if (bang) {
        if (trigger) {
          if (typeof(collider.onCollide) === "function") {
            collider.onCollide(bang, coords);
          }
          if ((bothCollisions) && (typeof(bang.onCollide) === "function")) {
            bang.onCollide(this.positions[cPositionsFound[z]], coords);
          }
        }
        if (bang.stopsMovement) {
          return (false);
        }
        else {
          return (true);
        }
      }
      else {
        return (true);
      }
    }
    return (true);
  });

  /**
   * Checks if a position is collidable
   *
   * @param coords Object the X Y Coordinate of a position
   * @method
   */
  this.collides = (function (coords) {
    var posArray = this.positionsAtPixel(positionEdge[i].x, positionEdge[i].y);
    if (posArray.length > 0) {
      return (posArray);
    }
    return (false);
  });

  /**
   * Sets a z_index to be excluded from position checks.  (For example, score values, background layers)
   * @method
   */
  this.excludeZIndex = (function (zArray, undo) {
    for (var i = 0; i < zArray.length; i++) {
      if (!(undo)) {
        this.excludes[zArray[i]] = true;
      }
      else {
        delete this.excludes[zArray[i]];
      }
    }
  });

  /**
   * Returns an array of position headers at a particular pixel across the z_indexes
   *
   * ignores excluded z indexes
   *
   * @method
   * @param coords Object the X Y coordinate of the position
   * @param w int the width of the square to check against
   * @param h int the height of the square to check against
   * @return Array|bool the Objects at that position or false if no positions found
   */
  this.positionsAtPixel = (function (coords, w, h) {
    var positions = [];
    for (var z = this.z_index.length - 1; z >= 0; z--) {
      if (!(this.excludes[z])) {
        if (this.jcArray[z].atPixel(coords.x, coords.y, h, w, true)) {
          for (var i = 0; i < this.z_index[z].length; i++) {
            var positionName = this.z_index[z][i].name;
            var box = this.positions[positionName].clearInfo(this.jcArray[z]);
            var x = Math.ceil(box.x);
            var y = Math.ceil(box.y);
            var width = Math.ceil(box.width);
            var height = Math.ceil(box.height);
            var leftBoundry = x;
            var rightBoundry = x;
            var topBoundry = y;
            var bottomBoundry = y;
            if (box.fromCenter) {
              leftBoundry -= (0.5 * width);
              rightBoundry += (0.5 * width);
              topBoundry -= (0.5 * height);
              bottomBoundry += (0.5 * height);
            }
            else {
              rightBoundry += width;
              bottomBoundry += height;
            }
            if ((coords.x >= leftBoundry) && (coords.x <= rightBoundry)
              && ((coords.y >= topBoundry) && (coords.y <= bottomBoundry))) {
              positions.push(positionName)
              break;
            }
          }
        }
      }
    }
    if (typeof(positions[0]) !== "undefined") {
      return (positions);
    }
    else {
      return (false);
    }
  });

  /**
   * Removes a specific position from the canvas
   *
   * @method
   * @param positionName string the position name to remove
   */
  this.removePosition = (function (positionName) {
    if ((positionName != "") && (typeof(positionName) != "undefined")) // if positionName
    {
      this.jcArray[this.positions[positionName].z_index].clearCanvas(this.positions[positionName]); // clear the object
      if (typeof(this.positions[positionName].onDie) === "function") {
        this.positions[positionName].onDie();
      }
      delete(this.positions[positionName]); // delete the position at positionName
      for (var z = this.z_index.length - 1; z >= 0; z--) // for each layer of zindex
      {
        for (var i = this.z_index[z].length - 1; i >= 0; i--) // for each object in that z layer
        {
          if (this.z_index[z][i].name === positionName) {
            this.z_index[z].splice(i, 1); // delete the position header in the z_index
            this.z_index[z] = $.fn.cleanArray(this.z_index[z]);
            if ((this.z_index[z].length <= 0) && (z > 0)) {
              this.removeZLayer(z);
            }
            var end = true;
            break;
          }
        }
        if (end) {
          break;
        }
      }
    }
  });

  /**
   * Removes a zLayer Canvas
   *
   * @method
   * @param z int the z-index to remove
   */
  this.removeZLayer = (function (z) {
    var tag = "#zLayer" + z;
    $(tag).remove();
    this.z_index.splice(z, 1);
    this.jcArray.splice(z, 1);
  });

  /**
   * Removes all positions from the game
   *
   * @param f A callback function to run when removal is complete
   * @method
   */
  this.clearPositions = (function (f) {
    for (z = this.z_index.length - 1; z >= 0; z--) {
      for (i = this.z_index[z].length - 1; i >= 0; i--) {
        this.removePosition(this.z_index[z][i].name);
      }
    }
    if (typeof(f) === "function") {
      f();
    }
  });

  /**
   * A click event has occurred, check the click map for a hit
   *
   * @param e ClickEvent The click event
   * @method
   */
  this.checkClickMap = (function (e) {
    var offset = $(this).offset();
    var jcH = $(this).parent().data("jcHandler");
    var clickX = Math.floor(e.pageX - offset.left);
    var clickY = Math.floor(e.pageY - offset.top);
    var pixelPositions = jcH.positionsAtPixel({x: clickX, y: clickY}, 1, 1);
    for (var i = 0; i < pixelPositions.length; i++) {
      if (typeof(jcH.positions[pixelPositions[i]].onClick) === "function") {
        if (jcH.positions[pixelPositions[i]].type === "tileMap") {
          jcH.positions[pixelPositions[i]].onClick(jcH.positions[pixelPositions[i]], {x: clickX, y: clickY});
        }
        else {
          jcH.positions[pixelPositions[i]].onClick(jcH.positions[pixelPositions[i]]);
        }
        break;
      }
    }
  });

  /**
   * Adds a gradient to list of gradients
   *
   * @type {Function}
   * @param gradientName string The name of the gradient for later lookup
   * @param color1 Object the x y and color of the start position
   * @param color2 Object the x y and color of the stop position
   * @method
   */
  this.addGradient = (function (gradientName, color1, color2) {
    var grad = {
      x1: color1.x, y1: color1.y,
      x2: color2.x, y2: color2.y,
      c1: color1.color, s1: color1.s,
      c2: color2.color, s2: color2.s
    };
    this.gradients[gradientName] = this.jcArray[0].gradient(grad);
  });

  /**
   * Adds a gradient to list of gradients
   *
   * @param gradientName string the name of the gradient to remove
   * @method
   */
  this.removeGradient = (function (gradientName) {
    delete this.gradients.gradientName;
  });

  /**
   * Scrolls a tilemap by a given vector amount
   *
   * @param positionName string the name of the tilemap to scroll
   * @param vector Object {x: y:}
   * @method
   */
  this.scrollTileMap = (function (positionName, vector) {
    this.positions[positionName].scroll(vector);
    var _i;
    for (var i = 0; i < this.z_index[z].length; i++) {
      if (this.z_index[this.positions[positionName].z_index][i].name === positionName) {
        _i = i;
        break;
      }
    }
    this.positions[positionName].clear(this.jcArray[this.positions[positionName].z_index]);
    this.positions[positionName].render(this.jcArray[this.positions[positionName].z_index]);
  });

  /**
   * Applies a stored gradient against a position
   *
   * @param positionName string The name of the position to gradient
   * @param gradientName string the name of the gradient to apply
   * @method
   */
  this.applyGradient = (function (positionName, gradientName) {
    this.positions[positionName].fillStyle = this.gradients[gradientName];
  });

  /**
   * Updates a position with new information
   *
   * @param positionName string the name of the position to update
   * @param newInfo Object the new data to apply to the position
   * @method
   */
  this.updatePosition = (function (positionName, newInfo) {
    var type = "", _z, _i;
    for (var z = this.z_index.length - 1; z >= 0; z--) {
      for (var i = 0; i < this.z_index[z].length; i++) {
        if (this.z_index[z][i].name === positionName) {
          _z = z;
          _i = i;
          break;
        }
      }
      if (_z) {
        break;
      }
    }
    this.z_index[_z][_i].clearInfo = this.positions[positionName].clearInfo(this.jcArray[_z]);
    $.extend(true, this.positions[positionName], newInfo);
  });

  /**
   * Adds a spritesheet to the game engine
   *
   * @param sprtieSheet string the image name of the spriteSheet relative to the imagePath property
   * @param subSprites Array Collection of sprite location and names on the sheet
   * @method
   */
  this.addSpritesheet = (function (spriteSheet, subSprites) {
    this.spritesheets[spriteSheet.name] = this.processSpritesheet(this.imagePath, spriteSheet, subSprites);
  });

  /**
   * Converts the spritesheet into images and data for later use
   *
   * @type {Function}
   * @method
   * @param imagePath string the path to the image from root
   * @param spritesheet Array the array of sprites on a sheet
   * @param subsprites Array the array of sprite details on a sheet
   * @return Object The spritesheet with sprites attached as an object
   */
  this.processSpritesheet = (function (imagePath, spritesheet, subsprites) {
    $.each(subsprites, function (spriteName, subSpriteInfo) {
      if (typeof(spritesheet.height) !== "undefined") {
        subSpriteInfo.height = spritesheet.height;
        subSpriteInfo.width = spritesheet.width;
      }
      subSpriteInfo.sx = subSpriteInfo.sx || 0;
      subSpriteInfo.sy = subSpriteInfo.sy || 0;
      subSpriteInfo.sWidth = subSpriteInfo.sWidth || 50;
      subSpriteInfo.sHeight = subSpriteInfo.sHeight || 50;
      subSpriteInfo.cropFromCenter = subSpriteInfo.cropFromCenter || false;
      subSpriteInfo.height = subSpriteInfo.height || 50;
      subSpriteInfo.width = subSpriteInfo.width || 50;
      spritesheet[spriteName] = $.extend(true, {}, {source: imagePath + spritesheet.source}, subSpriteInfo);
    });
    return (spritesheet);
  });

  /**
   *  A default drawing function which draws the objects on the canvas at the currently set fps
   *
   *  @method
   */
  this.LOOP = (function () {
    var self = this;
    if (self.paused === false) {
      requestAnimationFrame(function () {
        self.drawCanvas();
        self.LOOP();
      });
    }
  });

  /**
   * A default drawing function which draws the objects on the canvas at the currently set fps
   *
   * @method
   */
  this.PAUSE = (function () {
    if (this.paused === false) {
      this.paused = true;
    }
    else {
      this.paused = false;
      this.LOOP();
    }
  });
}
///////////////////////
//   jQuery Plugins  //
///////////////////////

/**
 * @module jQuery Plugins
 */

/**
 * creates a new jcHandler and attaches it to a canvas.
 *
 * @param init object the constructor needs for jcHandler
 */
(function ($) {
  $.fn.attachjcHandler = (function (init) {
    init.myCanvas = $(this);
    $(this).css("z_index", 0);
    var handle = new jcHandler(init);
    $(this).parent().data("jcHandler", handle);
    $(this).on({
      click: handle.checkClickMap
    });
    return (handle);
  });
})(jQuery);

/**
 * If there's something at a given pixel for a canvas at a specified location
 * if t is true, returns true the pixel is transparent or false if it is not
 *
 * @param canvas jCanvas the canvas to check
 * @param x int the X coordinate to check
 * @param y int the Y coordinate to check
 * @param t
 *
 */
(function ($) {
  $.fn.atPixel = (function (x, y, w, h, t) {
    var c = $(this).loadCanvas();
    var img = c.getImageData(x, y, w, h);
    var data = img.data;
    //data = [r,g,b,a] at pixel
    if (t) //if checking for transparency
    {
      var counter = 0;
      for (var a = 3; a < data.length; a += 4) {
        if (data[a] > 0) //if alpha not transparent
        {
          return (true);
        }
      }
      return (false);
    }
    return (data); // return pixel data
  });
})(jQuery);

/**
 * Copies the contents of a canvas to another canvas
 *
 * @param destination jCanvas The destination canvas
 * @param destOptions Object the options for copying
 */
(function ($) {
  $.fn.copyCanvas = (function (destination, destOptions) {
    var c = $(this).loadCanvas();
    var img = c.getImageData(0, 0, source.width(), source.height());
    var data = img.data;
    var d = destination.loadCanvas();
    destOptions.x = destOptions.x || 0;
    destOptions.y = destOptions.y || 0;
    if (!(destOptions.dx)) {
      d.putImageData(data, destOptions.x, destOptions.y);
    }
    else {
      d.putImageData(data, destOptions.x, destOptions.y, destOptions.dx, destOptions.dy, destOptions.dw, destOptions.dh);
    }
  });
})(jQuery);

/**
 * Removes undefined indexes from an array
 *
 * @param cleanMe Array the array to cleanup
 */
(function ($) {
  $.fn.cleanArray = (function (cleanMe) {
    var cleaner = [];
    for (var i = 0; i < cleanMe.length; i++) {
      if (typeof(cleanMe[i]) !== "undefined") {
        cleaner.push(cleanMe[i]);
      }
    }
    return (cleaner);
  });
})(jQuery);

/**
 * Generates a random name for a canvas object
 */
(function ($) {
  $.fn.randjcHName = (function () {
    var length = 8 + Math.floor(7 * (Math.random() % 1));
    var val = "jcH";
    for (var i = 1; i <= length; i++) {
      var slots = 1 + Math.floor(4 * (Math.random() % 1));
      switch (slots) {
        case 1:
          val += 48 + Math.floor(10 * (Math.random() % 1));
          break;
        case 2:
          val += String.fromCharCode(65 + Math.floor(26 * (Math.random() % 1)));
          break;
        case 3:
          val += String.fromCharCode(97 + Math.floor(26 * (Math.random() % 1)));
          break;
      }
    }
    return (val);
  });
})(jQuery);

/**
 * Converts a json encoded screen map to a screen map appropriate for the game
 */
(function ($) {
  $.fn.parsejArray = (function (screenMap) {
    if (typeof(screenMap) === "string") {
      screenMap = $.parseJSON(screenMap);
    }
    for (var i = 0; i < screenMap.length; i++) {
      if ($.parseJSON(screenMap[i]) != null) {
        screenMap[i] = $.parseJSON(screenMap[i])
      }
    }
    return (screenMap);
  });
})(jQuery);
