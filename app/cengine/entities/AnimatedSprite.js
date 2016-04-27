(function() {
  var EM = CanvasEngine.EntityManager;
  var utilities = CanvasEngine.utilities;

  // Entity is a sprite and has all of the sprite components and methods
  EM.setMake("ASPRITE", function (entity, params) {
    var animator = EM.create("Animator", $.extend({}, {
      onFrameChange: function(currentFrame){
        entity.setSprite(frames[currentFrame]);
      }
    }, params));

    return entity;
  }, "SPRITE");


})();