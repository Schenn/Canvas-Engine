(function() {
  var EM = CanvasEngine.EntityManager;
  var utilities = CanvasEngine.utilities;

  /**
   * Tell the EntityManager how to make an ASPRITE from a SPRITE entity
   */
  EM.setMake("ASPRITE", function (entity, params) {
    var animations={}, currentAnimation = "default";

    /**
     * Add a method for moving through different types of animations.
     * @param animation
     */
    entity.setCurrentAnimation = function(animation){
      if(utilities.exists(animations[animation])){
        entity.messageToSubEntity(currentAnimation, "disable");
        currentAnimation = animation;
        entity.messageToSubEntity(currentAnimation, "enable");
      }
    };

    /**
     * Add an animator to the entity.
     *
     * @param name
     * @param animation
     */
    entity.addAnimation = function(name, animation){
      var animator =EM.create("Animator",
        $.extend({}, {
          name: name,
          // When the sprite's frame has changed, tell the entity to set the sprite to the next frame.
          onFrameChange: function(nextFrame){
            if(currentAnimation === name){
              entity.setSprite(nextFrame);
            }
          }
        },
        animation));
      if(name !== "default") {
        animator.disable();
      }
      animations[name] = true;

      entity.attachSubEntity(animator);
    };

    $.each(params.animations, function(name, animation){
      entity.addAnimation(name, animation);
    });

    return entity;
  }, "SPRITE");


})();