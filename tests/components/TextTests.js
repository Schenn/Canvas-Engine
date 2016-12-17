SystemJS.import('components/Text.js').then(function(m) {
  /**
   * We're testing the Base Component object
   * @module CanvasEngine/tests/Entities/Entity
   */
  QUnit.module("Components/Text", {}, ()=>{
    QUnit.test("Can construct Text Component", function(assert){
      let txt = new m.Text({},{});

      assert.ok(txt, "Text component constructed ok.");
    });

    QUnit.test("Text component can get and set font", function(assert){
      let txt = new m.Text({},{});

      assert.equal(txt.fontFamily, "sans-serif", "Does Text font family match expected default?");
      assert.equal(txt.fontSize, '12pt', "Does Text font size match expected default?");
      assert.equal(txt.fontWeight, 'normal', "Does Text font weight match expected default?");

      txt.font = "Times New Roman 18px bold";

      assert.equal(txt.fontFamily, "Times New Roman", "Does Text font family match changed value?");
      assert.equal(txt.fontSize, '18px', "Does Text font size match changed value?");
      assert.equal(txt.fontWeight, 'bold', "Does Text font weight match changed value?");

      // Notice the change to the structure.
      // This is how the font will be returned when asked for and when sent to the canvas for drawing.
      assert.equal(txt.font, "bold 18px Times New Roman", "Does Text font match changed value?");

    });

    QUnit.test("Text Component can get and set text", function(assert){
      let txt = new m.Text({},{});
      assert.equal(txt.text, "", "Text has no default value.");

      txt.text = "A new value!";
      assert.equal(txt.text, "A new value!", "Text should change.");

    });

  });



});