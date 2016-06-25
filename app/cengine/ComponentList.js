/**
 * Created by schenn on 6/23/16.
 */
// Base Component


// Primary Components
import Image from "components/Image.js"
import Renderer from "components/Renderer.js"
import SpriteSheet from "components/SpriteSheet.js"
import Text from "components/Text.js"
import TileMap from "components/TileMap.js"

import KeyPress from "components/KeyPress.js"
import Mouse from "components/Mouse.js"
import Movement from "components/Movement.js"
import PointPlotter from "components/PointPlotter.js"

import Timer from "components/Timer.js"


export default function getComponentList(customComponents = new Map()) {
  var componentList = new Map();
  componentList.set("_", new Map());
  let _ = componentList.get("_");
  _.set("AnimatedSprite", AnimatedSprite);
  _.set("Image",Image);
  _.set("Label",Label);
  _.set("Line",Line);
  _.set("MobileSprite",MobileSprite);
  _.set("Rect",Rect);
  _.set("Sprite",Sprite);
  _.set("TileMap",TileMap);

  componentList.set("functional", new Map());
  let functional = componentList.get("functional");
  functional.set("Animator", Animator);

  componentList.set("ui", new Map());
  let ui = componentList.get("ui");
  ui.set("Button", Button);


  // { 'namespace|name': class reference }
  customEntities.forEach(function(fullName, classRef){
    let name = fullName.split("|");
    if(!componentList.has(name[0])){
      componentList.set(name[0], new Map());
    }
    componentList.get(name[0]).set(name[1], classRef);

  });

  return componentList;
}

