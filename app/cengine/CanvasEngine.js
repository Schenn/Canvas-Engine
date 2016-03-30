/**
 * Created by schenn on 3/25/16.
 */

/**
 * Runs the collection of entities in your game scene and coordinates their interactions.
 *
 * @param init
 * @constructor
 * @todo Add web workers for collision, pre and post rendering methods, click collection, and position sorting
 * @todo Add web socket support for creating and communicating through a socket to a backend
 */
var CanvasEngine = function(init){
  // The array of canvases we are drawing to
  this.canvasArray = [];
  // Our initial canvas
  this.canvasArray[0] = $(init.myCanvas);
  this.canvasArray[0].css("z-index",0);
  // Do not search these z-indexes for clicks or collisions.
  // Be sure to mark your inactive layers to improve performance issues.
  this.excludes = [];
  this.imagePath = init.imagePath;
  // The different objects in the world
  this.positions = {};
  // The order which objects should be drawn
  this.z_index = [];
  // The Spritesheets which will be used.
  this.spritesheets = {};

  // User-added functions
  this.userFunc = {};

  // Is the game loop engaged?
  this.paused = false;

  // Gradients, Filters, and patterns;
  this.gradients = {};
  this.filters = {};
  this.pattens = {};

};

/**
 * Maximizes the game screen relative to its container
 * @type {Function}
 * @param modifier int A percentage, if you don't wish to go to 100% for some reason
 * @method
 */
CanvasEngine.prototype.maximize = function(modifier){
  this.canvasArray.forEach(function(canvas){
    $(canvas).maximize(modifier);
  });
};

/**
 * Adds game elements to the scene
 *
 * @param sceneMap The map of elements
 * @param start Start the game loop after processing the map?
 * @method
 * @todo Validation Check on incoming data
 */
CanvasEngine.prototype.addMap = function(sceneMap, start){

  var self = this;

  // If no z index is provided, add to the top
  var defaultPositionInfo = {
    align: 'center',
    angle: 0,
    baseline: 'middle',
    ccw: false,
    closed: false,
    compositing: 'source-over',
    cornerRadius: 0,
    cropFromCenter: true,
    end: 360,
    fromCenter: false,
    height: 0,
    inDegrees: true,
    load: null,
    mask: false,
    opacity: 1,
    projection: 0,
    r1: null,
    r2: null,
    radius: 0,
    repeat: 'repeat',
    rounded: false,
    scaleX: 1,
    scaleY: 1,
    shadowBlur: 3,
    shadowColor: 'transparent',
    shadowX: 0,
    shadowY: 0,
    sHeight: 0,
    sides: 3,
    source: '',
    start: 0,
    strokeCap: 'butt',
    strokeJoin: 'miter',
    strokeStyle: 'transparent',
    strokeWidth: 1,
    sWidth: 0,
    sx: null,
    sy: null,
    text: '',
    width: 0,
    x: 0,
    x1: 0,
    x2: 0,
    y: 0,
    y1: 0,
    y2: 0,
    z_index: this.z_index.length
  };

  // entity_index is used to prevent objects on the same z-index from overriding each other
  var entity_index = [];

  for(var i=0; i<sceneMap.length; i++){
    /**
     * We should do a sanity check on the object to make sure it's valid and doesn't clash
     *  with any internal work.
     */

    var newEntityData = sceneMap[i];

    /**
     * The position metadata keeps track of the data relevant to the engine.
     *  Such as name, what type of object, it's clearbox, whether its collidable or not, etc.
     *  This way, the entity doesn't get corrupted by the fields which the engine requires.
     *  They are added and managed by the engine to the data block.
     */

    var positionMeta = {
      "name": window.utilities.orDefault(newEntityData.name, window.utilities.randName()),
      "type": newEntityData.type,
      isDrawn: false
    };

    // Create the initial position data.
    // The objects from the author need to be mutated into our special game objects.
    // We need to be sure the object has basic values required for rendering.
    var positionData = $.extend(true, {}, defaultPositionInfo, newEntityData);


    // Initialize our position array for this z index and add the z-layer
    //  to the screen if needed.
    if(!window.utilities.exists(this.z_index[positionData.z_index])){
      this.z_index[positionData.z_index] = [];
      if(!window.utilities.exists(this.canvasArray[positionData.z_index])){
        this.addZLayer(positionData.z_index);
      }
    }

    // Set the number of entities in that z index as the minimum index to begin adding entities
    if(!window.utilities.exists(entity_index[positionData.z_index])){
      entity_index[positionData.z_index] = this.z_index[positionData.z_index].length;
    }

    // Smush our game entity classes into the user data.
    // The user can override the default methods for these objects.
    //  When writing the docs, this detail needs to be mentioned.
    var entity = {};
    var entities = {
      "label": Label,
      "rect": Rect,
      "image": cImage,
      "line": Line,
      "sprite": Sprite,
      "mob": Mob,
      "tilemap": Tilemap
    };
    var complex = ["sprite", "mob", "tilemap"];
    var type = positionMeta.type.toLowerCase();
    if(entities.hasOwnProperty(type)){
      if(complex.indexOf(type) === -1){
        entity = $.extend(true, entity, new entities[type](), positionData);
      }
      switch(type){
        case "label":
          $.extend(true, entity, new Label(positionData));
          break;
        case "image":
          entity.source = this.imagePath + entity.source;
          break;
        case "line":
          entity.plot(positionData.xyArray);
          delete entity.xyArray;
          break;
        case "sprite":
          var sprite = new Sprite(this.spritesheets[positionData.spritesheet].sheet, positionData);
          delete positionData.sprite;
          delete positionData.frames;
          $.extend(true, entity, sprite, positionData);
          break;
        case "mob":
          var mob = new Mob(this.spritesheets[positionData.spritesheet].sheet,[positionData.directions]);
          delete positionData.spritesheet;
          delete positionData.directions;
          $.extend(true, entity, mob, positionData);
          if(entity.collides){
            entity.setCollidable();
          }
          break;
        case "tilemap":
          tmap = new Tilemap(this.spritesheets[positionData.tilesheet].sheet);
          break;
        default:
          // Entity only needed initial extending
          break;
      }
    } else {
      // Invalid object provided. Throw
    }

    positionMeta.clearInfo = entity.clearInfo(this.canvasArray[positionData.z_index]);
    this.positions[positionMeta.name] = entity;
    this.z_index[positionData.z_index][entity_index[positionData.z_index]] = positionMeta;
    entity_index[positionData.z_index]++;

    if(start){
      this.Loop();
    }
  }

};

