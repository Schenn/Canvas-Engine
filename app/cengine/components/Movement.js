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
 *
 * @see {CanvasEngine.Components.getDirection}
 */

import {Component} from "./Component.js";
const privateProperties = new WeakMap();

/**
 * The movement component adjusts the current position based on speed and the passage of time
 *
 * @class Movement
 * @memberOf CanvasEngine.Components
 * @property {number} Movement.x
 * @property {number} Movement.y

 */
export class Movement extends Component {

  get currentX(){
    return privateProperties[this.id].currentX;
  }

  get currentY(){
    return privateProperties[this.id].currentY;
  }

  get x(){
    return privateProperties[this.id].currentX;
  }

  get y(){
    return privateProperties[this.id].currentY;
  }

  set x(x){
    let lastX = this.currentX;
    this.currentX = x;
    if(privateProperties[this.id].onMoveX) {
      privateProperties[this.id].onMoveX(x, lastX);
    }
  }

  set y(y){
    let lastY = this.currentY;
    this.currentY = y;
    if(privateProperties[this.id].onMoveY){
      privateProperties[this.id].onMoveY(y, lastY);
    }

  }

  set currentX(x){
    if(Component.utilities.isNumeric(x)){
      privateProperties[this.id].currentX = x;
      this.propertyCallback(x);
    }
  }

  set currentY(y){
    if(Component.utilities.isNumeric(y)){
      privateProperties[this.id].currentY = y;
      this.propertyCallback(y);
    }
  }

  get xSpeed(){
      return privateProperties[this.id].xSpeed;
  }

  get ySpeed(){
    return privateProperties[this.id].ySpeed;
  }

  set xSpeed(speed){
    if(Component.utilities.isNumeric(speed)){
      privateProperties[this.id].xSpeed = speed;
      this.propertyCallback(speed);
    }
  }

  set ySpeed(speed){
    if(Component.utilities.isNumeric(speed)){
      privateProperties[this.id].ySpeed = speed;
      this.propertyCallback(speed);
    }
  }

  get destX(){
    return privateProperties[this.id].destX;
  }

  get destY(){
    return privateProperties[this.id].destY;
  }

  set destX(x){
    if(Component.utilities.isNumeric(x)){
      privateProperties[this.id].destX = x;
    }
  }

  set destY(y){
    if(Component.utilities.isNumeric(y)){
      privateProperties[this.id].destY = y;
    }
  }

  get lastDirection(){
    return privateProperties[this.id].lastDirection;
  }

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
  constructor(params, entity) {
    super(entity);
    privateProperties[this.id] = {};
    if(!Component.utilities.exists(params.x) || !Component.utilities.exists(params.y)){
      throw "Movement component did not get point of origin in constructor.";
    }
    this.currentX = params.x;
    this.currentY = params.y;
    this.xSpeed = Component.utilities.exists(params.xSpeed) ? params.xSpeed : 0;
    this.ySpeed = Component.utilities.exists(params.ySpeed) ? params.ySpeed : 0;

    this.destX = 0;
    this.destY = 0;
    privateProperties[this.id].lastDirection = null;

    if (Component.utilities.isFunction(params.onDirectionChange)) {
      this.onDirectionChange = params.onDirectionChange.bind(this.Entity);
    }

    if(params.onMoveX){
      privateProperties[this.id].onMoveX = params.onMoveX;
      privateProperties[this.id].onMoveX.bind(this);
    }

    if(params.onMoveY){
      privateProperties[this.id].onMoveY = params.onMoveY;
      privateProperties[this.id].onMoveY.bind(this);
    }
  }

  /**
   * Adjust the position based on axis speeds
   *
   * @param {number} delta The seconds as a decimal since the last render call.
   */
  move(delta) {
    if(!Component.utilities.exists(delta)){
      delta = 1;
    }
    this.x += (this.xSpeed !== 0) ? this.xSpeed * delta : 0;
    this.y += (this.ySpeed !== 0) ? this.ySpeed * delta : 0;

    if (this.xSpeed > 0) {
      if (this.destX !== 0 && this.x >= this.destX) {
        this.xSpeed = 0;
      }
    } else if (this.xSpeed < 0) {
      if (this.x <= this.destX && this.destX !== 0) {
        this.xSpeed = 0;
      }
    }

    if (this.ySpeed > 0) {
      if (this.destY !== 0 && this.y >= this.destY) {
        this.ySpeed = 0;
      }
    } else if (this.ySpeed < 0) {
      if (this.destY !== 0 && this.y <= this.destY) {
        this.ySpeed = 0;
      }
    }

    if (this.getDirection().direction !== this.lastDirection && Component.utilities.isFunction(this.onDirectionChange)) {
      let dir = this.getDirection();
      this.onDirectionChange(dir);
      privateProperties[this.id].lastDirection = dir.direction;
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
  setSpeed(speeds) {
    this.xSpeed = Component.utilities.exists(speeds.xSpeed) ?
        speeds.xSpeed : this.xSpeed;
    this.ySpeed = Component.utilities.exists(speeds.ySpeed) ?
        speeds.ySpeed : this.ySpeed;
  }

  /**
   * Set the origin point
   *
   * @param {GeneralTypes~coords} coords
   */
  setOrigin(coords) {
    this.x = coords.x;
    this.y = coords.y;
  }

  /**
   * Get this components data as a literal object
   *
   * @returns {{x: number, y: number, xSpeed: number, ySpeed: number}}
   */
  asObject() {
    return {x: this.x, y: this.y, xSpeed: this.xSpeed, ySpeed: this.ySpeed};
  }

  /**
   * Get a "Direction" of movement based on the given axis speeds.
   *
   * @returns {{direction: string, xSpeed: number, ySpeed: number}}
   */
  getDirection() {
    let direction = "";

    if(this.ySpeed > 0) {
      direction += "S";
    } else if(this.ySpeed < 0) {
      direction += "N";
    }

    if(this.xSpeed > 0) {
      direction += "E";
    } else if(this.xSpeed < 0){
      direction += "W";
    }

    return {
      direction: direction,
      xSpeed: privateProperties[this.id].xSpeed,
      ySpeed: privateProperties[this.id].ySpeed
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
  travel(distance) {
    if (this.ySpeed === 0) {
      if (Component.utilities.exists(distance.y)) {
        this.destY = this.y + distance.y;
        this.ySpeed = (distance.y < 0) ?
            Math.abs(distance.speed) * -1 :
            Math.abs(distance.speed);
      }
    }

    if (this.xSpeed === 0) {
      if (Component.utilities.exists(distance.x)) {
        this.destX = this.x + distance.x;
        this.xSpeed = (distance.x < 0) ?
            Math.abs(distance.speed) * -1 :
            Math.abs(distance.speed);
      }
    }

  }

}