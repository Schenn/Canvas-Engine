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

import Entity from "Entity.js";

import * as utilities from "../engineParts/utilities";
import privateProperties from "../engineParts/propertyDefinitions";

class Animator extends Entity {
  constructor(params, EntityManager){
    super(params, EntityManager);

    if(utilities.exists(params.frames)){
      privateProperties[this].frames = params.frames;
      privateProperties[this].frameCount = frames.length;
    } else {
      privateProperties[this].frameCount = utilities.exists(params.frameCount) ? params.frameCount : 1;
      privateProperties[this].frames = [];
      for(var i =0; i < privateProperties[this].frameCount; i++){
        privateProperties[this].frames.push(i);
      }
    }

    privateProperties[this].baseDuration = params.duration;
    privateProperties[this].duration = (privateProperties[this].baseDuration > 0) ?
      privateProperties[this].baseDuration / privateProperties[this].frameCount :
      0;

    privateProperties[this].currentFrame = 0;

    EntityManager.attachComponent(this,"Timer",
      {
        duration: privateProperties[this].duration,
        onElapsed: function(){
          privateProperties[this].currentFrame++;
          if(privateProperties[this].currentFrame > privateProperties[this].frameCount-1){
            privateProperties[this].currentFrame = 0;
          }
          onFrameChange(privateProperties[this].frames[privateProperties[this].currentFrame]);
        }
      }
    );
  }

  /**
   * Disable the Animator
   */
  disable(){
    this.messageToComponent("Timer", "disable");
  }
  /**
   * Enable the Animator
   */
  enable(){
    this.messageToComponent("Timer", "enable");
  }
}

export default Animator;