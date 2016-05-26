(function(){
  /**
   * A "locked" object property
   *    A locked property cannot be changed once set.
   * @param val The value to set the property to.
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
   * @param privateVar The private variable to reference for getting and setting a value.
   * @param callback Called when the value is changed. The new value is passed as an argument into the function.
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
   * @constructor
   * @class
   */
  var EntityManager = function(){
    var baseEntityGenerator;
    var make = {};
    var components = {};
    var nComponents = [];
    var dependentEntities = {};

    var baseEntity;

    /**
     * The different types of object properties
     * @type {{lockedProperty: lockedProperty, defaultProperty: defaultProperty}}
     */
    this.properties = {
      lockedProperty: lockedProperty,
      defaultProperty: defaultProperty
    };

    /**
     * Set the function which produces the base Entity class
     * @method
     * @param generateFunc
     */
    this.setBaseEntityGenerator = function(generateFunc){
      baseEntityGenerator = generateFunc;
      baseEntity = generateFunc({});
    };

    /**
     * Is the given object an "Entity" class?
     * @param ent
     * @returns {boolean}
     */
    this.isEntity = function(ent){
      return baseEntity instanceof ent;
    };

    /**
     * Create an entity
     *
     * @param type the type of entity to create
     * @param params The data needed to create that entity and its components
     * @method
     * @returns {*} The requested Entity
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
      }



      return entity;
    };

    /**
     * Set a Make function.
     *
     * The make function provides instructions on how to take a base entity and transform it into a specified type.
     *  The make function needs to return the completed entity.
     * @method
     * @param name The name of the entity that this instruction function creates
     * @param func The instructions function
     *    (A base entity or the extended entity are passed as an argument into the instruction function.)
     * @param from The name of the entity that this entity extends from.
     *
     * @returns {EntityManager} For chaining
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
     * Add a component to Entity Manager's Component Storage
     *  To attach a component to an entity, see EntityManager.attachComponent
     *
     * The component function contains the constructor for a given component.
     *  The constructor function needs to return the component.
     *
     * @method
     * @param name The name of the component
     * @param func The constructor function
     * @param notUnique If can be attached multiple times to the same entity.
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
     * @method
     * @param entity The entity to attach components to.
     * @param component The components to add.
     * @param params The arguments for the components.
     * @returns {EntityManager}
     */
    this.attachComponent = function(entity, component, params){
      if($.type(component) == "string") {
        if (Object.keys(components).indexOf(component) != -1) {
          entity.attachComponent(component, components[component](params, entity));
        }
      } else if($.type(component) == "object") {
        var coms = Object.keys(component);
        for(var c = 0; c< coms.length; c++){
          var com = coms[c];
          if($.type(component[com]) == "object"){
            var names = Object.keys(component[com]);
            for(var n=0; n < names.length; n++){
              // Whew!
              entity.attachComponent(names[n], components[com](component[com][names[n]], entity));
            }
          } else if($.type(component[com]) == "string"){
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
     * @param screenMap The array of entities
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
})();