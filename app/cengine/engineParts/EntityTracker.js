/**
 * @author Steven Chennault <schenn@gmail.com>
 */

import * as utilities from "engineParts/utilities.js";

import {Entity} from "entities/Entity.js";

const privateProperties = new WeakMap();
/**
 * The EntityTracker manages the information about all current living Entities in our engine.
 *
 * @class
 * @memberOf CanvasEngine
 * @inner
 */
export class EntityTracker {

  get maxZ(){
    return privateProperties[this].maxZ;
  }

  get entityCount(){
    return privateProperties[this].entities.size();
  }

  get zIndexes(){
    return privateProperties[this].entitiesByZ.keys();
  }

  constructor(){
    privateProperties[this] = {};
    privateProperties[this].entities = new WeakMap();
    privateProperties[this].entitiesByZ = [];
    privateProperties[this].zExcludedFromInteractions = [];
    privateProperties[this].maxZ = 0;
  }

  /**
   * Add "Entities" to the Entity Tracker
   *
   * @param {Entity[]} entities
   */
  addEntities(entities){
    for(let entity of entities){
      if(entity instanceof Entity) {
        privateProperties[this].entities.set(entity.name, entity);
        if(!utilities.exists(privateProperties[this].entitiesByZ[entity.z_index])){
          privateProperties[this].entitiesByZ[privateProperties[this].entities.get(entity.name).z_index] = new WeakSet();
          if(privateProperties[this].entities.get(entity.name).z_index > privateProperties[this].maxZ){
            privateProperties[this].maxZ = privateProperties[this].entities.get(entity.name).z_index;
          }
        }
        privateProperties[this].entitiesByZ[entity.z_index].add(entity.name);
      }
    }
  }

  /**
   * Exclude (or stop excluding if you pass true as second argument) a set of z indexes from interactions
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
    var ents = [];
    names.forEach((name, index)=>{
      ents[index] = privateProperties[this].entities[name];
    });

    return ents;
  }

  /**
   * Clear all the Entities from the world
   */
  clearEntities(){
    // Starting with the last z index, work backwards, clearing each collection
    var zs = privateProperties[this].entitiesByZ.keys();

    for(var i = zs.length-1; i>=0; i--){
      this.removeEntities(privateProperties[this].entitiesByZ[zs[i]]);
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
    let entity= privateProperties[this].entities.get(name);

    entity.messageToComponent("Renderer", "hide", ()=>{
      privateProperties[this].entities.delete(name);
      if(privateProperties[this].entitiesByZ[entity.z_index].size === 0){
        privateProperties[this].entitiesByZ.splice(entity.z_index,1);
        privateProperties[this].entitiesByZ = utilities.cleanArray(privateProperties[this].entitiesByZ);
        let zs = privateProperties[this].entitiesByZ.keys();
        privateProperties[this].maxZ = zs[zs.length -1];

      }

    });
  }


  /**
   * Get all the entities on a given z-index
   *
   * @param {number} z the Z index
   * @returns {Entity[]} Array of Entities
   */
  getEntitiesByZ(z){
    var ents = [];
    for(let name of privateProperties[this].entitiesByZ[z]){
      ents.push(privateProperties[this].entities.get(name));
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
        for(let entity in this.getEntitiesByZ(z)) {
          let containsPixel = false;
          containsPixel = entity.getFromComponent("Renderer", "containsPixel", p);

          if (!containsPixel) {
            if (w > 1) {
              let tempCoord = Object.assign({}, p);
              for (let width = 1; width <= w; width++) {
                tempCoord.x++;
                containsPixel = entity.getFromComponent("Renderer", "containsPixel", tempCoord);
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
                containsPixel = entity.getFromComponent("Renderer", "containsPixel", tempCoord);
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