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
(function(CanvasEngine) {
  var props = CanvasEngine.EntityManager.properties;

  /**
   * A Text Component handles the manipulation of text and its font.
   *
   * @param {ComponentParams~Text} params
   *
   * @param {CanvasEngine.Entities.Entity} entity
   *
   * @constructor
   * @property {string} Text.align
   * @property {string} Text.baseline
   * @property {string} Text.font
   * @property {string} Text.fontWeight
   * @property {string} Text.fontSize
   * @property {string} Text.fontFamily
   * @property {string} Text.text
   * @memberOf CanvasEngine.Components
   */
  var Text = function(params, entity){
    var align = "center",
      baseline = "middle",
      fontWeight = "normal",
      fontSize = "12pt",
      fontFamily = "sans-serif",
      txt = "";

    Object.defineProperties(this, {
      "align":props.defaultProperty(align, params.callback),
      "baseline":props.defaultProperty(baseline,params.callback),
      "text":props.defaultProperty(txt,params.callback),
      "fontWeight":props.defaultProperty(fontWeight, params.callback),
      "fontSize":props.defaultProperty(fontSize, params.callback),
      "fontFamily":props.defaultProperty(fontFamily, params.callback),
      // Font is special, it is the combination of weight, size and family
      "font": {
        enumerable: true,
        configurable: false,
        get: function(){return fontWeight + " " + fontSize + " " + fontFamily;},
        set: function(newFont){
          // Find a font weight in the new font if one was provided, if not keep the original value
          var weightMatches = newFont.match(/(\d00|bold\D*|lighter|normal)/);
          fontWeight = (weightMatches !== null) ? weightMatches[0] : fontWeight;

          var sizeMatches = newFont.match(/(\d+(px)|\d+(em)|\d+(pt))/);
          fontSize = (sizeMatches !== null) ? sizeMatches[0] : fontSize;

          fontFamily = newFont.replace(fontWeight, "").replace(fontSize, "").trim();
          params.callback();
        }
      }
    });

    /**
     * @returns {CanvasEngine.Entities.Entity}
     */
    this.getEntity = function(){
      return entity;
    };

    /**
     * @returns {{align: string,baseline:string, text: string, font: string }}
     */
    this.asObject = function(){
      return {align: this.align, baseline: this.baseline, text: this.text, font: this.font};
    };

    /**
     * Set the objects text.
     *
     * @param {string} phrase
     */
    this.setText = function(phrase){
      this.text = phrase;
    };

    CanvasEngine.utilities.setProperties(this, params);
  };

  CanvasEngine.EntityManager.addComponent("Text", function(params, entity){
    return new Text(params, entity);
  }, true);
})(window.CanvasEngine);