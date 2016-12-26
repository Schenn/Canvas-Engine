SystemJS.import('components/KeyPress.js').then(function(m) {
  /**
   * We're testing the Base Component object
   * @module CanvasEngine/tests/Entities/Entity
   */
  QUnit.module("Components/KeyPress", {}, ()=>{

    // Can construct
    QUnit.test("Can construct.", function(assert){
      let keypress = new m.KeyPress({},{});

      assert.ok(keypress, "Did Keypress construct ok?");

    });

    QUnit.test("Handles OnKey Events", function(assert){
      let d = assert.async();
      let keypress = new m.KeyPress({
        a: ()=>{
          assert.ok(true, "Did I fire on key press?");
          d();
        }
      },{});

      setTimeout(()=>{
        var p = $.Event("keypress", {keyCode: 97, which:97});
        $(document).trigger(p);
      }, 500);

    });


  });




});