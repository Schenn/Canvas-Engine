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

import Component from "Component.js"
import properties from "../engineParts/propertyDefinitions.js"
import * as utilities from "../engineParts/utilities.js"

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
class Text extends Component {
  constructor(params, entity) {
    super(entity, params.callback);
    var { align = "center",
      baseline = "middle",
      fontWeight = "normal",
      fontSize = "12pt",
      fontFamily = "sans-serif",
      text = ""} = params;

    this.setProperty("align", align);
    this.setProperty("baseline", baseline);
    this.setProperty("fontWeight", fontWeight);
    this.setProperty("fontSize", fontSize);
    this.setProperty("fontFamily", fontFamily);
    this.setProperty("text", text);

  }

  get font() {
    return this.fontWeight + " " + this.fontSize + " " + this.fontFamily;
  }

  set font(newFont){
    // Find a font weight in the new font if one was provided, if not keep the original value
    var weightMatches = newFont.match(/(\d00|bold\D*|lighter|normal)/);
    this.fontWeight = (weightMatches !== null) ? weightMatches[0] : this.fontWeight;

    var sizeMatches = newFont.match(/(\d+(px)|\d+(em)|\d+(pt))/);
    this.fontSize = (sizeMatches !== null) ? sizeMatches[0] : this.fontSize;

    this.fontFamily = newFont.replace(this.fontWeight, "").replace(this.fontSize, "").trim();
  }

  /**
   * @returns {{align: string,baseline:string, text: string, font: string }}
   */
  asObject(){
    return {align: this.align, baseline: this.baseline, text: this.text, font: this.font};
  }

  /**
   * Set the objects text.
   *
   * @param {string} phrase
   */
  setText(phrase){
    this.text = phrase;
  }
}

export default Text;