/**
 * @author Steven Chennault <schenn@gmail.com>
 */
/**
 * @callback Callbacks~Draw
 * @param {EnhancedContext} ctx
 */

/**
 * @callback Callbacks~Clear
 * @param {EnhancedContext} ctx
 */
/**
 * @typedef {object} ComponentParams~Renderer
 * @property {Callbacks~Draw} draw - The actual bit that does the rendering. @see {CanvasEngine.Entities}.
 * @property {number} [angle=0]
 * @property {boolean} [ccw=false]
 * @property {boolean} [closed=false]
 * @property {string} [compositing='source-over']
 * @property {number} [cornerRadius=0]
 * @property {number} [end=0]
 * @property {string} [fillStyle="#000"]
 * @property {boolean} [fromCenter=false]
 * @property {number} [height=0]
 * @property {boolean} [inDegrees=true]
 * @property {boolean} [mask=false]
 * @property {number} [opacity=1]
 * @property {number} [projection=0]
 * @property {?number} [r1=null]
 * @property {?number} [r2=null]
 * @property {number} [radius=0]
 * @property {string} [repeat="repeat"]
 * @property {boolean} [rounded=false]
 * @property {number} [scaleX=1]
 * @property {number} [scaleY=1]
 * @property {number} [shadowBlur=3]
 * @property {string} [shadowColor='transparent']
 * @property {number} [shadowX=0]
 * @property {number} [shadowY=0]
 * @property {number} [sides=3]
 * @property {number} [start=0]
 * @property {string} [strokeCap='butt']
 * @property {string} [strokeJoin='miter']
 * @property {string} [strokeStyle='transparent']
 * @property {number} [strokeWidth=1]
 * @property {number} [width=0]
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {?Image} [source=null]
 * @property {object} [clearInfo=null]
 * @property {?Callbacks~Clear} [clear=null]
 */

import {properties} from "../engineParts/propertyDefinitions.js";
import {Component} from "./Component.js";

const privateProperties = new WeakMap();


/**
 * The Renderer component is responsible for managing the properties required to draw an object to a canvas.
 *
 *   You can provide your own clear method if your shape is too irregular to clear with a rect
 *   If no clearInfo method is provided, the Renderer uses its x, y, height and width in a clearRect method.
 *
 *
 * @class Renderer
 * @memberOf CanvasEngine.Components
 *
 * @todo Allow the Renderer to use gradients and patterns
 * @property {boolean} fromCenter = false
 *
 */
export class Renderer extends Component {

  get angle(){
    return privateProperties[this.id].angle;
  }

  get ccw(){
    return privateProperties[this.id].ccw;
  }

  get closed(){
    return privateProperties[this.id].closed;
  }

  get compositing(){
    return privateProperties[this.id].compositing;
  }

  get cornerRadius(){
    return privateProperties[this.id].cornerRadius;
  }

  get end(){
    return privateProperties[this.id].end;
  }

  get fillStyle(){
    return privateProperties[this.id].fillStyle;
  }

  get fromCenter(){
    return privateProperties[this.id].fromCenter;
  }

  get height(){
    return privateProperties[this.id].height;
  }

  get inDegrees(){
    return privateProperties[this.id].inDegrees;
  }

  get mask(){
    return privateProperties[this.id].mask;
  }

  get opacity(){
    return privateProperties[this.id].opacity;
  }

  get projection(){
    return privateProperties[this.id].projection;
  }

  get r1(){
    return privateProperties[this.id].r1;
  }

  get r2(){
    return privateProperties[this.id].r2;
  }

  get radius(){
    return privateProperties[this.id].radius;
  }

  get rounded(){
    return privateProperties[this.id].rounded;
  }

  get scaleX(){
    return privateProperties[this.id].scaleX;
  }

  get scaleY(){
    return privateProperties[this.id].scaleY;
  }

  get shadowBlur(){
    return privateProperties[this.id].shadowBlur;
  }

  get shadowColor(){
    return privateProperties[this.id].shadowColor;
  }

  get shadowX(){
    return privateProperties[this.id].shadowX;
  }

  get shadowY(){
    return privateProperties[this.id].shadowY;
  }

  get sides(){
    return privateProperties[this.id].sides;
  }

  get start(){
    return privateProperties[this.id].start;
  }

