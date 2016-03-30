/**
 * Created by schenn on 3/24/16.
 */

var Font = function(font){
  this.weight = "";
  this.family = "";
  this.size = "";
  this.formatted = function(){
    return this.weight + " " + this.size + " "+ this.family;
  };

  this.setFromString(font);
};

Font.prototype.setFromString = function(font){
  // Dissect the font string into values, then assign them to the font object.
  var weightOptions = ["100","200","300","400","500","600","700","800","900","bold","bolder","normal"];
  var myWeight = "";
  $.each(weightOptions, function(index, val){
    if(font.indexOf(val) !== -1){
      myWeight = val;
    }
  });
  this.weight = myWeight;

  var expr;
  if(font.indexOf("px") > -1){
    expr = /\d+(px)/;
  } else if(font.indexOf('em') > -1){
    expr = /\d+(em)/;
  } else {
    // throw
  }

  this.size = font.match(expr)[0];

  this.family = font.replace(this.weight, "").replace(this.size, "").trim();
};

var Label = function(props){

  var utils = window.utilities;
  props = $.extend({}, props);

  this.fillStyle = utils.orDefault(props.fillStyle, "#fff");
  this.align = utils.orDefault(props.align, "left");
  this.baseline = utils.orDefault(props.baseline, "middle");
  this.font = new Font(
    utils.orDefault(
      props.font,
      "normal 1em Georgia, 'Times New Roman', Times, serif"
    )
  );

  // The text to render
  this.text = utils.orDefault(props.text, "");
};

Label.prototype.setFont = function(font){
  this.font.setFromString(font);
};

Label.prototype.getFont = function(){
  return this.font.formatted();
};

Label.prototype.clearInfo = function(canvas){

  try {
    // Measure the current text on a hidden canvas and use those values to determine the end point of the clear box
    var c = canvas.loadCanvas();
    c.font = this.font;
    var s1 = c.measureText(this.text);
    var s2 = c.measureText("M");
    var _x = this.x;
    if (this.align === "left") {
      _x += s1.width / 2;
    }
    else if (this.align === "right") {
      _x -= s1.width / 2;
    }
    return ({
      x: Math.ceil(_x), y: Math.ceil(this.y),
      height: Math.ceil(s2.width * 1.25),
      width: Math.ceil(s1.width * 1.25), fromCenter: true
    });
  }
  catch (e){
    if(!window.utilities.exists(this.x)){
      console.log("Attempted to clear label before rendering");
    }
    console.log(e);
  }
};

Label.prototype.render = function(canvas){
  if (typeof(this.text) !== "undefined") {
    canvas.drawText({
      fillStyle: this.fillStyle,
      strokeStyle: this.strokeStyle,
      strokeWidth: this.strokeWidth,
      x: this.x,
      y: this.y,
      text: this.text,
      align: this.align,
      baseline: this.baseline,
      font: this.getFont()
    });
  }
};