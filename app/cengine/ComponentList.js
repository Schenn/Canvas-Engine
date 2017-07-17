/**
 * Created by schenn on 6/23/16.
 */
// Base Component
import {Component} from "./components/Component.js";

// Renderer Components
import {Renderer} from "./components/Renderer.js";

// Functional Components
import {Timer} from "./components/Timer.js";
import {PointPlotter} from "./components/PointPlotter.js";
import {Movement} from "./components/Movement.js";

// Data Wrapper Components
import {ImageWrapper} from "./components/ImageWrapper.js";
import {SpriteSheetWrapper} from "./components/SpriteSheetWrapper.js";
import {Text} from "./components/Text.js";
import {TileMap} from "./components/TileMap.js";

// UI Components
import {KeyPress} from "./components/KeyPress.js";
import {Mouse} from "./components/Mouse.js";

/**
 * Export a list of component names and their associated Component object.
 *
 * @param customComponents
 * @returns {Map}
 */
export function getComponentList(customComponents = new Map()) {
  var componentList = new Map();

  componentList.set("BaseComponent", Component);

  componentList.set("Renderer", Renderer);
  componentList.set("Timer", Timer);
  componentList.set("PointPlotter", PointPlotter);
  componentList.set("Movement", Movement);

  componentList.set("Image", ImageWrapper);
  componentList.set("SpriteSheet", SpriteSheetWrapper);
  componentList.set("Text", Text);
  componentList.set("TileMap", TileMap);
  componentList.set("KeyPress", KeyPress);
  componentList.set("Mouse", Mouse);

  customComponents.forEach(function(name, classRef){
    componentList.set(name, classRef);

  });

  return componentList;
}

