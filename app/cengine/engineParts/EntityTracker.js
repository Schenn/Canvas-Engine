/**
 * @author Steven Chennault <schenn@gmail.com>
 */
(function(CanvasEngine){

  /**
   * The EntityTracker manages the information about all current living Entities in our engine.
   *
   * @class
   * @memberOf CanvasEngine
   * @inner
   * @static
   */
  var EntityTracker = function(){
    var entities = {};
    var entitiesByZ = [];
    var zExcludedFromInteractions = [];
    var maxZ = 0;

    /**
     * Add an array of entities to the entity tracker
     *
     * @param {Array.<Array.<CanvasEngine.Entity>>} ents
     * @todo Thats a stupid sorting order, especially since Entities have z_index information.
     *
     **/
    this.addEntities = function(ents){
      $.each(ents, function(z, z_entities){
        $.each(z_entities, function(index, entity){
          entities[entity.name]=entity;
          if(!CanvasEngine.utilities.exists(entitiesByZ[z])){
            entitiesByZ[z] = [];
            maxZ = z;
          }
          entitiesByZ[z].push(entity.name);
        });
      });
    };

    /**
     * Prevent a z-index from interacting with things.
     *
     * Use this to make a z-index not search its objects for click and collision interactions
     * Use to increase performance
     *
     * @param {Array.<number>} indexes The z-indexes to mark
     * @param {boolean} invert Remove the mark from a z index if true
     */
    this.excludeZ = function(indexes, invert){
      indexes.forEach(function(index){
        if(!invert){
          zExcludedFromInteractions[index] = true;
        } else {
          delete zExcludedFromInteractions[index];
        }
      });
    };

    /**
     * Get the entities with the given names
     *
     * @param {Array<string>} names array of names
     * @returns {CanvasEngine.Entities.Entity[]}
     */
    this.getEntities = function(names){
      var ents = [];
      $.each(names, function(index, name){
        // get the entity with the current name and add it to the list.
        ents[index] = entities[name];
      });

      return ents;
    };

    /**
     * Remove a collection of entities from the Tracker.
     *
     * @param {Array.<string>} names array of names
     */
    this.removeEntities = function(names){
      $.each(names, function(index, name){
        CanvasEngine.Screen.clear(entities[name]);
        var z = entities[name].z_index;
        var deleteIndex = -1;

        // remove entity from the z index
        entitiesByZ[z].forEach(function(value, index){
          if(value === name){
            deleteIndex = index;
          }
        });
        if(deleteIndex >= 0){
          delete entitiesByZ[z][deleteIndex];
          // Remove the empty index
          entitiesByZ[z] = CanvasEngine.utilities.cleanArray(entitiesByZ[z]);
        }


        // If no more entities occupy that z layer, tell the screen to remove the dispay for that z layer.
        if(entitiesByZ[z].length === 0){
          CanvasEngine.Screen.removeZLayer(z);
          delete entitiesByZ[z];
          entitiesByZ = CanvasEngine.utilities.cleanArray(entitiesByZ);

          maxZ = Object.keys(entitiesByZ)[-1];
        }
        // remove entity from the entity list
        delete entities[name];

      });
    };

    /**
     * Clear all the active entities
     */
    this.clearEntities = function(){
      // Starting with the last z index, work backwards, clearing each collection
      var zs = Object.keys(entitiesByZ);

      for(var i = zs.length-1; i>=0; i--){
        this.removeEntities(entitiesByZ[zs[i]]);
      }
    };

    /**
     * Get all the entities on a given z-index
     *
     * @param {number} z the Z index
     * @returns {Array.<string>} Array of entity names
     */
    this.getEntitiesByZ = function(z){
      var ents = [];
      $.each(entitiesByZ[z], function(index, name){
        ents.push(entities[name]);
      });
      return ents;
    };

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
    this.positionsAtPixel = function(p,w,h, zIndexes, hasComponent){
      var positions = [];
      for(var i =0; i< zIndexes.length; i++){
        var z = zIndexes[i];
        if (!(zExcludedFromInteractions[z])) {
          var ents = this.getEntitiesByZ(z);
          for (var j = 0; j < ents.length; j++) {
            if(ents[j].getFromComponent("Renderer", "containsPixel",p)){
              if (!CanvasEngine.utilities.exists(hasComponent)){
                positions.push(ents[j]);
              }
              else if(CanvasEngine.utilities.exists(hasComponent) && ents[j].hasComponent(hasComponent)){
                positions.push(ents[j]);
              }


            }
          }
        }
      }

      return (positions);
    };

    /**
     * The current maximum z index
     * @returns {number}
     */
    this.maxZ = function(){
      return maxZ;
    };

    /**
     * The number of entities being managed by the game.
     *
     * @returns {number}
     */
    this.entityCount = function(){
      return Object.keys(entities).length;
    };
  };

  // Attach the EntityTracker to the CanvasEngine.
  CanvasEngine.EntityTracker = new EntityTracker();
})(window.CanvasEngine);