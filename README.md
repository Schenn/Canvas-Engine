# Canvas-Engine
An engine for sending game objects to an engine for processing.

The canvas engine allows you to manage the objects in your render space
efficiently and without a lot of stress. It handles collisions, animations,
and other events you'll need for your web game.

To get started,

run bower install to install the dependencies.
run grunt compile to compile out the dependencies and primary files.

To run the project, 
include a src link to cengine.min.js, then plugins.min.js

To add a bower library, run grunt installLibrary libraryName. This will 
recompile the dependencies file after installing the new library.

To Use:

1. Put a canvas in the document.
2. Create your init object (See Below)
3. Attach the Canvas Engine to it with $(myCanvasSelector).attachCanvasEngine(init);
4. Magic!
 