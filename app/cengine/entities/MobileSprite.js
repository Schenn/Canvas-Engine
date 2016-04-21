(function() {
  var EM = CanvasEngine.EntityManager;
  var utilities = CanvasEngine.utilities;

  EM.setMake("MobileSprite", function (entity, params) {
    var images = {}, sheets = {}, animations={}, currentSheet="default", currentAnimation = "default";
    $.each(Object.keys(params.spritesheets), function(index, sheetName){
      images[sheetName+"Image"] = {
        source: params.spritesheets[sheetName].source,
        height: params.spritesheets[sheetName].height,
        width: params.spritesheets[sheetName].width
      };
      sheets[sheetName+"Sheet"] =params.spritesheets[sheetName];
    });

    $.each(params.animations, function(name, animation){
      animations[name] = EM.create("Animator", $.extend({}, {
        onFrameChange: function(nextFrame){
          if(currentAnimation == name){
            // Set the current sprite image to nextFrame
            entity.messageToComponent(currentSheet+"Image",
              "setSprite",
              entity.getFromComponent(currentSheet+"Sheet", "getSprite", nextFrame)
            );
          }
        }
      }, animation));
      if(name != currentSheet) {
        animations[name].disable();
      }
    });

    // A mob can have multiple spritesheets, this means, multiple images for switching between
    EM.attachComponent(entity,
      $.extend({}, {
        SpriteSheet: sheets,
        Image: images,
        Timer:{
          // A mob needs to have a timer for animating its movement
          "movementTimer": $.extend({},{
            onUpdate: function(delta){
              entity.messageToComponent("Movement", "move", delta);
            }
          },params.movementTimer)
        }
      }
    ));


    // A mob needs to have a movement component
    // The movement component needs to help figure out which animation to run
    EM.attachComponent(entity, "Movement", params);

    // A mob needs a renderer
    EM.attachComponent(entity, "Renderer", $.extend({}, {
      draw:function(ctx){
        // Draw the current active sheet image
        var position = entity.getFromComponent("Movement", "asObject");
        var image = entity.getFromComponent(currentSheet+"Image", "asObject");

        ctx.drawImage($.extend({}, this, image, {x:position.x, y: position.y}));
      },
      clearInfo: function(){
        var position = entity.getFromComponent("Movement", "asObject");
        return {
          x: position.x, y: position.y,
          height: this.height, width: this.width, fromCenter: false
        };
      }
    }, params));


    entity.setCurrentSheet = function(sheetName){
      currentSheet = sheetName;
    };

    entity.setCurrentAnimation = function(animation){
      animations[currentAnimation].messageToComponent("Timer", "disable");
      currentAnimation = animation;
      animations[currentAnimation].messageToComponent("Timer", "enable");
    };

  });


})();

