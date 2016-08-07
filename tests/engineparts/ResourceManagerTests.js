/**
 * Created by schenn on 8/6/16.
 */
SystemJS.import('engineParts/ResourceManager.js').then(function(m) {
  /**
   * We're testing the Base Component object
   * @module CanvasEngine/tests/EngineParts/EntityManager
   */
  QUnit.module("EngineParts/ResourceManager");

  QUnit.test("ResourceManager Constructs", function(assert){
    assert.ok(function(){
      let rm = new m.ResourceManager();
    }, "Resource Manager Constructs without issue.");
  });

  QUnit.test("Can Add Images", function(assert){
    assert.ok(function(){
      let rm = new m.ResourceManager();
      rm.setImagePath("../images");
      rm.addImage("og_image_2.jpg");
      let img = rm.getImage("og_image_2.jpg");
    }, "Can cache and retrieve images from ResourceManager.")
  });

  QUnit.test("Can Add SpriteSheets and get a sprite", function(assert){
    assert.ok(function(){
      let rm = new m.ResourceManager();
      rm.setImagePath("../images");
      rm.loadResourceCollection([{
        SpriteSheet: {
          name: "test",
          source: "og_image_2.jpg",
          details: {
            height: 50, width: 50
          }
        }
      }], function(){
        rm.getSpriteSheet("test").getSprite(0);
      });
    });
  });

  /**
   * QUnit.test("Can Add a sound", function(assert){
   *
   * });
   */

});