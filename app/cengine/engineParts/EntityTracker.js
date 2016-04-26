/**
 * Created by schenn on 4/17/16.
 */
(function(){

  var EntityTracker = function(){
    var entities = {};
    var entitiesByZ = [];
    var zExcludedFromInteractions = [];

    this.addEntities = function(ents){
      $.each(ents, function(z, z_entities){
        $.each(z_entities, function(index, entity){
          entities[entity.name]=entity;
          if(!CanvasEngine.utilities.exists(entitiesByZ[z])){
            entitiesByZ[z] = [];
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
        // remove each entity from the entity list
        var z = entities[name].z_index;
        var deleteIndex;
        // remove each entity from the z index
        entitiesByZ[z].forEach(function(index, value){
          if(value === name){
            deleteIndex = index;
          }
        });

        if(CanvasEngine.utilities.exists(deleteIndex)){
          delete entitiesByZ[z][deleteIndex];
        }

        $.cleanArray(entitiesByZ[z]);
        // tell screen to remove the z index if its empty
        if(entitiesByZ[z].length === 0){
          CanvasEngine.Screen.removeZLayer(z);
        }
      });

    };

    this.clearEntities = function(){
      // Starting with the last z index, work backwards, clearing each collection
      var zs = Object.keys(entitiesByZ);

      for(var i = zs.length; i>0; i--){
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

    this.entitiesAtPixel = function(p){
      var positions = [];
      for (var z = entitiesByZ.length - 1; z >= 0; z--) {
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

  };

  CanvasEngine.EntityTracker = new EntityTracker();
})();