/**
 * Add a Z-index layer to the game screen
 * @param z
 * @method
 */
CanvasEngine.prototype.addZLayer = function(z){
  var newZ = this.canvasArray[0].
    addZLayer(
      this.canvasArray[0].attr("height"),
      this.canvasArray[0].attr("width"),
      z
  );

  newZ.on("click", this.checkClickMap);
  this.canvasArray[z] = newZ;
};

/**
 * Draw the game screen!
 * @method
 */
CanvasEngine.prototype.drawScreen = function(){
  var self = this;
  this.z_index.forEach(function(positionArray, zIndex){
    self.drawZ(zIndex, positionArray);
  });
};

/**
 * Draw a z-layer of positions
 *
 * @param z
 * @param positions
 * @method
 * @todo Web Workers work well when working
 * @todo Assign the pre-draw and post-draw methods to web workers so the primary script isn't slowed down
 */
CanvasEngine.prototype.drawZ = function(z, positions){
  for(var i = 0; i < positions.length; i++){
    var meta = positions[i];
    var entity = this.positions[meta.name];

    // Before drawing, perform any pre-drawing methods

    if(window.utilities.isFunction(entity.preDraw)){
      entity.preDraw(this.canvasArray[z]);
    }

    // clear and render any positions that have changed
    if(meta.type === "tilemap" && !meta.isDrawn){
      entity.clear(this.canvasArray[z]);
      entity.render(this.canvasArray[z]);
    } else if(!meta.isDrawn){

      var clear = meta.clearInfo;
      var clearLast = entity.clearLast;
      if(window.utilities.exists(clear)){
        this.canvasArray[z].clearCanvas(clear);
      }
      if(window.utilities.exists(clearLast)){
        this.canvasArray[z].clearCanvas(clearLast);
        delete entity.clearLast;
      }

      // Draw the entity
      entity.render(this.canvasArray[z]);
      meta.isDrawn = true;
      // Clear the old clear data
      if(!window.utilities.exists(entity.duration) || entity.duration === 0){
        delete meta.clearInfo;
      }
    }

    // Do any post-render functions
    if(window.utilities.isFunction(entity.postDraw)){
      entity.postDraw(this.canvasArray[z]);
    }

  }
};

/**
 * Don't check these z layers for clicks or collisions
 *
 * @param indexes
 * @param invert
 */
CanvasEngine.prototype.excludeZIndex = function(indexes, invert){
  var excl = this.excludes;
  indexes.forEach(function(index){
    if(!invert){
      excl[index] = true;
    } else {
      delete excl[index];
    }
  });
};

/**
 * The primary animation loop method.
 *
 * @method
 */
CanvasEngine.prototype.Loop = function(){

  if(this.paused === false){
    requestAnimationFrame(function(timestamp){
      window.CanvasEngine.drawScreen(timestamp);
      window.CanvasEngine.Loop(timestamp);
    });
  }
};

