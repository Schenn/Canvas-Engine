/**
 * @author Steven Chennault <schenn@gmail.com>
 */
/**
 * @callback Callbacks~onDirectionChange
 * @param {object} direction
 * @param {string} direction.direction - The character representation of the direction of movement
 * @param {number} direction.xSpeed - The x axis speed
 * @param {number} direction.ySpeed - The y axis speed.
 * @this CanvasEngine.Components#Movement
 *
 * @todo Bind this to the Entity, not the movement component
 *
 * @see {CanvasEngine.Components.getDirection}
 */

import Component from "Component.js"
import properties from "../engineParts/propertyDefinitions.js"
import * as utilities from "../engineParts/utilities.js"

let destX = Symbol("destX");
let destY = Symbol("destY");
let currentX = Symbol("currentX");
let currentY= Symbol("currentY");
let xSpeed = Symbol("xSpeed");
let ySpeed = Symbol("ySpeed");
let lastDirection = Symbol("lastDirection");

/**
 * The movement component adjusts the current position based on speed and the passage of time
 *
 * @class Movement
 * @memberOf CanvasEngine.Components
 * @property {number} Movement.x
 * @property {number} Movement.y

 */
class Movement extends Component {
  /**
   * @param {object} params
   * @param {number} params.x
   * @param {number} params.y
   * @param {number} [params.xSpeed]
   * @param {number} [params.ySpeed]
   * @param {Callbacks~onDirectionChange} [params.onDirectionChange] A callback which is fired when the direction of the movement component changes
   * @param {Callbacks~onPropertyChanged} [params.onMoveX] A callback which is fired when the component moves along the x Axis
   * @param {Callbacks~onPropertyChanged} [params.onMoveY] A callback which is fired when the component moves along the y Axis
   * @param {CanvasEngine.Entities.Entity} entity
   */
  constructor(params, entity){
    super(entity);

    this[currentX] = params.x;
    this[currentY] = params.y;
    this[xSpeed] = utilities.exists(params.xSpeed) ? params.xSpeed : 0;
    this[ySpeed] = utilities.exists(params.ySpeed) ? params.ySpeed : 0;

    this[destX] = 0;
    this[destY] = 0;
    this[lastDirection] = null;

    if(utilities.isFunction(params.onDirectionChange)){
      this.onDirectionChange = params.onDirectionChange.bind(this);
    }

    properties.observe({name: "x", value: this[currentX], callback: params.onMoveX}, this);
    properties.observe({name: "y", value: this[currentY], callback: params.onMoveY}, this);
  }

  /**
  * Adjust the position based on axis speeds
  *
  * @param {number} delta The seconds as a decimal since the last render call.
  */
  move(delta){
    this.x += (this[xSpeed] !== 0) ? this[xSpeed] * delta : 0;
    this.y += (this[ySpeed] !== 0) ? this[ySpeed] * delta : 0;

    if (this[xSpeed] > 0) {
      if (this[destX] !== 0 && this.x >= this[destX] ) {
        this[xSpeed] = 0;
      }
    } else if (this[xSpeed] < 0) {
      if (this.x <= this[destX] && this[destX] !== 0) {
        this[xSpeed] = 0;
      }
    }

    if (this[ySpeed] > 0) {
      if (this[destY] !== 0 && this.y >= this[destY] ) {
        this[ySpeed] = 0;
      }
    } else if (this[ySpeed] < 0) {
      if (this[destY] !== 0 && this.y <= this[destY]) {
        this[ySpeed] = 0;
      }
    }

    if (this.getDirection().direction !== this[lastDirection] && utilities.isFunction(this.onDirectionChange)) {
      var dir = this.getDirection();
      this.onDirectionChange(dir);
      this[lastDirection] = dir.direction;
    }
  }

  /**
   * Set the axis speeds.
   *
   * @param {object} speeds
   * @param {number} [speeds.xSpeed]
   * @param {number} [speeds.ySpeed]
   *
   */
  setSpeed(speeds){
    this[xSpeed] = utilities.exists(speeds.xSpeed)? speeds.xSpeed : this[xSpeed];
    this[ySpeed] = utilities.exists(speeds.ySpeed)? speeds.ySpeed : this[ySpeed];
  }

  /**
   * Set the origin point
   *
   * @param {GeneralTypes~coords} coords
   */
  setOrigin(coords){
    this.x = coords.x;
    this.y = coords.y;
  }

  /**
   * Get this components data as a literal object
   *
   * @returns {{x: number, y: number, xSpeed: number, ySpeed: number}}
   */
  asObject(){
    return {x:this.x, y:this.y,xSpeed: this[xSpeed], ySpeed: this[ySpeed]};
  }

  /**
   * Get a "Direction" of movement based on the given axis speeds.
   *
   * @returns {{direction: string, xSpeed: number, ySpeed: number}}
   */
  getDirection() {
    var direction = "";

    direction += (this[ySpeed] > 0) ? "S" : "N";
    if(this[xSpeed] !== 0) {
      direction += (this[xSpeed] > 0) ? "E" : "W";
    }

    return {
      direction: direction,
      xSpeed: this[xSpeed],
      ySpeed: this[ySpeed]
    };
  }

  /**
   * Travel a distance in a given direction.
   *
   * When the entity reaches that destination,
   *  it will set it's speeds to 0 and stop moving.
   *
   * @param distance {{x: number, y: number, speed: number }}
   */
  travel(distance){
    if(this[ySpeed] === 0) {
      if (utilities.exists(distance.y)) {
        this[destY] = this.y + distance.y;
        if (distance.y < 0) {
          this[ySpeed] = Math.abs(distance.speed) * -1;
        } else {
          this[ySpeed] = Math.abs(distance.speed);
        }
      }
    }

    if(this[xSpeed] === 0){
      if(utilities.exists(distance.x)){
        this[destX] = this.x + distance.x;
        if(distance.x < 0){
          this[xSpeed] = Math.abs(distance.speed) * -1;
        } else {
          this[xSpeed] = Math.abs(distance.speed);
        }
      }
    }

  }

}

export default Movement