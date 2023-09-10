/**
 * @author Steven Chennault <schenn@gmail.com>
 */

import * as utilities from "./utilities.js";

import {Entity} from "../entities/Entity.js";

const privateProperties = new WeakMap();
/**
 * The EntityTracker manages the information about all current Entity Instances in our engine.
 *
 * @class
 * @memberOf CanvasEngine
 * @inner
 */
export class EntityTracker {

  /**
   * The current highest z index in use.
   * @returns {Number}
   */
  get maxZ(){
    let zs = Object.keys(privateProperties[this].entitiesByZ);
    return zs[zs.length-1];
  }

  /**
   * A count of all current entity instances.
   *
   * @returns {number}
   */
  get entityCount(){
    let count = 0;

    for(let z of this.zIndexes){
      count += (utilities.exists(privateProperties[this].entitiesByZ[z])) ? privateProperties[this].entitiesByZ[z].size : 0;
    }
    return count;
  }

  /**
   * A collection of the current z indexes in use.
   *
   * @returns {Iterator.<number>}
   */
  get zIndexes(){
    return privateProperties[this].entitiesByZ.keys();
  }

  constructor(){
    privateProperties[this] = {};
    privateProperties[this].entities = new WeakMap();
    privateProperties[this].entitiesByZ = [];
    privateProperties[this].zExcludedFromInteractions = [];
    privateProperties[this].maxZ = 0;

    privateProperties[this].entityProxies = {};
  }

  /**
   * Add "Entities" to the Entity Tracker
   *
   * @param {Entity[]} entities
   */
  addEntities(entities){
    let retMethod = (entity)=>{return new Proxy(entity, {});};
    for(let entity of entities){
      if(entity instanceof Entity) {
        privateProperties[this].entities.set(entity, entity.name);
        // If we don't already have a collection of entity references at this z index, start one.
        if(!utilities.exists(privateProperties[this].entitiesByZ[entity.z_index])){
          privateProperties[this].entitiesByZ[entity.z_index] = new Set();
        }
        privateProperties[this].entitiesByZ[entity.z_index].add(entity);
        privateProperties[this].entityProxies[entity.name] = retMethod(entity);
      } else {
        throw "Entity expected but " + entity +" encountered.";
      }
    }
  }

  /**
   * Exclude (or stop excluding if you pass true as second argument)
   *  a set of z indexes from interactions
   *
   * @param {number[]} indices
   * @param {boolean} invert
   */
  excludeZ(indices, invert){
    for(let index of indices){
      if(!invert){
        privateProperties[this].zExcludedFromInteractions[index] = true;
      } else {
        delete privateProperties[this].zExcludedFromInteractions[index];
      }
    }

  }

  /**
   * Get the entities with the given names
   *
   * @param {string[]} names array of names
   * @returns {Entity[]}
   */
  getEntities(names){
    let ents = [];
    let ep = privateProperties[this].entityProxies;
    names.forEach((name, index)=>{
      if(ep.hasOwnProperty(name)){
        ents[index] = ep[name];
      }
    });

    return ents;
  }

  /**
   * Clear all the Entities from the world
   */
  clearEntities(){
    for(let i =privateProperties[this].entitiesByZ.length-1; i> -1; i--){
      for(let entity of privateProperties[this].entitiesByZ[i]){
        this.removeEntity(entity.name);
      }
    }
  }

  /**
   * Remove a collection of entities from the Tracker.
   *
   * @param {string[]} names array of names
   */
  removeEntities(names){

    for(let name of names){
      // Clear the entity from the Screen.
      this.removeEntity(name);
    }
  }

  /**
   * Remove Entity from collections
   *
   * @param {string} name
   */
  removeEntity(name){

    let entity = null;
    for(let z of privateProperties[this].entitiesByZ){
      for(let ent of z){
        if(ent.name === name) {
          entity = ent;
        }
      }
    }
    let clearEntity = ()=>{
      privateProperties[this].entitiesByZ[entity.z_index].delete(entity);
      if(privateProperties[this].entitiesByZ[entity.z_index].size === 0){
        privateProperties[this].entitiesByZ.splice(entity.z_index,1);
        privateProperties[this].entitiesByZ = utilities.cleanArray(privateProperties[this].entitiesByZ);
      }
      privateProperties[this].entities.delete(entity);
      delete privateProperties[this].entityProxies[name];
    };
    if(entity.hasComponent("Renderer")){
      entity.askComponent("Renderer", "hide", clearEntity);
    } else if(entity.hasComponent("onDelete")){
      entity.askComponent("onDelete", "onDelete", {doLast: clearEntity});
    } else {
      clearEntity();
    }

    return true;
  }


  /**
   * Get all the entities on a given z-index
   *
   * @param {number} z the Z index
   * @returns {Entity[]} Array of Entities
   */
  getEntitiesByZ(z){
    let ents = [];
    if(utilities.exists(privateProperties[this].entitiesByZ[z])){
      for(let name of privateProperties[this].entitiesByZ[z]){
        ents.push(privateProperties[this].entities.get(name));
      }
    }

    return ents;
  }

  /**
   * Get the entities at a given pixel
   *
   * @param {coord} p The pixel coordinate
   * @param {number} w The search area width
   * @param {number} h The search area height
   * @param {Array.<number>} zIndexes The indexes to search
   * @param {string} [hasComponent] An optional Component to restrict your positions by.
   *
   * @returns {Array} The collection of found entities.
   */
  positionsAtPixel(p, w, h, zIndexes, hasComponent){
    let positions = [];
    for(let i =0; i< zIndexes.length; i++){
      let z = zIndexes[i];
      if (!(privateProperties[this].zExcludedFromInteractions[z])) {
        for(let entity of this.getEntities(this.getEntitiesByZ(z))) {
          let containsPixel = false;
          containsPixel = entity.askComponent("Renderer", "containsPixel", p);
          // If we didn't find it, but we're searching an area larger than one, expand the search radius.
          if (!containsPixel) {
            if (w > 1) {
              let tempCoord = Object.assign({}, p);
              for (let width = 1; width <= w; width++) {
                tempCoord.x++;
                containsPixel = entity.askComponent("Renderer", "containsPixel", tempCoord);
                if (containsPixel) {
                  break;
                }
              }
            }
          }

          if (!containsPixel) {
            if (h > 1) {
              let tempCoord = Object.assign({}, p);
              for (let height = 1; height <= h; height++) {
                tempCoord.y++;
                containsPixel = entity.askComponent("Renderer", "containsPixel", tempCoord);
                if (containsPixel) {
                  break;
                }
              }
            }
          }
          if (!utilities.exists(hasComponent) && containsPixel) {
            positions.push(entity);
          } else if (entity.hasComponent(hasComponent) && containsPixel) {
            positions.push(entity);
          }
        }
      }
    }
    return (positions);
  }
}