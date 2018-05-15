# Canvas-Engine
An engine for sending game objects to an engine for processing.

The canvas engine allows you to manage the objects in your render space
efficiently and without a lot of stress. It handles collisions, animations,
and other events you'll need for your web game.

To get started,

To connect the cengine script to the project, 

script src='path/to/js/lib.min.js';
script src='path/to/js/cengine.min.js'


To Use:

1. Put a canvas in the document
2. Attach the Canvas Engine to it with 
    CanvasEngine.Screen.setScreen(canvasDomElement);
3. Add a collection of entities or entity data to CanvasEngine.
4. Magic!

To use an entity that's already defined:

1. Pass a collection of plain objects, each containing the type, 
    and any required or optional properties for that entity and its 
    components to CanvasEngine.addMap.  If you pass true as the second
    argument, it will start rendering as soon as those entities have
    been added.
OR
1. Pass the required and optional properties as a json object to 
    CanvasEngine.EntityManager.create(type, properties)
2. You now have an entity in your hands. You can do stuff to it, then
    pass it to CanvasEngine.addEntities in a collection.

To Make your own entity:

1. Create a function that takes an entity and its properties.
    then attaches components to it. 
    (Note an entity can take a component at any time)
2. Give the function to the CanvasEngine with 
    CanvasEngine.EntityManager.setMake(name, builder function);
3. Now you can add it to the stage using the above methods.

To make your own component:

1. Create a function that takes an entity and the components properties.
2. Pass a function that returns an object which represents the 
    functionality in that function to 
    CanvasEngine.EntityManager.addComponent(name, 'new object' function)
3. If you plan on allowing an entity to have multiple instances of that 
    component, you can pass true as the last argument. Then the 
    developer will have to give the component a reference name when 
    they attach it.
    
To attach a component:

1. Pass the entity, the component name, and the component properties to
    CanvasEngine.EntityManager.attachComponent(entity, component, params);

OR

1. Pass the entity and a literal object describing the different components
    and their related params:
    CanvasEngine.EntityManager.attachComponent(entity, {Image: imageParams, Text: textParams})
    
OR

1. Pass the entity and a literal object describing the different components
    and their related params:
    CanvasEngine.EntityManager.attachComponent(entity, 
        {bgPic: {Image: imageParams}, anotherImage:{Image: otherImageParams}} 


About:

Many of the basic jquery rendering methods come from the jCanvas 5.1 
library, written by Caleb Evans, licensed under the MIT License. 
A really great jQuery plugin, however my code deviated quite some time 
ago and I had to remove it save for a small group of rendering methods 
which were just too useful. They have been moved to the enhancedContext 
object.