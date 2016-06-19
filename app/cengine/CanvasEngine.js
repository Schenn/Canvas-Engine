/**
 * @author Steven Chennault <schenn@gmail.com>
 */

/**
 * @namespace GeneralTypes
 */
/**
 * @typedef {Object.<string, number>} GeneralTypes~coords
 * @property {number} x
 * @property {number} y

 */


(function(){
  /**
   * @type {boolean}
   * @default
   */
  var paused = true;

  /**
   * CanvasEngine contains the system.
   *
   * @namespace CanvasEngine
   *
   */
  var CanvasEngine = {
  };

  /**
   * Add a collection of entities from a json array.
   * @memberof CanvasEngine
   * @param {Array} screenMap initialization data for the entities to add.
   * @param {boolean} start Start animating after adding entities.
   */
  CanvasEngine.addMap = function(screenMap, start){
    // Convert to entity Array

    var entities = this.EntityManager.fromMap(screenMap);

    this.addEntities(entities, start);
  };

  /**
   * Add an array of Entities
   *    (Entity being a class derived from the entity base class)
   * @memberof CanvasEngine
   * @param {Array} entities The Entities to add, grouped by z-index
   * @param {boolean} start Start animating after adding entities
   *
   * @todo Change the expected sort structure of entities
   */
  CanvasEngine.addEntities = function(entities, start){
    $.each(entities, function(z){
      CanvasEngine.Screen.addZLayer(z);
    });

    this.EntityTracker.addEntities(entities);

    if(start){
      paused = false;
      this.Loop();
    }
  };

  /**
   * Run Forever
   * @memberof CanvasEngine
   *
   * @private
   */
  CanvasEngine.Loop = function(){
    var self = this;
    requestAnimationFrame(function(){
      self.Screen.drawScreen();
      self.Loop();
    });
  };

  /**
   * Draw through a z-index.
   *  Go through each entity in the current z-index and tell it to update.
   *  If it has a renderer component and that component is dirty,
   *    tell the renderer component to clear
   *    tell the renderer component to render
   *  Tell the entity to postRender
   *
   * @memberof CanvasEngine
   * @param {number} z The z index to draw
   * @param {jQuery#enhancedContext} ctx The EnhancedContext of a canvas
   */
  CanvasEngine.drawZ = function(z, ctx){
    if(!paused && CanvasEngine.EntityTracker.entityCount() > 0) {
      setTimeout(function(){
        $.each(CanvasEngine.EntityTracker.getEntitiesByZ(z), function (index, entity) {
          if(CanvasEngine.utilities.exists(entity)){
            entity.broadcastToComponents("update");
            if(entity.getFromComponent("Renderer", "isDirty")){
              entity.messageToComponent("Renderer", "clear", ctx);
              entity.messageToComponent("Renderer", "render", ctx);
            }
            entity.broadcastToComponents("postRender");
          }
        });
      },1);
    }
  };

  /**
   * Clear all entities from the system
   * @memberof CanvasEngine
   */
  CanvasEngine.clearEntities = function(){
    //noinspection JSUnusedAssignment
    paused = true;
    CanvasEngine.EntityTracker.clearEntities();
    paused = false;
  };


  /**
   * Tell every entity under the current coords that the mouse is interacting with it.
   *
   * Called by the Screen when a mouse interacts with the stack.
   *
   * @param {GeneralTypes~coords} coords The click position
   * @param {string} interaction the type of mouse interaction
   * @param {GeneralTypes~coords} [previous] The Previous mouse position
   * @memberof CanvasEngine
   *
   */
  CanvasEngine.mouse = function(coords, interaction, previous){
    setTimeout(function(){
      var ents = CanvasEngine.positionsAtPixel(coords, 1, 1, "Mouse");
      $.each(ents, function(index, ent){
        switch(interaction){
          case "MouseMove":
            ent.broadcastToComponents("onMouseOver", coords);
            ent.broadcastToComponents("onMouseMove", coords);
            break;
          case "MouseDown":
            ent.broadcastToComponents("onMouseDown", coords);
            break;
          case "MouseUp":
            ent.broadcastToComponents("onMouseUp", coords);
            break;
          case "Click":
            ent.broadcastToComponents("Click", coords);
            break;
          default:
            console.log ("I don't know how to handle "+interaction);
            break;
        }

      });

    if(CanvasEngine.utilities.exists(previous) && interaction === "MouseMove"){
      var last = CanvasEngine.positionsAtPixel(previous, 1, 1, "Mouse");
      // for each entity in last, if they are not in ents, then trigger onMouseOut
      $.each(last, function(index, lastEnt){
        if(!ents.includes(lastEnt)){
          lastEnt.broadcastToComponents("onMouseOut");
        }
      });
    }
    },1);
  };



  /**
   * Pause the game
   * @memberof CanvasEngine
   *
   * @param {boolean} forceIt
   */
  CanvasEngine.pause = function(forceIt){
    paused = (CanvasEngine.utilities.exists(forceIt)) ? forceIt : !paused;

    if(!paused){
      this.Loop();
    }
  };

  /**
   * Pause the engine on a right click.
   * @memberof CanvasEngine
   *
   */
  CanvasEngine.pauseOnRightClick = function(){
    this.pause(true);
  };

  /**
   * Unpause the engine
   * @memberof CanvasEngine
   */
  CanvasEngine.unPause = function(){
    $(document).off(".unpause");
    $(window).off(".unpause");

    this.pause(false);
  };

  /**
   * Is the engine currently paused?
   * @memberof CanvasEngine
   * @returns {boolean}
   */
  CanvasEngine.isPaused = function(){
    return paused;
  };

  /**
   * Get all the entities at a given pixel
   * @memberof CanvasEngine
   *
   * @param {GeneralTypes~coords} p pixel coordinate
   * @param {number} w width of search area
   * @param {number} h height of search area
   * @param {string} [hasComponent] Require entities to have a specific component.
   * @returns {Array} Entities at the specified position
   */
  CanvasEngine.positionsAtPixel = function(p, w, h, hasComponent){
    var zPixels =CanvasEngine.Screen.atPixel(p.x, p.y, h, w, true);
    if (zPixels.length > 0) {
      return CanvasEngine.EntityTracker.positionsAtPixel(p,w,h, Object.keys(zPixels), hasComponent);
    } else {
      return [];
    }
  };

  /**
   * Setup the canvas engine.
   *
   * @method
   * @param {jQuery | HTMLElement} canvas The canvas to base the engine off of
   *
   */
  CanvasEngine.setup = function(canvas){
    CanvasEngine.Screen.setScreen(canvas);
    $(document).on("contextmenu", function(){
      CanvasEngine.pauseOnRightClick();

      $(document).on("keypress.unpause", function(e){
        if(e.keyCode === 27){
          CanvasEngine.unPause();
        }
      });
      $(document).on("click.unpause", CanvasEngine.unPause);
      $(window).on("blur.unpause", CanvasEngine.unPause);

    });

  };

  window.CanvasEngine = CanvasEngine;
})();
