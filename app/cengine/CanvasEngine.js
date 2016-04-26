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
    this.pause();
  }
};

CanvasEngine.Loop = function(){
  if(this.paused === false){
    requestAnimationFrame(function(){
      CanvasEngine.Screen.drawScreen();
      CanvasEngine.Loop();
    });
  }
};

CanvasEngine.drawZ = function(z, ctx){
  $.each(this.EntityTracker.getEntitiesByZ(z), function(index, entity){
    entity.broadcastToComponents("update");
    entity.messageToComponent("Renderer", "clear", ctx);
    entity.messageToComponent("Renderer", "render", ctx);
    entity.broadcastToComponents("postRender");
  });
};

CanvasEngine.checkClickMap = function(coords){
  var ents = CanvasEngine.positionsAtPixel(coords, 1, 1);
  $.each(ents, function(index, ent){
    ent.broadcastToComponents("Click", coords);
  });
};

CanvasEngine.pause = function(){
  this.paused = !this.paused;
  if(!this.paused){ this.Loop();}
};

CanvasEngine.positionsAtPixel = function(p, w, h){
  if (CanvasEngine.Screen.atPixel(p.x, p.y, h, w, true)) {
    return CanvasEngine.EntityTracker.positionsAtPixel(p,w,h);
  }
};

CanvasEngine.setup = function(canvas, init, start){
  CanvasEngine.Screen.setScreen(canvas);
  this.addMap(init, start);
};
