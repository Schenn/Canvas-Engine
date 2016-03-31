/**
 * Created by schenn on 3/30/16.
 */

function Entity(params){
  var self = this;
  // The default property configuration
  function defaultProperty(privateVar) {
    return {
      enumerable: true,
      configurable: false,
      get: function () {
        return privateVar;
      },
      set: function (val) {
        var e = new CustomEvent("EntityPropertyChanged", {detail: {
          "name": self.name,
          "old": privateVar,
          "new": val
        }});

        window.dispatchEvent(e);

        if (typeof(val) === typeof(privateVar)) {
          privateVar = val;
        }
      }
    };
  }

// These properties are used but can only be set once
  function lockedProperty(val){
    var d = lockedProperty.d ||
      (
        lockedProperty.d = {
          enumerable: true,
          writable: false,
          configurable: false,
          value: null
        }
      );
    d.value = val;
    return d;
  }

  // Private Properties
  var align= 'center',
    angle= 0,
    baseline= 'middle',
    ccw= false,
    closed= false,
    compositing= 'source-over',
    cornerRadius= 0,
    cropFromCenter= true,
    end= 360,
    fontWeight = "normal",
    fontSize = "12pt",
    fontFamily = "sans-serif",
    fromCenter= false,
    height= 0,
    inDegrees= true,
    load= null,
    mask= false,
    opacity= 1,
    projection= 0,
    r1= null,
    r2= null,
    radius= 0,
    repeat= 'repeat',
    rounded= false,
    scaleX= 1,
    scaleY= 1,
    shadowBlur= 3,
    shadowColor= 'transparent',
    shadowX= 0,
    shadowY= 0,
    sHeight= 0,
    sides= 3,
    start= 0,
    strokeCap= 'butt',
    strokeJoin= 'miter',
    strokeStyle= 'transparent',
    strokeWidth= 1,
    sWidth= 0,
    sx= null,
    sy= null,
    text= '',
    width= 0,
    x= 0,
    x1= 0,
    x2= 0,
    y= 0,
    y1= 0,
    y2= 0;

  // Public Properties
  Object.defineProperties(this, {
    "align":defaultProperty(align),
    "angle":defaultProperty(angle),
    "baseline":defaultProperty(baseline),
    "ccw":defaultProperty(ccw),
    "closed":defaultProperty(closed),
    "compositing":defaultProperty(compositing),
    "cornerRadius":defaultProperty(cornerRadius),
    "cropFromCenter":defaultProperty(cropFromCenter),
    "end":defaultProperty(end),
    "fromCenter":defaultProperty(fromCenter),
    "height":defaultProperty(height),
    "inDegrees":defaultProperty(inDegrees),
    "load":defaultProperty(load),
    "mask":defaultProperty(mask),
    "opacity":defaultProperty(opacity),
    "projection":defaultProperty(projection),
    "r1":defaultProperty(r1),
    "r2":defaultProperty(r2),
    "radius":defaultProperty(radius),
    "repeat":defaultProperty(repeat),
    "rounded":defaultProperty(rounded),
    "scaleX":defaultProperty(scaleX),
    "scaleY":defaultProperty(scaleY),
    "shadowBlur":defaultProperty(shadowBlur),
    "shadowColor":defaultProperty(shadowColor),
    "shadowX": defaultProperty(shadowX),
    "shadowY":defaultProperty(shadowY),
    "sHeight": defaultProperty(sHeight),
    "sides":defaultProperty(sides),
    "start":defaultProperty(start),
    "strokeCap":defaultProperty(strokeCap),
    "strokeJoin":defaultProperty(strokeJoin),
    "strokeStyle":defaultProperty(strokeStyle),
    "strokeWidth": defaultProperty(strokeWidth),
    "sWidth":defaultProperty(sWidth),
    "sx":defaultProperty(sx),
    "sy":defaultProperty(sy),
    "text":defaultProperty(text),
    "width":defaultProperty(width),
    "x":defaultProperty(x),
    "x1":defaultProperty(x1),
    "x2":defaultProperty(x2),
    "y":defaultProperty(y),
    "y1":defaultProperty(y1),
    "y2":defaultProperty(y2)
  });

  // Fixed Public Properties
  Object.defineProperties(this, {
    "source": lockedProperty(params.source || null),
    "z_index": lockedProperty(params.z_index || 0),
    "name": lockedProperty(params.name)
  });

  // Font is special
  Object.defineProperty(this, "font", {
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
    }
  });

  if(params.hasOwnProperty("source")){
    delete params.source;
  }
  if(params.hasOwnProperty("z_index")){
    delete params.z_index;
  }


  Object.keys(params).forEach(function(key, index, keys){
    if(typeof(params[key]) === "function"){
      self[key] = params[key].bind(self);
    } else {
      self[key] = params[key];
    }
  });
}