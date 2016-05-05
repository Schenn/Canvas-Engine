(function() {
  var EM = CanvasEngine.EntityManager;
  var utilities = CanvasEngine.utilities;

  // Needs a method to determine which animation to use
  EM.setMake("MSPRITE", function (entity, params) {

    function updateRendererOnMovement(dir, val){
      entity.messageToComponent("Renderer", "setPosition", {dir: dir, val: val});
    }

    // A mob needs to have a movement component
    // The movement component needs to help figure out which animation to run
    EM.attachComponent(entity, "Movement", $.extend({}, {onDirectionChange:function(direction){
      entity.onDirectionChange(direction);
    }, onMoveX: function(val){
      updateRendererOnMovement("x", val);
    }, onMoveY: function(val){
      updateRendererOnMovement("y", val);
    }
    },params));

    entity.onDirectionChange = utilities.isFunction(params.onDirectionChange) ?
      params.onDirectionChange :
      function(newDirection){
        entity.setCurrentAnimation(newDirection.direction);
      };


    EM.attachComponent(entity,
      $.extend({}, {
          Timer:{
            // A mob needs to have a timer for animating its movement
            "movementTimer": $.extend({},{
              onUpdate: function(delta){
                entity.messageToComponent("Movement", "move", delta);
              }

            },params.movementTimer)
          }
        }
      ));

    return entity;
  }, "ASPRITE");

})();

