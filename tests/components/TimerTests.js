/**
 * Created by schenn on 7/25/16.
 */
/**
 * Load the utilities file through SystemJS and test it.
 * We do it this way to as this will be the method by which the end user retrieves the library
 *  as the es6 Import statements are yet to be implemented.
 */


SystemJS.import('components/Timer.js').then(function(m) {
  /**
   * We're testing the Base Component object
   * @module CanvasEngine/tests/Components/Component
   */
  QUnit.module("Components/Timer", {}, ()=>{

    QUnit.test("Can Construct a Timer", function(assert){
      assert.ok(new m.Timer({},{}), "Can construct a timer.");
    });

    QUnit.test("Timer updates on update", function(assert){
      let t = new Date();
      let upd = new m.Timer({},{});
      let d = assert.async();
      setTimeout(()=>{
        upd.update();

        assert.notEqual(t.getTime(), upd.MS, "Timer has moved ahead by a second or so.");

        d();
      }, 1000);
    });

    QUnit.test("Timer's delta time returns the difference between now and then", function(assert){
      let t = new Date();
      let delt = new m.Timer({},{});
      let d = assert.async();
      setTimeout(()=>{
        delt.update();

        assert.notEqual(t.getTime(), delt.MS, "Timer has moved ahead by a second or so.");

        let delta = (delt.MS - t.getTime())/1000;
        assert.ok(delt.deltaTime <= delta + 0.01 && delt.deltaTime >= delta - 0.01, "Does the timer delta time return the correct ms difference?");

        d();
      }, 1000);
    });

    QUnit.test("Timer can do something when time has elapsed.", function(assert){
      let t = new Date();
      let d = assert.async();
      let duration = 1000;

      let elp = new m.Timer({
        duration: duration,
        onElapsed: (s)=>{
          assert.ok(s, "Was triggered after elapsed time!");
          let delta = (elp.MS - t.getTime())/1000;
          assert.equal(s, 0.5, "Got passed time since last update called in onElapsed.");
          assert.ok(s*1000 <= 505 && s*1000 >= 495, "Delta time passed in is since last update was called.");
          assert.ok(delta *1000 >= duration, "Timers Duration determines when the onElapsed method will fire.");
          clearInterval(i);
          d();
        }
      },{});

      let i = setInterval(()=>{
        elp.update();
      }, 500);
    });


    QUnit.test("Timer can do something repeatedly.", function(assert){
      let d = assert.async();
      let duration = 1000;

      let count = 0;
      let lastCount = 0;

      let rpt = new m.Timer({
        duration: duration,
        onUpdate: (s)=>{
          assert.ok(s, "Was triggered after elapsed time!");

          assert.ok(s >= 0.49 && s <= 0.51, "Got passed time since last update called in onUpdate.");

          lastCount = count;
          count++;
          assert.notEqual(count, lastCount, "Count should have incremented.");
          if(count >=5){
            assert.ok(true, "Did same task multiple times. Lets stop updating.");
            clearInterval(j);
            d();
          }

        }
      },{});

      let j = setInterval(()=>{
        rpt.update();
      }, 500);
    });

  });


});