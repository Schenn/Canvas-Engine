/**
 * @author Steven Chennault <schenn@gmail.com>
 */
/**
 * @namespace LocalParams
 */
/**
 * @namespace Callbacks
 */
/**
 * Optional CreateParams which trigger specific functionality
 *
 * @typedef {object} LocalParams~CreateParams
 * @property {string | Image } [image] - The name of the Image resource to utilize
 * @property {string | Object } [spritesheet] - The name of the SpriteSheet resource to utilize
 * @property {string | Array } [spritesheets] - A collection of spritesheets to utilize.
 * @property {number} [z_index] - The z-index the entity will live at
 * @property {Object} [keys] - The alphanumeric keys that your entity will listen for and their callback methods.
 * @property {Callbacks~onMouse | Callbacks~onMouse[]} [onClick] - The callback method(s) your entity will trigger when clicked.
 * @property {Callbacks~onMouse | Callbacks~onMouse[]} [onMouseDown] - The callback method(s) your entity will trigger when the mouse is down over it.
 * @property {Callbacks~onMouse | Callbacks~onMouse[]} [onMouseUp] - The callback method(s) your entity will trigger when the mouse button is released over it.
 * @property {Callbacks~onMouse | Callbacks~onMouse[]} [onMouseOver] - The callback method(s) your entity will trigger when the mouse is sitting over it
 * @property {Callbacks~onMouse | Callbacks~onMouse[]} [onMouseMove] - The callback method(s) your entity will trigger when the mouse is moving over it.
 *
 */

/**
 * @callback Callbacks~onPropertyChanged
 * @param {*} value The new Value
 */

