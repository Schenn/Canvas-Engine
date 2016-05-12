/**
 * Created by schenn on 4/17/16.
 */
(function() {
  var props = CanvasEngine.EntityManager.properties;
  var utils = CanvasEngine.utilities;

  /**
   * A Text Component handles the manipulation of text and its font.
   *
   * @param params
   * @param entity
   */
  var text = function(params, entity){
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
      // Font is special
      // This gives us the ability to change the text size, family and weight independently
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

    CanvasEngine.utilities.setProperties(this, params);

    this.getEntity = function(){
      return entity;
    };

    this.asObject = function(){
      return $.extend({}, this);
    };

    // Set the text to a given value.
    this.setText = function(phrase){
      this.text = phrase;
    };

  };

  CanvasEngine.EntityManager.addComponent("Text", function(params, entity){
    return new text(params, entity);
  }, true);
})();