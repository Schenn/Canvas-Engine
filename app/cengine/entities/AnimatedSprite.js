(function() {
  var EM = CanvasEngine.EntityManager;
  var utilities = CanvasEngine.utilities;

  // Entity is a sprite and has all of the sprite components and methods
  EM.setMake("ASPRITE", function (entity, params) {
    console.log(params);
    var animator = EM.create("Animator", $.extend({}, {
      onFrameChange: function(currentFrame){
        entity.setSprite(currentFrame);
      }
    }, params));

    entity.attachSubEntity(animator);
    return entity;
  }, "SPRITE");


})();