(function(CanvasEngine){
  /**
   * The make functions for entities.
   *  These methods describe how to create an Entity
   *
   * @namespace Entities
   * @memberof CanvasEngine
   */
  var make = {};

  /**
   * The constructor functions for components
   *  These methods create a component.
   *
   * @namespace Components
   * @memberof CanvasEngine
   */
  var components = {};

  /**
   * @namespace Properties
   * @memberOf CanvasEngine
   */
  /**
   * A "locked" object property
   *    A locked property cannot be changed once set.
   *
   * @param {*} val The value to set the property to.
   * @memberof Properties
   * @returns {{enumerable: boolean, writable: boolean, configurable: boolean, value: *}}
   */
  function lockedProperty(val){
    return {
      enumerable: true,
      writable: false,
      configurable: false,
      value: val
    };
  }

  /**
   * A "Default" object property.
   *
   * @memberof Properties
   * @param {*} privateVar The private variable to reference for getting and setting a value.
   * @param {function} callback Called when the value is changed. The new value is passed as an argument into the function.
   * @returns {{enumerable: boolean, configurable: boolean, get: get, set: set}}
   */
  function defaultProperty(privateVar, callback) {
    return {
      enumerable: true,
      configurable: false,
      get: function () {
        return privateVar;
      },
      set: function (val) {
        if(typeof(privateVar)=="number"){
          val = Number(val);
        } else if (typeof(privateVar) == "string"){
          val = val.toString();
        } else if(typeof(privateVar) == "boolean"){
          val = Boolean(val);
        }
        privateVar = val;
        if(CanvasEngine.utilities.isFunction(callback)){
          callback(val);
        }
      }
    };
  }

  /**
   * The EntityManager handles the creation of Entities and components
   *
   * @class
   * @memberof CanvasEngine
   * @inner
   * @borrows CanvasEngine.Entities.Entity as baseEntity
   */
  var EntityManager = function(){
    var baseEntityGenerator;


    var nComponents = [];
    var dependentEntities = {};

    var baseEntity;

    /**
     * The different types of object properties
     * @type {{lockedProperty: CanvasEngine.Properties.lockedProperty, defaultProperty: CanvasEngine.Properties.defaultProperty}}
     */
    this.properties = {
      lockedProperty: lockedProperty,
      defaultProperty: defaultProperty
    };

    /**
     * Set the function which produces the base Entity class
     * @param {function} generateFunc
     */
    this.setBaseEntityGenerator = function(generateFunc){
      baseEntityGenerator = generateFunc;
      baseEntity = generateFunc({});
    };

    /**
     * Is the given object an "Entity" class?
     * @param {CanvasEngine.Entities.Entity} ent
     * @returns {boolean}
     */
    this.isEntity = function(ent){
      return baseEntity instanceof ent;
    };

    /**
     * Create an entity
     *
     * @param {string} type the type of entity to create
     * @param {LocalParams~CreateParams} params The data needed to create that entity and its components
     *
     * @returns {Entity} The requested Entity after being 'made' with its make function
     */
    this.create = function(type, params){

      var createType = function(aType){
        return make[aType](baseEntityGenerator(params), params);
      };

      // Replace image, sound and SpriteSheet params with their values from the ResourceManager
      if(CanvasEngine.utilities.exists(params.image)){
        params.image = CanvasEngine.ResourceManager.getImage(params.image);
      }

      if(CanvasEngine.utilities.exists(params.spritesheet) && typeof(params.spritesheet) === "string"){
        params.spritesheet = CanvasEngine.ResourceManager.getSpriteSheet(params.spritesheet);
      } else if(CanvasEngine.utilities.exists(params.spritesheets)){
        $.each(params.spritesheets, function(refName,sheetName){

          if(typeof(sheetName) === 'string') {
            params.spritesheets[refName] = CanvasEngine.ResourceManager.getSpriteSheet(sheetName);
          }
        });
      }

      // Make sure that the z_index is set properly
      if(!CanvasEngine.utilities.exists(params.z_index)){
        params.z_index = CanvasEngine.EntityTracker.maxZ();
      }

      // Create the entity
      var entity;

      if(CanvasEngine.utilities.exists(dependentEntities[type])) {
        entity = make[type](this.create(dependentEntities[type], params), params);
      } else {
        entity = createType(type);
      }

      // Attach the click and other event handling components.
      if(CanvasEngine.utilities.exists(params.onClick) ||
        CanvasEngine.utilities.exists(params.onMouseOver) ||
        CanvasEngine.utilities.exists(params.onMouseUp) ||
        CanvasEngine.utilities.exists(params.onMouseDown) ||
        CanvasEngine.utilities.exists(params.onMouseMove)){

        this.attachComponent(entity, "Mouse", params);
        // Don't re-attach the mouse component on any child entities.
        //  (Otherwise their methods will get fired for each dependent entity)
        delete params.onClick;
        delete params.onMouseOver;
        delete params.onMouseUp;
        delete params.onMouseDown;
        delete params.onMouseMove;
      }

      if(CanvasEngine.utilities.exists(params.keys)){
        this.attachComponent(entity, "KeyPress", params.keys);
        // Don't re-attach the keypress component on any child entities.
        //  (Otherwise their methods will get fired for each dependent entity)
        delete params.keys;
      }

      return entity;
    };

    /**
     * Set a Make function.
     *
     * The make function provides instructions on how to take a base entity and transform it into a desired object.
     *  The make function should return the completed entity.
     *
     * @param {string} name The 'type' of the entity that this function constructs
     * @param {function} func The Make function
     * @param {string} [from] The name of the entity that this entity extends from.
     *
     * @returns {EntityManager} for chaining
     */
    this.setMake = function(name, func, from){
      if(Object.keys(make).indexOf(name) === -1 ){
        make[name] = func;
      }

      if(CanvasEngine.utilities.exists(from)){
        dependentEntities[name]=from;
      }
      return this;
    };

    /**
     * Add a component to Entity Manager's Component Constructor Storage
     *
     * The component function should construct a given component
     *
     * @param {string} name The name of the component
     * @param {function} func The constructor function
     * @param {boolean} [notUnique] If can be attached multiple times to the same entity.
     *
     * @returns {EntityManager}
     */
    this.addComponent = function(name, func, notUnique){
      if(Object.keys(components).indexOf(name) === -1)
        components[name] = func;

      if(notUnique)
        nComponents.push(name);

      return this;
    };

    /**
     * Attach a component to an entity
     *
     * Attach a component or components to a given entity.
     *
     * @param {CanvasEngine.Entities.Entity} entity The entity to attach components to.
     * @param {string | Object.<string, Object> | Object.<string, string> } component The components to add.
     * @param {Object} [params] The arguments for the components. Optional if you use the Object.<string, Object> argument.
     *
     * @returns {EntityManager}
     */
    this.attachComponent = function(entity, component, params){
      // component === "componentName"

      if($.type(component) == "string") {
        if (Object.keys(components).indexOf(component) != -1) {
          entity.attachComponent(component, components[component](params, entity));
        }
      } else if($.type(component) == "object") {
        /** component = { "componentName" : data } */
        var coms = Object.keys(component);
        for(var c = 0; c< coms.length; c++){
          var com = coms[c];
          if($.type(component[com]) == "object"){
            /** component = {"componentName" : {"name to use" : data }} */
            var names = Object.keys(component[com]);
            for(var n=0; n < names.length; n++){
              // Whew!
              entity.attachComponent(names[n], components[com](component[com][names[n]], entity));
            }
          } else if($.type(component[com]) == "string"){
            /** component = {"componentName" : "name to use"} */
            var name = component[name];
            if (Object.keys(components).indexOf(com) != -1 && nComponents.indexOf(com) > -1) {
              entity.attachComponent(name, components[com](params, entity));
            }
          }
        }
      }

      return this;
    };

    /**
     * Convert an array of json data to an array of Entities
     *
     * @param {Array} screenMap The array of entities
     * @return {Array}
     */
    this.fromMap = function(screenMap){
      var entities = [];

      $.each(screenMap, function(index, data){
        var entity = CanvasEngine.EntityManager.create(data.type, data);
        if(!CanvasEngine.utilities.exists(entities[entity.z_index])){
          entities[entity.z_index] = [];
        }

        entities[entity.z_index].push(entity);
      });

      return entities;
    };
  };

  // Attach the EntityManager to our CanvasEngine
  CanvasEngine.EntityManager = new EntityManager();
})(window.CanvasEngine);