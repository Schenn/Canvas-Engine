/**
 * @author Steven Chennault <schenn@gmail.com>
 */
/**
 * @typedef {object} LocalParams~AnimatorParams
 * @property {function} onFrameChange
 * @property {number} duration
 * @property {Array} [frames]
 * @property {number} [frameCount]
 */
(function(CanvasEngine) {
  var EM = CanvasEngine.EntityManager;
  var utilities = CanvasEngine.utilities;


  /**
   * Tell the EntityManager how to make an Animator entity.
   *
   * An Animator entity Animates an array of strings over time.
   * Why? You ask. Because those strings can then be applied against maps somewhere else with more relevant information on what to do.
   * This way you can apply the animator to a variety of things, not just a set of images.
   */
  EM.setMake("Animator",
    /**
     * @param {CanvasEngine.Entities.Entity} entity
     * @param {LocalParams~AnimatorParams} params
     * @returns {CanvasEngine.Entities.Animator}
     */
    function (entity, params) {
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

      /**
       * @class
       * @memberOf CanvasEngine.Entities
       * @augments CanvasEngine.Entities.Entity
       * @borrows CanvasEngine.Components.Timer as CanvasEngine.Entities.Animator#components~Timer
       */
      var Animator = $.extend(true, {}, {
        /**
         * Disable the Animator
         * @memberof CanvasEngine.Entities.Animator
         * @instance
         */
        disable: function(){
          this.messageToComponent("Timer", "disable");
        },
        /**
         * Enable the Animator
         * @memberof CanvasEngine.Entities.Animator
         * @instance
         */
        enable: function(){
          this.messageToComponent("Timer", "disable");
        }
      }, entity);

      //Add a Timer Component

      EM.attachComponent(Animator,"Timer",
        {duration: duration, onElapsed: function(){
        currentFrame++;
        if(currentFrame > frameCount-1){
          currentFrame = 0;
        }
        onFrameChange(frames[currentFrame]);
      }});

      return Animator;
  });


})(window.CanvasEngine);