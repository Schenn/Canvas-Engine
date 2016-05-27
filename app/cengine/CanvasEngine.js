(function(){
  var contextMenuOpen = false;
  var paused = true;
  /**
   * CanvasEngine is the window level object which contains all the functionality.
   * @class
   */
  var CanvasEngine = {
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
      paused = false;
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
   * Clear all entities from the game
   */
  CanvasEngine.clearEntities = function(){
    paused = true;
    CanvasEngine.EntityTracker.clearEntities();
    paused = false;
  };


  /**
   * Tell every entity under the current coords that the mouse is interacting with it.
   * @method
   * @param coords The click position
   * @param interaction the type of mouse interaction
   * @param previous The Previous mouse position
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
   * @method
   * @param forceIt bool
   */
  CanvasEngine.pause = function(forceIt){
    paused = (CanvasEngine.utilities.exists(forceIt)) ? forceIt : !paused;

    if(!paused){
      this.Loop();
    }
  };

  CanvasEngine.pauseOnRightClick = function(){
    contextMenuOpen = true;
    paused = true;
  };

  CanvasEngine.unPause = function(){
    $(document).off(".unpause");
    $(window).off(".unpause");

    paused = false;
  };

  CanvasEngine.isPaused = function(){
    return paused;
  };

  /**
   * Get all the entities at a given pixel
   *
   * @method
   * @param p pixel coordinate
   * @param w width of search area
   * @param h height of search area
   * @param hasComponent an optional component to require
   * @returns {Array} of entities
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
   * @param canvas The canvas to base the engine off of
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
