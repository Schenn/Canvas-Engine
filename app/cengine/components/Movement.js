(function(){
  var props = CanvasEngine.EntityManager.properties;
  var utils = CanvasEngine.utilities;

  var movement = function(params, entity){
    var x = params.x,
      y = params.y,
      xSpeed = params.xSpeed,
      ySpeed = params.ySpeed;

    this.move = function(delta){
      if(delta > 0){
        x += xSpeed * delta / 1000;
        y += ySpeed * delta / 1000;
      } else {
        x += xSpeed;
        y += ySpeed;
      }
    };

    this.setSpeed = function(speeds){
      xSpeed = utils.exists(speeds.xSpeed)? speeds.xSpeed : xSpeed;
      ySpeed = utils.exists(speeds.ySpeed)? speeds.ySpeed : ySpeed;
    };

    this.setOrigin = function(coords){
      x = coords.x;
      y = coords.y;
    };

    this.getEntity = function(){
      return entity;
    };

    this.asObject = function(){
      return $.extend({}, {x:x, y:y,xSpeed: xSpeed, ySpeed: ySpeed});
    };
  };

  CanvasEngine.EntityManager.addComponent("Movement", function(params, entity){
    return new movement(params, entity);
  }, true);
})();