  get strokeCap(){
    return privateProperties[this.id].strokeCap;
  }

  get strokeJoin(){
    return privateProperties[this.id].strokeJoin;
  }

  get strokeStyle(){
    return privateProperties[this.id].strokeStyle;
  }

  get strokeWidth(){
    return privateProperties[this.id].strokeWidth;
  }

  get width(){
    return privateProperties[this.id].width;
  }

  get x(){
    return privateProperties[this.id].x;
  }

  get y(){
    return privateProperties[this.id].y;
  }

  set angle(angle){
    if(Component.utilities.isNumeric(angle)) {
      privateProperties[this.id].angle = angle;
      this.propertyCallback(angle);
    }
  }

  set ccw(ccw){
    privateProperties[this.id].ccw = !!ccw;
    this.propertyCallback(ccw);
  }

  set closed(closed){
    privateProperties[this.id].closed = !!closed;
    this.propertyCallback(closed);
  }

  set compositing(compositing){
    const compositingEnum = {
      'source-over':1, 'source-in':1, 'source-atop':1, 'destination-over':1, 'destination-in':1,
      'destination-out':1, 'destination-atop':1, 'lighter':1, 'copy':1, 'xor':1, 'multiply':1,
      'screen':1, 'overlay':1, 'darken':1, 'lighten':1, 'color-dodge':1, 'color-burn':1, 'hard-light':1,
      'soft-light':1, 'difference':1, 'exclusion':1, 'hue':1, 'saturation':1, 'color':1,'luminosity':1
    };
    if(compositingEnum[compositing]){
      privateProperties[this.id].compositing = compositing;
      this.propertyCallback(compositing);
    }
  }

  set cornerRadius(radius){
    if(Component.utilities.isNumeric(radius)){
      privateProperties[this.id].radius = radius;
      this.propertyCallback(radius);
    }
  }

  set end(end){
    if(Component.utilities.isNumeric(end)){
      privateProperties[this.id].end = end;
      this.propertyCallback(end);
    }
  }

  set fillStyle(style){
    if(style instanceof CanvasPattern || style instanceof CanvasGradient) {
      privateProperties[this.id].fillStyle = style;
    } else if(style[0] !== '#' && style !== "transparent"){
      style = "#" + style;
    }
    privateProperties[this.id].fillStyle = style;
    this.propertyCallback(style);
  }

  set fromCenter(center){
    privateProperties[this.id].fromCenter = !!center;
    this.propertyCallback(center);
  }

  set height(height){
    if(Component.utilities.isNumeric(height)){
      privateProperties[this.id].height = height;
      this.propertyCallback(height);
    }
  }

  set inDegrees(deg){
    privateProperties[this.id].inDegrees = !!deg;
    this.propertyCallback(privateProperties[this.id].inDegrees);
  }

  set mask(mask){
    privateProperties[this.id].mask = !!mask;
    this.propertyCallback(privateProperties[this.id].mask);
  }

  set opacity(opacity){
    if(Component.utilities.isNumeric(opacity) && opacity <= 1 && opacity >= 0){
      privateProperties[this.id].opacity = opacity;
      this.propertyCallback(opacity);
    }
  }

  set projection(proj){
    if(Component.utilities.isNumeric(proj)){
      privateProperties[this.id].projection = proj;
      this.propertyCallback(proj);
    }
  }

  set r1(r){
    if(Component.utilities.isNumeric(r) || r === null){
      privateProperties[this.id].r1 = r;
      this.propertyCallback(r);
    }
  }

  set r2(r){
    if(Component.utilities.isNumeric(r) || r === null){
      privateProperties[this.id].r2 = r;
      this.propertyCallback(r);
    }
  }

  set radius(rad){
    if(Component.utilities.isNumeric(rad)){
      privateProperties[this.id].radius = rad;
      this.propertyCallback(rad);
    }
  }

  set rounded(round){
    privateProperties[this.id].rounded = !!round;
    this.propertyCallback(!!round);
  }

  set scaleX(scale){
    if(Component.utilities.isNumeric(scale)){
      privateProperties[this.id].scaleX = scale;
      this.propertyCallback(scale);
    }
  }

  set scaleY(scale){
    if(Component.utilities.isNumeric(scale)){
      privateProperties[this.id].scaleY = scale;
      this.propertyCallback(scale);
    }
  }

