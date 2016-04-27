(function() {
  var EM = CanvasEngine.EntityManager;
  var utilities = CanvasEngine.utilities;

  // Needs a method to determine which animation to use
  EM.setMake("MobileSprite", function (entity, params) {
    var images = {}, sheets = {}, animations={}, currentSheet="default", currentAnimation = "default";

    // Add an image and SpriteSheet for each SpriteSheet.
    $.each(Object.keys(params.spritesheets), function(index, sheetName){
      entity.addSpriteSheet(sheetName, params.spritesheets[sheetName]);
    });

    $.each(params.animations, function(name, animation){
      entity.addAnimation(name, animation);
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
    EM.attachComponent(entity, "Movement", $.extend({}, {onDirectionChange:function(direction){
      entity.onDirectionChange(direction);
    }},params));

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

    entity.addSpriteSheet = function(sheetName, spriteSheet){
      images[sheetName+"Image"] = {
        source: spriteSheet.source,
        height: spriteSheet.height,
        width: spriteSheet.width
      };
      sheets[sheetName+"Sheet"] =spriteSheet;
    };

    entity.addAnimation = function(name, animation){
      animations[name] = EM.create("Animator",
        $.extend({}, {
          onFrameChange: function(nextFrame){
            if(currentAnimation == name){
              // Set the current sprite image to nextFrame
              entity.messageToComponent(currentSheet+"Image",
                "setSprite",
                entity.getFromComponent(currentSheet+"Sheet", "getSprite", nextFrame)
              );
            }
          }
        },
        animation));
      if(name != currentSheet) {
        animations[name].disable();
      }
    };
    entity.onDirectionChange = utilities.isFunction(params.onDirectionChange) ?
      params.onDirectionChange :
      function(newDirection){
        if(utilities.exists(animations[newDirection.name])){
          entity.setCurrentAnimation(newDirection.name);
        }
    };

    return entity;
  });

})();

