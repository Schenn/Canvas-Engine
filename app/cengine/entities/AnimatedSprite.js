(function() {
  var EM = CanvasEngine.EntityManager;
  var utilities = CanvasEngine.utilities;

  // Entity is a sprite and has all of the sprite components and methods
  EM.setMake("ASPRITE", function (entity, params) {
    var animations={}, currentAnimation = "default";

    entity.setCurrentAnimation = function(animation){
      if(utilities.exists(animations[animation])){
        entity.messageToSubEntity(currentAnimation, "disable");
        currentAnimation = animation;
        entity.messageToSubEntity(currentAnimation, "enable");
      }
    };

    entity.addAnimation = function(name, animation){
      var animator =EM.create("Animator",
        $.extend({}, {
          name: name,
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