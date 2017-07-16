/**
 * @author Steven Chennault <schenn@gmail.com>
 */
/**
 * @typedef {object} LocalParams~MobileSpriteParams
 * @property {function} [onMovement]
 * @property {function} [onDirectionChange]
 * @property {LocalParams~TimerParams} movementTimer
 */

import {AnimatedSprite} from "../entities/AnimatedSprite.js";
import * as utilities from "../engineParts/utilities.js";

/**
 * A mobile sprite is an animated sprite which maintains multiple sprite collections
 *  for a moving sprite. These are Entities which will be moving on the screen and
 *    need to animate through a set of sprites in time with their movement.
 */
export class MobileSprite extends AnimatedSprite {
  constructor(params, EntityManager){
    super(params, EntityManager);

    if(utilities.isFunction(params.onMovement)) {
      this.onMovement = params.onMovement;
      this.onMovement.bind(this);
    }

    if(utilities.isFunction(params.onDirectionChange)){
      this.onDirectionChange = params.onDirectionChange;
      this.onDirectionChange.bind(this);
    } else {
      this.onDirectionChange = newDirection => {
        this.CurrentAnimation = newDirection.direction;
      };
    }

    EntityManager.attachComponent(this, "Movement", Object.assign({}, {
      onDirectionChange:(direction)=>{this.onDirectionChange(direction);},
        onMoveX: val=>{this.updateRenderPosition("x", val);},
        onMoveY: val=>{this.updateRenderPosition("y", val);}
    }, params));


    /**
     * Attach a second timer component to the entity which we use to control our movement over time.
     */
    EntityManager.attachComponent(this, {
        "Timer": {
          "movementTimer": (utilities.exists(params.movementTimer)) ? Object.assign({}, {
            onUpdate: delta=> {
              this.messageToComponent("Movement", "move", delta);
            }
          }, params.movementTimer) : {
            onUpdate: delta=> {
              this.messageToComponent("Movement", "move", delta);
            }
          }
        }
      }
    );
  }

  updateRenderPosition(axis, val){
    let data = {};
    data[axis] = val;
    this.messageToComponent("Renderer", "setPosition", data);
    if(utilities.isFunction(this.onMovement)){
      this.onMovement.call(this, data);
    }
  }

}