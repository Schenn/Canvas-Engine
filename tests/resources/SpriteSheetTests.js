/**
 * Created by schenn on 8/6/16.
 */
import {SpriteSheet} from "resources/SpriteSheet.js";

let objectSheet = new SpriteSheet({
  height: 50, width: 50,
  source: new Image("../images/og_image_2.jpg"),
  sprites: {
    a: {
      x: 200, y: 200
    }
  }
});

  /**
   * We're testing the Base Component object
   * @module CanvasEngine/tests/EngineParts/EntityManager
   */
  QUnit.module("Resources/SpriteSheet", {
    before: function(){
        this.image1 = new Image();
        this.image1.src = "../images/og_image_1.jpg";

        this.image2 = new Image();
        this.image2.src = "../images/og_image_2.jpg";

      }
    },
    ()=>{
    /**
     * Ensure that we can't create a SpriteSheet without properly constructed arguments
     */
    QUnit.test("SpriteSheet requires arguments to construct", function (assert) {
      assert.throws(function () {
        let sheet = new SpriteSheet();
      }, undefined, "No arguments provided");

      assert.throws(function () {
        let sheet = new SpriteSheet({});
      }, /Missing/, "SpriteSheet won't construct without a provided sprite height and width");

      assert.ok(function () {
        let sheet = new SpriteSheet({height: 50, width: 50});
      }, "Sheet constructs ok with just a height and width.");

      assert.ok(function () {
        let image = new Image();
        image.src = "../images/og_image_1.jpg";
        let sheet = new SpriteSheet({height: 50, width: 50, source: image});
      }, "Sheet constructs ok with a height, width, and source.");

    });

    /**
     * Ensure that a SpriteSheet can process an image into sprites
     */
    QUnit.test("SpriteSheet can process a collection of sprites", function (assert) {

      assert.ok(function () {
        let sheet = new SpriteSheet({height: 50, width: 50});
        sheet.source = this.image1;
      }, "SpriteSheet will take a source after construct, then use that source to generate its sprites");

      assert.ok(function () {
        let sheet = new SpriteSheet({height: 50, width: 50, source: this.image1});
      }, "SpriteSheet doesn't fail to load with an image, regardless of whether the image has finished loading or not.");
    });

    /**
     * Ensure that a SpriteSheet source can't be corrupted
     */
    QUnit.test("SpriteSheet source is protected from pollution", function (assert) {

      assert.throws(function () {

        let sheet = new SpriteSheet({height: 50, width: 50, source: this.image1});
        sheet.Source = this.image2;
      }, /Source/, "SpriteSheet throws if you try to change its source.");

      assert.throws(function () {
        let sheet = new SpriteSheet({height: 50, width: 50, source: ""});
      }, /js/, "SpriteSheet throws if the provided source isn't an Image object");
    });


    /**
     * Ensure we can retrieve sprites from a SpriteSheet.
     */
    QUnit.test("SpriteSheet contains accessible sprites!", function (assert) {
      let done = assert.async();
      let a = objectSheet.getSprite("a");
      a = Promise.resolve(a).then((sprite)=> {
        if (sprite instanceof Error) {
          throw sprite.msg;
        }
        console.log(sprite);
        assert.ok(sprite, "a should be found in our spritesheet.");
        assert.propEqual(
          sprite,
          {
            height: 50, width: 50, x: 200, y: 200
          },
          "If we wait for the sprites to finish generating, we can specify specific names for sprites."
        );
        done();
      });
    });
  });