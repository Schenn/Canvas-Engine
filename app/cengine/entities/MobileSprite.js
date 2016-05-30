/**
 * @author Steven Chennault <schenn@gmail.com>
 */
/**
 * @typedef {object} LocalParams~MobileSpriteParams
 * @property {function} [onMovement]
 * @property {function} [onDirectionChange]
 * @property {LocalParams~TimerParams} movementTimer
 */
(function(CanvasEngine) {
  var EM = CanvasEngine.EntityManager;
  var utilities = CanvasEngine.utilities;

  /**
   * Tell the EntityManager how to make a mobile sprite from an animated sprite.
   */
  EM.setMake("MSPRITE",
    /**
     *
     * @param {CanvasEngine.Entities.AnimatedSprite} entity
     * @param {LocalParams~MobileSpriteParams} params
     * @returns {CanvasEngine.Entities.MobileSprite}
     */
    function (entity, params) {

      /**
       * @class
       * @memberOf CanvasEngine.Entities
       * @augments CanvasEngine.Entities.AnimatedSprite
       */
      var MobileSprite = $.extend(true, {}, {
        onMovement: (utilities.isFunction(params.onMovement)) ? params.onMovement.bind(this) : null,
        onDirectionChange: (utilities.isFunction(params.onDirectionChange)) ?
          params.onDirectionChange.bind(this) :
          function(newDirection){
            this.setCurrentAnimation(newDirection.direction);
          },
        updateRenderPosition: function(axis, val){
          var data = {};
          data[axis] = val;
          this.messageToComponent("Renderer", "setPosition", data);
          if(utilities.isFunction(this.onMovement)){
            this.onMovement.call(this, data);
          }
        }
      }, entity);

      /**
       * Attach a movement component to the entity. When it moves in either direction, tell it to update the Renderer.
       */
      EM.attachComponent(MobileSprite, "Movement", $.extend({},
        {
          onDirectionChange:function(direction){
            MobileSprite.onDirectionChange(direction);
          }, onMoveX: function(val){
            MobileSprite.updateRenderPosition("x", val);
          }, onMoveY: function(val){
            MobileSprite.updateRenderPosition("y", val);
          }
        },
        params)
      );

      /**
       * Attach a second timer component to the entity which we use to control our movement over time.
       */
      EM.attachComponent(MobileSprite,
        $.extend({}, {
            Timer:{
              // The entity already has a timer component added for animating sprites.
              //  We need to add a second timer for managing movement.
              "movementTimer": $.extend({},{
                onUpdate: function(delta){
                  MobileSprite.messageToComponent("Movement", "move", delta);
                }

              },params.movementTimer)
            }
          }
        ));

      return MobileSprite;
  }, "ASPRITE");

})(window.CanvasEngine);