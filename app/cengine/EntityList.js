/**
 * Created by schenn on 6/23/16.
 */
// Primary Entities
import AnimatedSprite from "entities/AnimatedSprite.js"
import Image from "entities/Image.js"
import Label from "entities/Label.js"
import Line from "entities/Line.js"
import MobileSprite from "entities/MobileSprite.js"
import Rect from "entities/Rect.js"
import Sprite from "entities/Sprite.js"
import TileMap from "entities/Tilemap.js"

// Functional Entities
import Animator from "entities/Animator.js"

// UI Entities
import Button from "entities/Button.js";

export default function getClassList(customEntities = new Map()) {
  var classList = new Map();
  classList.set("_", new Map());
  let _ = classList.get("_");
  _.set("AnimatedSprite", AnimatedSprite);
  _.set("Image",Image);
  _.set("Label",Label);
  _.set("Line",Line);
  _.set("MobileSprite",MobileSprite);
  _.set("Rect",Rect);
  _.set("Sprite",Sprite);
  _.set("TileMap",TileMap);

  classList.set("functional", new Map());
  let functional = classList.get("functional");
  functional.set("Animator", Animator);

  classList.set("ui", new Map());
  let ui = classList.get("ui");
  ui.set("Button", Button);


  // { 'namespace|name': class reference }
  customEntities.forEach(function(fullName, classRef){
    let name = fullName.split("|");
    if(!classList.has(name[0])){
      classList.set(name[0], new Map());
    }
    classList.get(name[0]).set(name[1], classRef);

  });

  return classList;
}