  set shadowBlur(blur){
    if(Component.utilities.isNumeric(blur)){
      privateProperties[this.id].shadowBlur = blur;
      this.propertyCallback(blur);
    }
  }

  set shadowColor(color){
    if(color[0] !== '#' && color !== "transparent"){
      color = "#" + color;
    }
    privateProperties[this.id].shadowColor = color;
    this.propertyCallback(color);
  }

  set shadowX(x){
    if(Component.utilities.isNumeric(x)){
      privateProperties[this.id].shadowX = x;
      this.propertyCallback(x);
    }
  }

  set shadowY(y){
    if(Component.utilities.isNumeric(y)){
      privateProperties[this.id].shadowY = y;
      this.propertyCallback(y);
    }
  }

  set sides(sides){
    if(Component.utilities.isNumeric(sides)){
      privateProperties[this.id].sides= sides;
      this.propertyCallback(sides);
    }
  }

  set start(start){
    if(Component.utilities.isNumeric(start)){
      privateProperties[this.id].start = start;
      this.propertyCallback(start);
    }
  }

  set strokeCap(cap){
    if(['butt','round','square'].includes(cap.toLowerCase())){
      privateProperties[this.id].strokeCap = cap;
      this.propertyCallback(cap);
    }
  }

  set strokeJoin(join){
    if(['bevel','round','miter'].includes(join.toLowerCase())){
      privateProperties[this.id].strokeCap = join;
      this.propertyCallback(join);
    }
  }

  set strokeStyle(style){
    if(style instanceof CanvasGradient || style instanceof CanvasPattern){
      privateProperties[this.id].strokeStyle = style;
    } else {
      if(style[0] !== "#"){
        style = "#" + style;
      }
      privateProperties[this.id].strokeStyle = style;
    }
    this.propertyCallback(style);
  }

  set strokeWidth(width){
    if(Component.utilities.isNumeric(width)){
      privateProperties[this.id].strokeWidth = width;
      this.propertyCallback(width);
    }
  }

  set width(width){
    if(Component.utilities.isNumeric(width)){
      privateProperties[this.id].width = width;
      this.propertyCallback(width);
    }
  }

  set x(x){
    if(Component.utilities.isNumeric(x)){
      privateProperties[this.id].x = x;
      this.propertyCallback(x);
    }
  }

  set y(y){
    if(Component.utilities.isNumeric(y)){
      privateProperties[this.id].y= y;
      this.propertyCallback(y);
    }
  }

  /**
   * @param {ComponentParams~Renderer} params The container of property values.
   * @param {CanvasEngine.Entities.Entity} entity The entity to attach the Renderer Component to
   */
  constructor(params = {}, entity) {
    super(entity, ()=>{this.markDirty();});
    privateProperties[this.id] = {};
    privateProperties[this.id].isDirty = true;
    privateProperties[this.id].hidden = false;
    privateProperties[this.id].postRender = null;

    this.angle = params.angle || 0;
    this.ccw = params.ccw || false;
    this.closed = params.closed || false;
    this.compositing = params.compositing || 'source-over';
    this.cornerRadius = params.cornerRadius || 0;
    this.end = params.end || 360;
    this.fillStyle = params.fillStyle || "000";
    this.fromCenter = params.fromCenter || false;
    this.height = params.height || 0;
    this.inDegrees = params.inDegrees || true;
    this.mask = params.mask || false;
    this.opacity = params.opacity || 1;
    this.projection = params.projection || 0;
    this.r1 = params.r1 || null;
    this.r2 = params.r2 || null;
    this.radius = params.radius || 0;
    this.rounded = params.rounded || false;
    this.scaleX = params.scaleX || 1;
    this.scaleY = params.scaleY || 1;
    this.shadowBlur = params.shadowBlur || 3;
    this.shadowColor = params.shadowColor || 'transparent';
    this.shadowX = params.shadowX || 0;
    this.shadowY = params.shadowY || 0;
    this.sides = params.sides || 3;
    this.start = params.start || 0;
    this.strokeCap = params.strokeCap || 'butt';
    this.strokeJoin = params.strokeJoin || 'miter';
    this.strokeStyle = params.strokeStyle || 'transparent';
    this.strokeWidth = params.strokeWidth || 1;
    //this.toRad = 2* Math.PI;
    this.width = params.width || 0;
    this.x = params.x || 0;
    this.y = params.y || 0;


    // The Draw Method is required. You <u>have</u> to tell the renderer how your entity draws itself.
    this.draw = params.draw;
    this.draw.bind(this);
    delete params.draw;

    if(Component.utilities.exists(params.clearInfo)){
      privateProperties[this.id].clearInfo = params.clearInfo;
      privateProperties[this.id].clearInfo.bind(this);
    }

    if ((Component.utilities.isFunction(params.clear))) {
      privateProperties[this.id].clear = params.clear;
      privateProperties[this.id].clear.bind(this);
    }

    this.initialized();
    this.markDirty();
  }

