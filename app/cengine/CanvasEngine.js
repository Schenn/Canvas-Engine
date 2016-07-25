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

import * as utilities from 'engineParts/utilities.js';
import {EntityManager} from "engineParts/EntityManager.js";
import {EntityTracker} from "engineParts/EntityTracker.js";
import {properties} from "engineParts/propertyDefinitions.js";
import {ResourceManager} from "engineParts/ResourceManager.js";
import {Screen} from "engineParts/Screen.js";
const privateProperties = new WeakMap();


class CanvasEngine{

  constructor(){
    privateProperties[this] = {};
    privateProperties[this].paused = true;

    properties.observe("ResourceManager", new ResourceManager(), true, this);
    properties.observe("EntityTracker", new EntityTracker(), true, this);

    properties.observe("EntityManager", new EntityManager(this.ResourceManager, this.EntityTracker), true, this);
    properties.observe("Screen", new Screen, true, this);

  }

  /**
   * Add a collection of entities from a json array.
   * @memberof CanvasEngine
   * @param {object[]} screenMap initialization data for the entities to add.
   * @param {boolean} start Start animating after adding entities.
   */
  addMap(screenMap, start){
    // Convert to entity Array

    var entities = this.EntityManager.fromMap(screenMap);

    this.addEntities(entities, start);
  }

  /**
   * Add an array of Entities
   *    (Entity being a class derived from the entity base class)
   *
   * @param {Entity[]} entities
   * @param {boolean} start
   */
  addEntities(entities, start){
    this.EntityTracker.addEntities(entities);
    this.Screen.addZLayers(this.EntityTracker.zIndexes);

    if(start){
      privateProperties[this].paused = false;
    }
  }

  /**
   * Clear all entities from the system
   * @memberof CanvasEngine
   */
  clearEntities(){
    //noinspection JSUnusedAssignment
    paused = true;
    this.EntityTracker.clearEntities();
    paused = false;
  }

  render(){
    let zs = this.EntityTracker.zIndexes;

    for(let z = zs; z >0; z--){
      this.drawZ(z);
    }
  }

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
   */
  drawZ(z){
    let ctx = this.Screen.getScreenContext(z);
    if(!privateProperties[this].paused && this.EntityTracker.entityCount() > 0) {
      setTimeout(()=>{
        for(let entity of this.EntityTracker.getEntitiesByZ(z)){
          entity.broadcastToComponents("update");
          if(entity.getFromComponent("Renderer", "isDirty")){
            entity.messageToComponent("Renderer", "clear", ctx);
            entity.messageToComponent("Renderer", "render", ctx);
          }
          entity.broadcastToComponents("postRender");
        }
      },1);
    }
  }

  Loop(){
    requestAnimationFrame(()=>{
      this.render();
      this.Loop();

    });
  }

  onMouse(coords, interaction, previous){
    setTimeout(()=>{
      let ents = this.positionsAtPixel(coords, 1, 1, "Mouse");
      for(let ent of ents){
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
      }

      if(utilities.exists(previous) && interaction === "MouseMove"){
        let last = this.positionsAtPixel(previous, 1, 1, "Mouse");
        // for each entity in last, if they are not in ents, then trigger onMouseOut

        for(let lastEnt of last){
          if(!ents.includes(lastEnt)){
            lastEnt.broadcastToComponents("onMouseOut");
          }
        }
      }
    },1);
  }

  /**
   * Pause the game
   * @memberof CanvasEngine
   *
   * @param {boolean} forceIt
   */
  pause(forceIt){
    paused = (CanvasEngine.utilities.exists(forceIt)) ? forceIt : !paused;

    if(!paused){
      this.Loop();
    }
  }

  /**
   * Pause the engine on a right click.
   * @memberof CanvasEngine
   *
   */
  pauseOnRightClick(){
    this.pause(true);
  }

  /**
   * Unpause the engine
   * @memberof CanvasEngine
   */
  unPause(){
    $(document).off(".unpause");
    $(window).off(".unpause");

    this.pause(false);
  }

  /**
   * Is the engine currently paused?
   * @memberof CanvasEngine
   * @returns {boolean}
   */
  isPaused(){
    return paused;
  }

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
  positionsAtPixel(p, w, h, hasComponent){
    let zPixels =this.Screen.atPixel(p.x, p.y, h, w, true);
    if (zPixels.length > 0) {
      return this.EntityTracker.positionsAtPixel(p,w,h, Object.keys(zPixels), hasComponent);
    } else {
      return [];
    }
  }

  /**
   * Setup the canvas engine.
   *
   * @method
   * @param {jQuery | HTMLElement} canvas The canvas to base the engine off of
   *
   */
  setup(canvas){
    this.Screen.setScreen(canvas);
    $(document).on("contextmenu", ()=>{
      this.pauseOnRightClick();

      $(document).on("keypress.unpause", (e)=>{
        if(e.keyCode === 27){
          this.unPause();
        }
      });
      $(document).on("click.unpause", this.unPause);
      $(window).on("blur.unpause", this.unPause);

    });

  }

}

window.CanvasEngine = new CanvasEngine();