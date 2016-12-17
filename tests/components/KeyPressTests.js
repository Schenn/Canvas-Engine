SystemJS.import('components/ImageWrapper.js').then(function(m) {
  /**
   * We're testing the Base Component object
   * @module CanvasEngine/tests/Entities/Entity
   */
  QUnit.module("Components/ImageWrapper");

  // Can't construct
  QUnit.test("ImageWrapper requires source parameter.", function(assert){
    assert.throws(function(){
      let em = new m.ImageWrapper({},{});
    }, /Source/, "ImageWrapper won't construct without a source.");
  });

  // Can construct
  QUnit.test("Can construct.", function(assert){
    let img = new m.ImageWrapper({
      'source': "../images/arrowsprites.png"
    },{});

    assert.ok(img, "Did ImageWrapper construct ok?");

  });


  // Gets correct information regarding image
  QUnit.test("Returns accurate Information", function(assert){
    let img = new m.ImageWrapper({
      'source': "../images/arrowsprites.png"
    },{});

    assert.equal(img.source, "../images/arrowsprites.png", "Does image return correct source string?");

    let b = new m.ImageWrapper({
      'source': "../images/arrowsprites.png",
      sx:50, sy:75,
      sWidth: 25, sHeight: 35
    },{});

    assert.equal(b.sx, 50, "Does image return correct property value?");

    let c = new m.ImageWrapper({
      'source': "../images/arrowsprites.png",
      x:50, y:75,
      width: 25, height: 35
    },{});

    assert.equal(c.sx, 50, "Does image return correct property value, even when passed in as a sprite object?");
  });

  // Can set sprite dimensions
  QUnit.test("Can Set Sprite Dimensions", function(assert){
    let img = new m.ImageWrapper({
      'source': "../images/arrowsprites.png"
    },{});

    img.setSprite({
      x: 50, y: 100, height: 100, width: 100
    });
    assert.equal(img.sx, 50, "Does the image wrapper return the value after changing?");
  });

  // Can't set negative numbers on important values
  QUnit.test("Can't set negative numbers on important values", function(assert){
    assert.throws(function(){new m.ImageWrapper({
      'source': "../images/arrowsprites.png",
      x:50, y:75,
      width: -25, height: -35
    },{})}, /negative/, "Did ImageWrapper catch the negative width and height?");

    let img = new m.ImageWrapper({
      'source': "../images/arrowsprites.png"
    },{});

    assert.throws(function(){img.setSprite({
      x:50, y:75,
      width: -25, height: -35
    })}, /negative/, "Did ImageWrapper catch the negative width and height when setting a sprite?");


  });

});