CanvasEngine.prototype.pause = function(){
  this.paused = !this.paused;
  if(!this.paused){ this.Loop();}
};

/**
 * Get a collection of entities with matching names.
 *
 * @param names
 * @returns {*}
 * @method
 */
CanvasEngine.prototype.getEntities = function(names){
  var found = [];
  for (var i = 0; i < names.length; i++ ) {
    found[i] = this.positions.hasOwnProperty(names[i]) ?
      this.positions[names[i]] :
      false;
  }

  return found.length > 0 ? found : false;
};

/**
 * Get the metadata for a collection of entities from their names
 * @param names
 * @returns {Array}
 */
CanvasEngine.prototype.getMetadata = function(names){
  var found = [];
  for (var i = 0; i < names; i++){
    var nameFound = false;
    for (var z = 0; z < this.z_index.length; z++) {
      for(var e=0; e< this.z_index[z].length; e++){
        if(this.z_index[z][e].name === names[i]){
          found.push(this.z_index[z][e]);
          nameFound = true;
          break;
        }
      }
      if(nameFound) {
        break;
      }
    }
  }
  return found;
};

/**
 * Makes every entity with a matching name collidable
 *
 * @param names
 * @method
 */
CanvasEngine.prototype.makePositionsCollidable = function(names){
  var self = this;
  var entities = this.getEntities(names);
  if(entities){
    entities.forEach(function(entity){
      entity.collides = true;
      self.excludeZIndex([entity.z_index], true);
      entity.boundryBox = new BoundryBox(entity.height, entity.width);
    });
  } else {
    console.log("Unable to find any entities to make collidable.");
    console.log(names);
  }
};

/**
 * Returns an array of position metadata at a particular pixel across the z_indexes
 *
 * ignores excluded z indexes
 *
 * @method
 * @param coords Object the X Y coordinate of the position
 * @param w int the width of the square to check against
 * @param h int the height of the square to check against
 * @return Array|bool the Objects at that position or false if no positions found
 */
