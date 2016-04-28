var CanvasEngine = {
  paused: true
};
CanvasEngine.addMap = function(screenMap, start){
  // Convert to entity Array
  var entities = this.EntityManager.fromMap(screenMap);

  $.each(entities, function(z){
    CanvasEngine.Screen.addZLayer(z);
  });

  this.EntityTracker.addEntities(entities);

  if(start){
    this.paused = false;
    this.Loop();
  }
};

CanvasEngine.Loop = function(){
  requestAnimationFrame(function(){
    CanvasEngine.Screen.drawScreen();
    CanvasEngine.Loop();
  });
};

CanvasEngine.drawZ = function(z, ctx){
  if(!this.paused && CanvasEngine.EntityTracker.entityCount() > 0) {
    $.each(this.EntityTracker.getEntitiesByZ(z), function (index, entity) {
      if(CanvasEngine.utilities.exists(entity)){
        entity.broadcastToComponents("update");
        if(entity.getFromComponent("Renderer", "isDirty")){
          entity.messageToComponent("Renderer", "clear", ctx);
          entity.messageToComponent("Renderer", "render", ctx);
        }
        entity.broadcastToComponents("postRender");
      }
    });
  }
};

CanvasEngine.clearEntities = function(){
  this.paused = true;
  CanvasEngine.EntityTracker.clearEntities();
  this.paused = false;
};

CanvasEngine.checkClickMap = function(coords){
  var ents = CanvasEngine.positionsAtPixel(coords, 1, 1);
  $.each(ents, function(index, ent){
    console.log(ent);
    ent.broadcastToComponents("Click", coords);
  });
};

CanvasEngine.pause = function(){
  this.paused = !this.paused;
};

CanvasEngine.positionsAtPixel = function(p, w, h){
  var zPixels =CanvasEngine.Screen.atPixel(p.x, p.y, h, w, true);
  if (zPixels.length > 0) {
    return CanvasEngine.EntityTracker.positionsAtPixel(p,w,h, Object.keys(zPixels));
  } else {
    return [];
  }
};

CanvasEngine.setup = function(canvas, init, start){
  CanvasEngine.Screen.setScreen(canvas);
  this.addMap(init, start);
};
