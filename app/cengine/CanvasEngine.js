/**
 * CanvasEngine is the window level object which contains all the functionality.
 * @class
 */
var CanvasEngine = {
  paused: true
};

/**
 * Add a collection of entities from a json array.
 *
 * @method
 * @param screenMap array of initialization data for each entity
 * @param start boolean - Start animating after adding entities.
 */
CanvasEngine.addMap = function(screenMap, start){
  // Convert to entity Array

  var entities = this.EntityManager.fromMap(screenMap);

  this.addEntities(entities, start);
};

/**
 * Add an array of Entities
 *    (Entity being a class derived from the entity base class)
 * @method
 * @param entities Array of entities
 * @param start Boolean - Start animating after adding entities
 */
CanvasEngine.addEntities = function(entities, start){
  $.each(entities, function(z){
    CanvasEngine.Screen.addZLayer(z);
  });

  this.EntityTracker.addEntities(entities);

  if(start){
    this.paused = false;
    this.Loop();
  }
};

/**
 * Animate and process
 * @method
 */
CanvasEngine.Loop = function(){
  requestAnimationFrame(function(){
    CanvasEngine.Screen.drawScreen();
    CanvasEngine.Loop();
  });
};

/**
 * Draw a z index
 * @method
 * @param z The z index to draw
 * @param ctx The EnhancedContext of a canvas
 */
CanvasEngine.drawZ = function(z, ctx){
  if(!this.paused && CanvasEngine.EntityTracker.entityCount() > 0) {
    $.each(this.EntityTracker.getEntitiesByZ(z), function (index, entity) {
      if(CanvasEngine.utilities.exists(entity)){
        entity.broadcastToComponents("update");
        if(entity.getFromComponent("Renderer", "isDirty")){
          entity.messageToComponent("Renderer", "clear", ctx);
          entity.messageToComponent("Renderer", "render", ctx);
        }
        entity.broadcastToComponents("postRender");
      }
    });
  }
};

/**
 * Clear all entities from the game
 */
CanvasEngine.clearEntities = function(){
  this.paused = true;
  CanvasEngine.EntityTracker.clearEntities();
  this.paused = false;
};

/**
 * Tell every entity under the click coordinate that it has been clicked.
 * @method
 * @param coords The click position
 */
CanvasEngine.checkClickMap = function(coords){
  var ents = CanvasEngine.positionsAtPixel(coords, 1, 1);
  $.each(ents, function(index, ent){
    ent.broadcastToComponents("Click", coords);
  });
};

/**
 * Pause the game
 * @method
 */
CanvasEngine.pause = function(){
  this.paused = !this.paused;
};


/**
 * Get all the entities at a given pixel
 *
 * @method
 * @param p pixel coordinate
 * @param w width of search area
 * @param h height of search area
 * @returns {Array} of entities
 */
CanvasEngine.positionsAtPixel = function(p, w, h){
  var zPixels =CanvasEngine.Screen.atPixel(p.x, p.y, h, w, true);
  if (zPixels.length > 0) {
    return CanvasEngine.EntityTracker.positionsAtPixel(p,w,h, Object.keys(zPixels));
  } else {
    return [];
  }
};

/**
 * Setup the canvas engine.
 *
 * @method
 * @param canvas The canvas to base the engine off of
 * @param init A json array of entities and their data
 * @param start the boolean to indicate whether or not to start animating after adding entities.
 *
 * @todo Just remove this. The simplicity sounds nice, but in practice, its not helping.
 */
CanvasEngine.setup = function(canvas, init, start){
  CanvasEngine.Screen.setScreen(canvas);
  this.addMap(init, start);
};