/**
 * Created by schenn on 7/25/16.
 */
/**
 * Load the utilities file through SystemJS and test it.
 * We do it this way to as this will be the method by which the end user retrieves the library
 *  as the es6 Import statements are yet to be implemented.
 */


SystemJS.import('components/Movement.js').then(function(m) {
  /**
   * Testing the Movement Component
   *
   * @module CanvasEngine/tests/Components/Component
   */
  QUnit.module("Components/Movement", {}, ()=> {


    QUnit.test("Can Construct", function (assert) {
      assert.throws(()=>{new m.Movement({}, {})}, /origin/, "Movement can't construct without a point of origin.");

      assert.ok(new m.Movement({x:1, y:1}, {}), "Movement can construct with a starting point.");

    });

    QUnit.test("Adjusts x and y based on speed and time.", function(assert){
      let move = new m.Movement({x:1, y:1}, {});

      assert.equal(move.x, 1, "Movement Component has correct starting location.");
      move.move();
      assert.equal(move.x, 1, "Without a speed, movement can't adjust its location.");
      move.setSpeed({xSpeed: 10});
      move.move();
      assert.equal(move.x, 11, "Setting the speed allows movement to adjust its location on move.");
      move.move(0.5);
      assert.equal(move.x, 16, "Passing in the delta time in seconds adjusts the movement relative to the speed in seconds.");


    });


    QUnit.test("Movement understands it's direction and triggers a callback if its direction changes.", function(assert){

      let dirTeller = new m.Movement({x:1, y:1, xSpeed: 10},{});
      dirTeller.move();
      assert.equal(dirTeller.getDirection().direction, "E", "Movement can tell when its travelling East.");

      dirTeller.setSpeed({xSpeed: -10, ySpeed: 0});
      dirTeller.move();
      assert.equal(dirTeller.getDirection().direction, "W", "Movement can tell when its travelling West.");

      dirTeller.setSpeed({xSpeed: 0, ySpeed: 10});
      dirTeller.move();
      assert.equal(dirTeller.getDirection().direction, "S", "Movement can tell when its travelling South.");

      dirTeller.setSpeed({xSpeed: 0, ySpeed: -10});
      dirTeller.move();
      assert.equal(dirTeller.getDirection().direction, "N", "Movement can tell when its travelling South.");

      dirTeller.setSpeed({xSpeed: 10, ySpeed: 10});
      dirTeller.move();
      assert.equal(dirTeller.getDirection().direction, "SE", "Movement can tell when its travelling SouthEast.");

      dirTeller.setSpeed({xSpeed: -10, ySpeed: 10});
      dirTeller.move();
      assert.equal(dirTeller.getDirection().direction, "SW", "Movement can tell when its travelling SouthWest.");

      dirTeller.setSpeed({xSpeed: 10, ySpeed: -10});
      dirTeller.move();
      assert.equal(dirTeller.getDirection().direction, "NE", "Movement can tell when its travelling NorthEast.");

      dirTeller.setSpeed({xSpeed: -10, ySpeed: -10});
      dirTeller.move();
      assert.equal(dirTeller.getDirection().direction, "NW", "Movement can tell when its travelling NorthEast.");


      let d = assert.async();
      let change = new m.Movement({x:1, y:1,xSpeed: -10,
        onDirectionChange:function(dir){
          assert.equal(dir.direction, "W", "Got expected direction.");
          assert.ok(true, "Got callback on direction change!");
          d();
      }}, {});

      // Needs to move once to set the current direction.  A non-moving thing has no 'direction'.
      change.move();
      // Moving 'changes' the direction from 'nothing' to 'west'

    });

    QUnit.test("Movement Component can understand when its reached a destination.", function(assert){

      let dest = new m.Movement({
        x:0, y:0
      },{});

      dest.travel({
        x: 100, y:100, speed:10
      });

      for(let i = 0; i < 20; i++){
        dest.move();
      }

      // If I had moved 20 times without a destination, I would be at x:200.
      assert.ok(dest.x === 100, "I should have reached x:100 and stopped!.");

    });
  });
});