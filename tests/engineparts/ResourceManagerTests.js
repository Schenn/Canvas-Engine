/**
 * Created by schenn on 8/6/16.
 */
SystemJS.import('engineParts/ResourceManager.js').then(function(m) {

  let hopeToBeLoaded;

  /**
   * We're testing the Base Component object
   * @module CanvasEngine/tests/EngineParts/EntityManager
   */
  QUnit.module("EngineParts/ResourceManager", {
    before: function(){
      hopeToBeLoaded = new m.ResourceManager();
      hopeToBeLoaded.ImagePath = "../images";
      hopeToBeLoaded.addImage("img1", "og_image_1.jpg");
      hopeToBeLoaded.finishedAddingResources();
    },
    function(){
      QUnit.test("ResourceManager Constructs", function(assert){
        let rm = new m.ResourceManager();
        assert.ok(rm, "Resource Manager Constructs without issue.");
      });


      /**
       * If the image hasn't finished loading, then it returns a promise.
       *
       * You need to catch whether or not its a promise and handle it as such.
       *
       * The best way to handle these types of heavy resources is to load them all at once,
       *  early in the page load process, then ask for them later once the images have loaded.
       */
      QUnit.test("Can Add Images", function(assert){
        assert.async();
        let rm = new m.ResourceManager();
        rm.ImagePath = "../images";
        rm.addImage("img2", "og_image_2.jpg");
        rm.finishedAddingResources();
        let img = Promise.resolve(rm.getImage("img2"));
        img.then(function(image){
          assert.ok(image, "I should be able to load an image from the resource manager by name.");
          assert.equal(
            image.src,
            "../images/og_image_2.jpg"
            , "Can cache and retrieve images from ResourceManager.");
          done();
        });

      });

      QUnit.test("Can Add SpriteSheets and get a sprite", function(assert){
        let rm = new m.ResourceManager();
        rm.ImagePath= "../images";
        rm.loadResourceCollection([{
          SpriteSheet: {
            name: "test",
            source: "og_image_2.jpg",
            details: {
              height: 50, width: 50
            }
          }
        },{
          SpriteSheet: {
            name: "test 2",
            source: "og_image_1.jpg",
            details: {
              height: 50, width: 50,
              sprites: {
                a:{
                  x:0, y:0
                }
              }
            }
          }
        }], function(){
          assert.ok(rm.getSpriteSheet("test").getSprite(0), "Can get sprite 0 from auto-generated spritesheet");
          assert.ok(rm.getSpriteSheet("test 2").getSprite(a), "Can get sprite a from specific spritesheet");
          assert.notOk(function(){
            rm.getSpriteSheet("test 2").getSprite(0);
          }(), "Can't get sprite 0 from incorrect spritesheet");
          assert.notOk(function(){
            rm.getSpriteSheet("test").getSprite("a");
          }(), "Can't get sprite a from incorrect spritesheet");

        });
      });

      /**
       * QUnit.test("Can Add a sound", function(assert){
   *
   * });
       */
    }
  });



});