  /**
   * Get the Clear Info for the Rendered thing
   *
   * @returns {{x: (number), y: (number), height: (number), width: (number), fromCenter: boolean}}
   */
  clearInfo(ctx){
    let standard = {
      x: this.x,
      y: this.y,
      height: this.height,
      width: this.width
    }
    if(this.height === 0 && this.radius > 0){
      standard.height = this.radius * 2;
      standard.width = this.radius * 2;
      standard.fromCenter = true;
    }
    return (Component.utilities.exists(privateProperties[this.id].clearInfo)) ?
        privateProperties[this.id].clearInfo(ctx) : standard;
  }

  /**
   * Clear the previous render's 'shadow' from a context.
   * @param {EnhancedContext} ctx
   */
  clear(ctx) {
    if(Component.utilities.exists(privateProperties[this.id].clear)){
      privateProperties[this.id].clear(ctx);
    } else {
      if (!Component.utilities.exists(privateProperties[this.id].clearShadow)) {
        privateProperties[this.id].clearShadow = this.clearInfo(ctx);
      }
      ctx.clear(privateProperties[this.id].clearShadow);
    }
  }

  markDirty () {
    privateProperties[this.id].isDirty = true;
  }

  get isDirty(){
    return privateProperties[this.id].isDirty === true;
  }

  hide(callback){
    privateProperties[this.id].hidden = true;
    privateProperties[this.id].postRender = callback;
  }

  /**
   * Set the defaults and call the draw method against a context.
   *    When a renderer is drawn, it stores a 'shadow' of the render for clearing later.
   *
   * @param {EnhancedContext} ctx EnhancedContext
   */
  render (ctx) {
    ctx.setDefaults(Object.assign({}, this.asObject()));
    if(!privateProperties[this.id].hidden) {
      this.draw(ctx);
      privateProperties[this.id].isDirty = false;
      privateProperties[this.id].clearShadow = this.clearInfo(ctx);
    }
  }

  postRender(){
    if(Component.utilities.isFunction(privateProperties[this.id].postRender)){
      privateProperties[this.id].postRender();
    }
  }

  /**
   * Does a given pixel fall inside of this renderer component?
   *
   * @param {GeneralTypes~coords} coords
   * @returns {boolean}
   */
  containsPixel(coords) {
    // if we contain the pixel position
    let area = privateProperties[this.id].clearShadow;
    let leftBoundary = area.x;
    let rightBoundary = area.x;
    let topBoundary = area.y;
    let bottomBoundary = area.y;
    if (this.fromCenter) {
      leftBoundary -= (0.5 * area.width);
      rightBoundary += (0.5 * area.width);
      topBoundary -= (0.5 * area.height);
      bottomBoundary += (0.5 * area.height);
    }
    else {
      rightBoundary += area.width;
      bottomBoundary += area.height;
    }

    return ((coords.x >= leftBoundary) && (coords.x <= rightBoundary) &&
    ((coords.y >= topBoundary) && (coords.y <= bottomBoundary)));
  }

  asObject() {
    return properties.proxy(privateProperties[this.id]);
  }

  /**
   * Set the position of the renderer component
   * @param {GeneralTypes~coords} position
   */
  setPosition(position) {
    if (Component.utilities.exists(position.x)) {
      this.x = position.x;
    }
    if (Component.utilities.exists(position.y)) {
      this.y = position.y;
    }
  }

  /**
   * Set the size dimensions for the renderer component
   * @param {{ height: number, width: number}} size
   */
  resize(size) {
    if (Component.utilities.exists(size.height)) {
      this.height = size.height;
    }
    if (Component.utilities.exists(size.width)) {
      this.width = size.width;
    }
  }

}