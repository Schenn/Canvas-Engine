(function() {
  var EM = CanvasEngine.EntityManager;
  var utilities = CanvasEngine.utilities;

  // Animates an array of strings over time.
  // Why? You ask. Because those strings can then be applied against maps somewhere else with more relevant information.
  EM.setMake("Animator", function (entity, params) {
    var frames, baseDuration, duration, frameCount, currentFrame;

    var onFrameChange = params.onFrameChange;

    if(utilities.exists(params.frames)){
      frames = params.frames;
      frameCount = frames.length;
    } else {
      frameCount = utilities.exists(params.frameCount) ? params.frameCount : 1;
      frames = [];
      for(var i =0; i < frameCount; i++){
        frames.push(i);
      }
    }

    baseDuration = params.duration;

    duration = (!utilities.exists(frames) || frames.length === 0 || baseDuration === 0) ? 0 : baseDuration / frameCount;

    //Add a Timer Component
    EM.attachComponent(entity,"Timer", {duration: duration, onElapsed: function(){
      if(++currentFrame > frameCount){
        currentFrame = 0;
      }
      onFrameChange(currentFrame);
    }});
  });


})();