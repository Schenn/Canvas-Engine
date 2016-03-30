/**
 * Created by schenn on 3/25/16.
 */
var Spritesheet = function(imagePath, sheet, spriteDetails){

  for(var name in spriteDetails){
    if(spriteDetails.hasOwnProperty(name)) {
      if (!window.utilities.exists(sheet.height)) {
        spriteDetails.height = sheet.height;
        spriteDetails.width = sheet.width;
      }

      var defaults = {
        source: imagePath + sheet.source,
        sx: 0,
        sy: 0,
        sWidth: 50,
        sHeight: 50,
        cropFromCenter: false,
        height: 50,
        width: 50
      };

      sheet[name] = $.extend(true, {}, defaults, spriteDetails[name]);
    }
  }

  this.sheet = sheet;
};