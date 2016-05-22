(function() {
  var EM = CanvasEngine.EntityManager;
  var utilities = CanvasEngine.utilities;

  /**
   * Tell the EntityManager how to make a mobile sprite from an animated sprite.
   */
  EM.setMake("MSPRITE", function (entity, params) {

    if(utilities.isFunction(params.onMovement)){
      entity.onMovement = params.onMovement.bind(entity);
    }

    // When the movement component updates its positions, tell the renderer to match those positions
    function updateRendererOnMovement(dir, val){
      var data = {};
      data[dir] = val;
      entity.messageToComponent("Renderer", "setPosition", data);
      if(utilities.isFunction(entity.onMovement)){
        entity.onMovement.call(entity, data);
      }
    }

    /**
     * Attach a movement component to the entity. When it moves in either direction, tell it to update the Renderer.
     */
    EM.attachComponent(entity, "Movement", $.extend({}, {onDirectionChange:function(direction){
      entity.onDirectionChange(direction);
    }, onMoveX: function(val){
      updateRendererOnMovement("x", val);
    }, onMoveY: function(val){
      updateRendererOnMovement("y", val);
    }
    },params));

    /**
     * When the movement has changed direction, tell the entity to set the current animation to the current direction.
     *    This function can be overridden.
     */
    entity.onDirectionChange = utilities.isFunction(params.onDirectionChange) ?
      params.onDirectionChange :
      function(newDirection){
        entity.setCurrentAnimation(newDirection.direction);
      };


    /**
     * Attach a second timer component to the entity which we use to control our movement over time.
     */
    EM.attachComponent(entity,
      $.extend({}, {
          Timer:{
            // The entity already has a timer component added for animating sprites.
            //  We need to add a second timer for managing movement.
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

