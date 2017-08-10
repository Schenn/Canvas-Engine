/**
 * @author Steven Chennault <schenn@gmail.com>
 */
/**
 * @typedef {object} ComponentParams~Text
 * @property {string} [params.align]
 * @property {string} [params.baseline]
 * @property {string} [params.font]
 * @property {string} [params.fontWeight]
 * @property {string} [params.fontSize]
 * @property {string} [params.fontFamily]
 * @property {Callbacks~onPropertyChanged} [params.callback]
 * @property {string} params.text
 */

import {Component} from "./Component.js";

const privateProperties = new WeakMap();

/**
 * A Text Component handles the manipulation of text and its font.
 *
 * @class Text
 * @memberOf CanvasEngine.Components
 *
 * @property {string} align
 * @property {string} baseline
 * @property {string} font
 * @property {string} fontWeight
 * @property {string} fontSize
 * @property {string} fontFamily
 * @property {string} text
 * @param {ComponentParams~Text} params
 * @param {CanvasEngine.Entities.Entity} entity
 */
export class Text extends Component {

  get align(){
    return privateProperties[this.name].align;
  }

  get baseline(){
    return privateProperties[this.name].baseline;
  }

  get fontWeight(){
    return privateProperties[this.name].fontWeight;
  }

  get fontSize(){
    return privateProperties[this.name].fontSize;
  }

  get fontFamily(){
    return privateProperties[this.name].fontFamily;
  }

  get text(){
    return privateProperties[this.name].text;
  }

  get maxWidth(){
    return privateProperties[this.name].width;
  }

  get font() {
    return this.fontWeight + " " + this.fontSize + " " + this.fontFamily;
  }

  set align(align){
    if(['left', 'center', 'right'].includes(align.toLowerCase())){
      privateProperties[this.name].align = align;
      this.propertyCallback(align);
    }
  }

  set baseline(baseline){
    if(['top', 'middle', 'bottom'].includes(baseline.toLowerCase())){
      privateProperties[this.name].baseline = baseline;
      this.propertyCallback(baseline);
    }
  }

  set fontWeight(boldLevel){
    if(['bold', 'bolder', 'normal', 'lighter'].includes(boldLevel) || Number.isNumeric(boldLevel))
    {
      if(Component.utilities.isNumeric(boldLevel)){
        if(boldLevel < 10 && boldLevel > 0){
          boldLevel *= 100;
        }
      }
      privateProperties[this.name].fontWeight = boldLevel;
      this.propertyCallback(boldLevel);
    }
  }

  set fontSize(size){
    if(Component.utilities.isNumeric(size) ||  /^\d+$/.test(size)){
      size += "pt";
    }
    privateProperties[this.name].fontSize = size;
    this.propertyCallback(size);
  }

  set fontFamily(family){
    privateProperties[this.name].fontFamily = family.trim();
    this.propertyCallback(family);
  }

  set text(message){
    privateProperties[this.name].text = message;
    this.propertyCallback(message);
  }

  set maxWidth(width){
    if(Component.utilities.isNumeric(width)){
      privateProperties[this.name].width = width;
      this.propertyCallback(width);
    }
  }

  set font(newFont){
    // Find a font weight in the new font if one was provided, if not keep the original value
    let weightMatches = newFont.match(/(\d00|bold\D*|lighter|normal)/);
    this.fontWeight = (weightMatches !== null) ? weightMatches[0] : this.fontWeight;

    let sizeMatches = newFont.match(/(\d+(px)|\d+(em)|\d+(pt))/);
    this.fontSize = (sizeMatches !== null) ? sizeMatches[0] : this.fontSize;

    this.fontFamily = newFont.replace(this.fontWeight, "").replace(this.fontSize, "").trim();
  }

  constructor(params, entity) {
    super(entity, params.callback);
    privateProperties[this.name] = {};

    let { align = "center",
      baseline = "middle",
      fontWeight = "normal",
      fontSize = "12pt",
      fontFamily = "sans-serif",
      text = "",
      width = 0} = params;

    this.initialize();
    this.align = align;
    this.baseline = baseline;
    this.fontWeight = fontWeight;
    this.fontSize = fontSize;
    this.fontFamily = fontFamily;
    this.text = text;
    this.maxWidth = width;
    this.initialized();
    this.propertyCallback(this);
  }

  /**
   * Return the properties of this in a digestible object
   * @override
   * @returns {{align: string,baseline:string, text: string, font: string }}
   */
  asObject(){
    return {align: this.align, baseline: this.baseline, text: this.text, font: this.font, width: this.width};
  }
}