SystemJS.import('components/Mouse.js').then(function(m) {
  /**
   * Mouse Component Unit Tests
   *
   * Mouse doesn't handle the input reactions like the keypress component.
   *
   * Instead, Mouse is told about mouse events happening somewhere else and responds to those events.
   *
   * This is because canvas has no way to attach a click event to a thing being drawn.
   *  Instead the click events are part of the canvas stack and they in turn tell the system to find entities to deliver
   *    the mouse event to, along with the coordinate of the mouse (currently, the offset within the screen, not the object)
   *
   * Mouse is a callback container not a direct input handler.
   * The callbacks on the mouse container are bound to the attached entity.
   * For example, you can have the callbacks reference public values or components being stored on the entity.
   *
   *
   * @module CanvasEngine/tests/Components/Mouse
   */
  QUnit.module("Components/Mouse", {}, ()=>{

    // Can construct
    QUnit.test("Can construct.", function(assert){
      let mouse = new m.Mouse({},{});

      assert.ok(mouse, "Did Mouse construct ok?");

    });


    QUnit.test("Mouse can take callbacks", function(assert){

      let mouse = new m.Mouse({
        onClick: function(){
          assert.ok(true, "Mouse got click callback in constructor.");
          assert.equal(this.a, 1, "Click callback successfully bound to entity.")
        }
      }, {
        a: 1
      });


      mouse.Click({});
    });

    QUnit.test("Mouse can take callbacks after being created", function(assert){

      let mouse = new m.Mouse({
        onClick: function(){
          assert.ok(true, "Mouse got click callback in constructor.");
        }
      }, {});

      mouse.Click({});

      mouse.addClickMethods([
        function(){
          assert.ok(true, "Mouse got click callback after construction.");
        }
      ]);

      mouse.Click({});
    });

    QUnit.test("Mouse can take a map of callbacks after being created", function(assert){

      let mouse = new m.Mouse({
      }, {});

      mouse.addMouseMethods({
        onClick: function(){
          assert.ok(true, "Mouse got click callback after construction.");
        }
      });

      mouse.Click({});
    });

  });




});