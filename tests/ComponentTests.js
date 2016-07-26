/**
 * Created by schenn on 7/25/16.
 */
/**
 * Load the utilities file through SystemJS and test it.
 * We do it this way to as this will be the method by which the end user retrieves the library
 *  as the es6 Import statements are yet to be implemented.
 */
/**
 * @module CanvasEngine/tests/Components/Component
 */

SystemJS.import('components/Component.js').then(function(m) {
  QUnit.module("Components/Component");
  QUnit.test("Setting and getting a Property", function(assert){
    let component = new m.Component({}, ()=>{});

    component.setProperty("x", 10);

    assert.equal(component.x, 10, "x is a property of the component");
    component.x += 10;
    assert.equal(component.x, 20, "x can have its value changed as its not a locked property.");

    component.setProperty("y", 10, true);
    assert.equal(component.y, 10, "y is a property of the component");
    component.y +=10;
    assert.notEqual(component.y, 20, "y is a locked property and cannot have its value changed.");
  });

  QUnit.test("Changing a Property", function(assert){

    let initial = 10;

    let component = new m.Component({}, (value)=>{
      assert.notEqual(value, initial, "The property changed callback takes the new value as its argument.");
      assert.equal(component.x, value, "The property changed callback takes place after the property is set.");
    });

    component.setProperty("x", 10);
    component.x += 10;

  });

  QUnit.test("Extending the class", function(assert){

    class myComponent extends m.Component {
      constructor(entity){
        super(entity, ()=>{});

        this.setProperty("x",10);
      }

      increment() {
        this.x++;
      }
    }

    let myC = new myComponent({});

    assert.ok(myC instanceof m.Component, "myComponent is an instance of Component");
    assert.ok(myC instanceof myComponent, "myComponent is an instance of myComponent" );
    assert.equal(myC.x, 10, "myComponent has the assigned property");
    myC.increment();
    assert.equal(myC.x, 11, "the assigned property changes based on internal class method.");

  });

});