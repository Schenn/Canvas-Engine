/**
 * @author Steven Chennault <schenn@gmail.com>
 */
/**
 * @typedef {object} LocalParams~AnimatedSpriteParams
 * @property {object.<string, LocalParams~AnimatorParams>} animations
 */
(function(CanvasEngine) {
  var EM = CanvasEngine.EntityManager;
  var utilities = CanvasEngine.utilities;

  /**
   * Tell the EntityManager how to make an AnimatedSprite from a SPRITE entity
   */
  EM.setMake("ASPRITE",
    /**
     * @param {CanvasEngine.Entities.Sprite} entity
     * @param {LocalParams~AnimatedSpriteParams} params
     * @returns {CanvasEngine.Entities.AnimatedSprite}
     */
  function (entity, params) {
    var animations={}, currentAnimation = "default";

      /**
       * @class
       * @memberOf CanvasEngine.Entities
       * @alias AnimatedSprite
       * @augments CanvasEngine.Entities.Sprite
       */
      var AnimatedSprite = $.extend(true, {}, {
        /**
         * @borrows CanvasEngine.Entities.Animator as AnimatedSprite#subEntities~AnimationName
         */

        /**
         * @memberof AnimatedSprite
         * @param {string} animation
         */
        setCurrentAnimation : function(animation){
          if(utilities.exists(animations[animation])){
            this.messageToSubEntity(currentAnimation, "disable");
            currentAnimation = animation;
            this.messageToSubEntity(currentAnimation, "enable");
          }
        },
        /**
         * @memberof AnimatedSprite
         * @param {string} name
         * @param {LocalParams~AnimatorParams} animation
         */
        addAnimation : function(name, animation){
          var animator =EM.create("Animator",
            $.extend({}, {
                name: name,
                // When the sprite's frame has changed, tell the entity to set the sprite to the next frame.
                onFrameChange: function(nextFrame){
                  if(currentAnimation === name){
                    AnimatedSprite.setSprite(nextFrame);
                  }
                }
              },
              animation));
          if(name !== "default") {
            animator.disable();
          }
          animations[name] = true;

          this.attachSubEntity(animator);
        }
      }, entity);


    $.each(params.animations, function(name, animation){
      AnimatedSprite.addAnimation(name, animation);
    });

    return AnimatedSprite;
  }, "SPRITE");


})(window.CanvasEngine);