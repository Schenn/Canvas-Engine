/**
 * Created by schenn on 4/17/16.
 */
(function(){

  var EntityTracker = function(){
    var entities = {};
    var entitiesByZ = [];
    var zExcludedFromInteractions = [];
    var maxZ = 0;

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

    this.excludeZ = function(indexes, invert){
      indexes.forEach(function(index){
        if(!invert){
          zExcludedFromInteractions[index] = true;
        } else {
          delete zExcludedFromInteractions[index];
        }
      });
    };

    this.getEntities = function(names){
      var ents = [];
      $.each(names, function(index, name){
        // get the entity with the current name and add it to the list.
        ents[index] = entities[name];
      });

      return ents;
    };

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

    this.clearEntities = function(){
      // Starting with the last z index, work backwards, clearing each collection
      var zs = Object.keys(entitiesByZ);

      for(var i = zs.length-1; i>=0; i--){
        this.removeEntities(entitiesByZ[zs[i]]);
      }
    };

    this.getEntitiesByZ = function(z){
      var ents = [];
      $.each(entitiesByZ[z], function(index, name){
        ents.push(entities[name]);
      });
      return ents;
    };

    this.positionsAtPixel = function(p, zIndexes){
      var positions = [];
      console.log(p);
      console.log(zIndexes);
      for(var z =0; z< zIndexes.length; z++){
        if (!(zExcludedFromInteractions[z])) {
          var ents = this.getEntitiesByZ(z);
          for (var i = 0; i < ents.length; i++) {
            if(ents.getFromComponent("Renderer", "containsPixel",{x: p.x, y: p.y})){
              positions.push(ents[i]);
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

    this.maxZ = function(){
      return maxZ;
    };

    this.entityCount = function(){
      return Object.keys(entities).length;
    };
  };

  CanvasEngine.EntityTracker = new EntityTracker();
})();