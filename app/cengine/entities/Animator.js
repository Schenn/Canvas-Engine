(function() {
  var EM = CanvasEngine.EntityManager;
  var utilities = CanvasEngine.utilities;


  /**
   * Tell the EntityManager how to make an Animator entity.
   *
   * An Animator entity Animates an array of strings over time.
   * Why? You ask. Because those strings can then be applied against maps somewhere else with more relevant information on what to do.
   * This way you can apply the animator to a variety of things, not just a set of images.
   */
  EM.setMake("Animator", function (entity, params) {
    var frames, baseDuration, duration, frameCount, currentFrame=0;

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

    duration = (baseDuration > 0) ? baseDuration / frameCount : 0;

    // Give the entity a pass through method for telling the timer to disable
    entity.disable = function(){
      entity.messageToComponent("Timer", "disable");
    };

    // Give the entity a pass through method for telling the timer to enable
    entity.enable = function(){
      entity.messageToComponent("Timer", "enable");
    };

    //Add a Timer Component
    EM.attachComponent(entity,"Timer", {duration: duration, onElapsed: function(){
      currentFrame++;
      if(currentFrame > frameCount-1){
        currentFrame = 0;
      }
      onFrameChange(frames[currentFrame]);
    }});

    return entity;
  });


})();