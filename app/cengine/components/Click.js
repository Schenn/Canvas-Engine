(function(){

  var click = function(params, entity){
    var onClick = [];

    if(CanvasEngine.utilities.isFunction(params.onClick)){
      onClick.push(params.onClick);
    } else if(Array.isArray(params.onClick)){
      onClick = onClick.concat(params.onClick);
    }

    this.getEntity = function(){
      return entity;
    };

    this.Click = function(args){
      $.each(onClick, function(index, callback){
        callback.call(entity, args);
      });
    };
  };

  CanvasEngine.EntityManager.addComponent("Click", function(params, entity){
    return new click(params, entity);
  }, true);
})();