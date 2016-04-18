/**
 * Created by schenn on 3/30/16.
 */
var EventManager = function(){
  // On Entity has changed events, mark the entity for re-drawing

  window.addEventListener("EntityPropertyChanged", function(e){
    if(e.detail.name) {
      window.CanvasEngine.getMetadata([e.detail.name]).isDrawn = false;
    }

  });

  // On PreDraw event, run Entity preDraw

  // On PostDraw event, run Entity postDraw


  window.addEventListener("sendGA", function(e){
    if(window.utilities.exists(window.ga)){
      ga.apply(ga, ["send", "event"].concat(e.detail));
    }
  });
};

window.EventManager = new EventManager();