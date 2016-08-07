/**
 * Created by schenn on 8/6/16.
 */
SystemJS.import('resources/SpriteSheet.js').then(function(m) {
  /**
   * We're testing the Base Component object
   * @module CanvasEngine/tests/EngineParts/EntityManager
   */
  QUnit.module("Resources/SpriteSheet");

  /**
   * Ensure that we can't create a SpriteSheet without properly constructed arguments
   */
  QUnit.test("SpriteSheet requires arguments to construct", function(assert){
    assert.throws(function(){
      let sheet = new m.SpriteSheet();
    }, undefined, "No arguments provided");

    assert.throws(function(){
      let sheet = new m.SpriteSheet({});
    }, /Missing/, "SpriteSheet won't construct without a provided sprite height and width");

    assert.ok(function(){
      let sheet = new m.SpriteSheet({height:50, width:50});
    }, "Sheet constructs ok with just a height and width.");

    assert.ok(function(){
      let image = new Image();
      image.src = "../images/og_image_1.jpg";
      let sheet = new m.SpriteSheet({height:50, width:50, source:image});
    }, "Sheet constructs ok with a height, width, and source.");

  });

  /**
   * Ensure that a SpriteSheet can process an image into sprites
   */
  QUnit.test("SpriteSheet can process a collection of sprites", function(assert){

    assert.ok(function(){
      let image = new Image();
      image.src = "../images/og_image_1.jpg";
      let sheet = new m.SpriteSheet({height: 50, width: 50});
      sheet.source = image;
    }, "SpriteSheet will take a source after construct, then use that source to generate its sprites");

    assert.ok(function(){
      let image = new Image();
      image.src = "/app/images/og_image_1.jpg";
      let sheet = new m.SpriteSheet({height: 50, width: 50, source: image});
    }, "SpriteSheet doesn't fail to load with an image, regardless of whether the image has finished loading or not.");
  });

  /**
   * Ensure that a SpriteSheet source can't be corrupted
   */
  QUnit.test("SpriteSheet source is protected from pollution", function(assert){

    assert.throws(function(){
      let image = new Image();
      image.src = "../images/og_image_1.jpg";
      let image2 = new Image();
      image2.src = "../images/og_image_2.jpg";

      let sheet = new m.SpriteSheet({height: 50, width: 50, source: image});
      sheet.Source = image2;
    }, /Source/, "SpriteSheet throws if you try to change its source.");

    assert.throws(function(){
      let sheet = new m.SpriteSheet({height: 50, width: 50, source: ""});
    }, /js/, "SpriteSheet throws if the provided source isn't an Image object");
  });


  /**
   * Ensure we can retrieve sprites from a SpriteSheet.
   */
  QUnit.test("SpriteSheet contains accessible sprites!", function (assert){
    let img = new Image();
    img.src = "../images/og_image_1.jpg";
    let sheet = new m.SpriteSheet({height: 50, width: 50, source: img});

    assert.propEqual(sheet.getSprite(0), {x: 0, y: 0, width: 50, height: 50}, "We get a sprite data object from the spritesheet.");

    let sheet2 = new m.SpriteSheet({height: 50, width: 50, source: img, sprites: {
      a: {
        x: 200, y: 200
      }
    }});

    assert.propEqual(sheet2.getSprite('a'), {height: 50, width: 50, x: 200, y: 200}, "We can specify specific names for sprites.");

    assert.throws(function(){sheet.getSprite(0)}, /Found/, "Using a dictionary of sprite data prevents the auto-generation of sprites.");
  });
});