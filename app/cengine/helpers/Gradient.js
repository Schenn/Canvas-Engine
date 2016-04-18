/**
 * Created by schenn on 3/25/16.
 */
var Gradient = function(name, coords, colors){
  this.name = name;
  this.x1 = coords.x1;
  this.x2 = coords.x2;
  this.y1 = coords.y1;
  this.y2 = coords.y2;

  var self = this;
  colors.forEach(function(color, index){
    self['c'+(index+1)] = color.color;
    self['s'+(index+1)] = color.s;
  });
  if(coords.hasOwnProperty('radius1') || coords.hasOwnProperty('radius2')){
    this.r1 = coords.radius1;
    this.r2 = coords.radius2;
  }

};

Gradient.prototype.create = function(canvas){
  this.gradient = canvas.createGradient(this);
  return this;
};