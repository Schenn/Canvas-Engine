/**
 * Created by schenn on 3/24/16.
 */

var Label = function(){

  this.fillStyle = "#fff";
  this.align = "left";
  this.baseline = "middle";
  this.font = "normal 1em Georgia, 'Times New Roman', Times, serif";

  // The text to render
  this.text = "";

  this.clearInfo = function(canvas){
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

  this.render = function(canvas){
    if (typeof(this.text) !== "undefined" && this.text !== "") {
      canvas.drawText({
        fillStyle: this.fillStyle,
        strokeStyle: this.strokeStyle,
        strokeWidth: this.strokeWidth,
        x: this.x,
        y: this.y,
        text: this.text,
        align: this.align,
        baseline: this.baseline,
        font: this.font
      });
    }
  };

};