CanvasEngine.prototype.positionsAtPixel = function(coords, w, h){
  var positions = [];
  for (var z = this.z_index.length - 1; z >= 0; z--) {
    if (!(this.excludes[z])) {
      if (this.canvasArray[z].atPixel(coords.x, coords.y, h, w, true)) {
        for (var i = 0; i < this.z_index[z].length; i++) {
          var positionName = this.z_index[z][i].name;
          var box = this.positions[positionName].clearInfo(this.canvasArray[z]);
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
          if ((coords.x >= leftBoundry) && (coords.x <= rightBoundry) &&
            ((coords.y >= topBoundry) && (coords.y <= bottomBoundry))) {
            positions.push(positionName);
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
};

/**
 * triggers collision and returns false if colliding object stops movement or returns true if can move through.
 *  if bothCollisions is true, will fire collision on both objects.
 *
 *  Doesn't check for multiple collisions. Stops checking at the first possible collision which is passed into
 *    the callback
 *
 * @method
 * @param collider Object the object doing the colliding
 * @param trigger bool whether or not to trigger the collision method
 * @param both bool whether or not to fire the collision method on both colliding objects
 * @todo be able to handle multiple collisions
 * @todo pass the coordinate of collision to the objects
 */
CanvasEngine.prototype.collideOrPass = function(collider, trigger, both){
  var collidablePixels = collider.boundryEdgePixels();
  var cPositionsFound = [];
  var coords = {};
  for (var i = 0; i < collidablePixels.length; i++) {
    var lastX = collidablePixels[i].length - 1;
    if(window.utilities.exists(collidablePixels[i][lastX])){
      coords.x = lastX;
      coords.y = collidablePixels[i][lastX];
      var positions = window.utilities.exists(collidablePixels[i][lastX-1]) ?
        this.positionsAtPixel(coords, collider.width, 1) :
        this.positionsAtPixel(coords, 1, collider.height);

      cPositionsFound.push(positions);
    }
  }

  if(cPositionsFound.length > 0) {

    if(!window.utilities.exists(trigger)){
      trigger = true;
    }
    if(window.utilities.exists(cPositionsFound[0])){
      var bang = cPositionsFound[0];
      if(trigger){
        if(window.utilities.isFunction(collider.onCollide)){
          collider.onCollide.call(bang, coords);
        }

        if(both && window.utilities.isFunction(bang.onCollide)) {
          bang.onCollide.call(collider, coords);
        }
      }
      return !bang.stopsMovement;
    }
  }
  return true;
};

/**
* Checks if a position is collidable
*
* @param coords Object the X Y Coordinate of a position
* @method
*/
CanvasEngine.prototype.collides = (function (coords) {
  var posArray = this.positionsAtPixel(coords,1,1);
  if (posArray.length > 0) {
    return (posArray);
  }
  return (false);
});

CanvasEngine.prototype.removeEntity = function(name){
  if(window.utilities.exists(name) && name !== ""){
    var position = this.positions[name];
    this.canvasArray[position.z_index].clearCanvas(position);

    if(window.utilities.isFunction(position.onDie)){
      position.onDie();
    }
    delete this.positions[name];

    var end = false;
    // for each layer of zindex
    for (var z = this.z_index.length - 1; z >= 0; z--)
    {
      // for each object in that z layer
      for (var i = this.z_index[z].length - 1; i >= 0; i--)
      {
        if (this.z_index[z][i].name === name) {
          // delete the position header in the z_index
          this.z_index[z].splice(i, 1);
          this.z_index[z] = window.utilities.cleanArray(this.z_index[z]);
          if ((this.z_index[z].length <= 0) && (z > 0)) {
            this.removeZLayer(z);
          }
          end = true;
          break;
        }
      }
      if (end) {
        break;
      }
    }
  }
};

/**
 * Removes a zLayer Canvas
 *
 * @method
 * @param z int the z-index to remove
 */
CanvasEngine.prototype.removeZLayer = (function (z) {
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
CanvasEngine.prototype.clearPositions = (function (f) {
  for (var z = this.z_index.length - 1; z >= 0; z--) {
    for (var i = this.z_index[z].length - 1; i >= 0; i--) {
      this.removePosition(this.z_index[z][i].name);
    }
  }
  if (window.utilities.isFunction(f)) {
    f();
  }
});

/**
 * A click event has occurred, check the click map for a hit
 *
 * @param e ClickEvent The click event
 * @method
 */
CanvasEngine.prototype.checkClickMap = function(e){
  var offset = $(this).offset();
  var ce = window.CanvasEngine;
  var clickX = Math.floor(e.pageX - offset.left);
  var clickY = Math.floor(e.pageY - offset.top);
  var pixelPositions = ce.positionsAtPixel({x: clickX, y: clickY}, 1, 1);
  for (var i = 0; i < pixelPositions.length; i++) {
    if (typeof(ce.positions[pixelPositions[i]].onClick) === "function") {
      if (ce.positions[pixelPositions[i]].type === "tileMap") {
        ce.positions[pixelPositions[i]].onClick(ce.positions[pixelPositions[i]], {x: clickX, y: clickY});
      }
      else {
        ce.positions[pixelPositions[i]].onClick(ce.positions[pixelPositions[i]]);
      }
      break;
    }
  }
};

/**
 * Add a canvas gradient to the stored gradients
 *
 * This can be referenced by name in your objects fillstyles
 * @param name
 * @param coords
 * @param colors
 */
CanvasEngine.prototype.addGradient = function(name, coords, colors){
  this.gradients[name] = new Gradient(name, coords, colors).create(this.canvasArray[0]);
};

CanvasEngine.prototype.removeGradient = function(name){
  if(this.gradients.hasOwnProperty(name)){
    delete this.gradients[name];
  }
};

CanvasEngine.prototype.scrollTileMap = function(name, vector){
  this.positions[name].scroll(vector);
  this.positions[name].clear(this.canvasArray[this.positions[name].z_index]);
  this.positions[name].render(this.canvasArray[this.positions[name].z_index]);
};

/**
* Updates a position with new information
*
* @param name string the name of the position to update
* @param info Object the new data to apply to the position
* @method
*/
CanvasEngine.prototype.updateEntity = function(name, info){
  var _z, _i;
  for (var z = this.z_index.length - 1; z >= 0; z--) {
    for (var i = 0; i < this.z_index[z].length; i++) {
      if (this.z_index[z][i].name === name) {
        _z = z;
        _i = i;
        break;
      }
    }
    if (_z) {
      break;
    }
  }

  $.extend(true, this.positions[name], info);
  var meta = this.z_index[_z][_i];
  meta.clearInfo = this.positions[name].clearInfo(this.canvasArray[_z]);
  meta.isDrawn = false;
};

/**
 * Applies a stored gradient against a position
 *
 * @param positionName string The name of the position to gradient
 * @param gradientName string the name of the gradient to apply
 * @method
 */
CanvasEngine.prototype.applyGradient = (function (positionName, gradientName) {
  this.positions[positionName].fillStyle = this.gradients[gradientName].gradient;
});

CanvasEngine.prototype.addSpritesheet = function(sheet, sprites){
  this.spritesheets[sheet.name] = new Spritesheet(this.imagePath, sheet, sprites);
};


(function($){
  $.fn.attachCanvasEngine = function(init){
    init.myCanvas = $(this);
    init.myCanvas.css("z_index",0);
    var handle = new CanvasEngine(init);
    window.CanvasEngine = handle;
    init.myCanvas.on({
      click: handle.checkClickMap
    });
    return handle;
  };
})(jQuery);