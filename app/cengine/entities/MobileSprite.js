/**
 * @author Steven Chennault <schenn@gmail.com>
 */
/**
 * @typedef {object} LocalParams~MobileSpriteParams
 * @property {function} [onMovement]
 * @property {function} [onDirectionChange]
 * @property {LocalParams~TimerParams} movementTimer
 */

import AnimatedSprite from "AnimatedSprite";
import * as utilities from "../engineParts/utilities";

class MobileSprite extends AnimatedSprite {
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
    EntityManager.attachComponent(this,
      Object.assign({}, {
          Timer:{
            // The entity already has a timer component added for animating sprites.
            //  We need to add a second timer for managing movement.
            "movementTimer": Object.assign({},{
              onUpdate: delta=>{
                this.messageToComponent("Movement", "move", delta);
              }
            },params.movementTimer)
          }
        }
      )
    );
  }

  updateRenderPosition(axis, val){
    var data = {};
    data[axis] = val;
    this.messageToComponent("Renderer", "setPosition", data);
    if(utilities.isFunction(this.onMovement)){
      this.onMovement.call(this, data);
    }
  }

}

export default MobileSprite;