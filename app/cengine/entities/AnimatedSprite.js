/**
 * @author Steven Chennault <schenn@gmail.com>
 */
/**
 * @typedef {object} LocalParams~AnimatedSpriteParams
 * @property {object.<string, LocalParams~AnimatorParams>} animations
 */

import Sprite from "Sprite";
import privateProperties from "../engineParts/propertyDefinitions";
import * as utilities from "../engineParts/utilities";

class AnimatedSprite extends Sprite {
  /**
   * @returns {string}
   */
  get CurrentAnimation(){
    return privateProperties[this].currentAnimation;
  }

  /**
   *
   * @param {string} animation
   */
  set CurrentAnimation(animation){
    if(utilities.exists(privateProperties[this].animations.has(animation))){
      this.messageToSubEntity(privateProperties[this].currentAnimation, "disable");
      privateProperties[this].currentAnimation = animation;
      this.messageToSubEntity(privateProperties[this].currentAnimation, "enable");
    }
  }

  constructor(params, EntityManager){
    super(params, EntityManager);
    privateProperties[this].animations = new Map();
    privateProperties[this].currentAnimation = "default";

    for(var {[name]:animation} of params.animations) {
      this.addAnimation(name, animation);
    }
  }

  addAnimation(name, animation){
    let animator = this.EntityManager.create("Animator", Object.assign({}, {
        name: name,
        // When the sprite's frame has changed, tell the entity to set the sprite to the next frame.
        onFrameChange: nextFrame=>{
          if(privateProperties[this].currentAnimation === name){
            this.setSprite(nextFrame);
          }
        }
      },
      animation));
    if(name !== "default") {
      animator.disable();
    }

    privateProperties[this].animations[name] = true;

    this.attachSubEntity(name, animator);
  }
}

export default AnimatedSprite;