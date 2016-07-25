/**
 * Created by schenn on 6/23/16.
 */
// Base Entity
import {Entity} from "entities/Entity.js";

// Primary Entities
import {ImageEntity} from "entities/Image.js";
import {Sprite} from "entities/Sprite.js";
import {Label} from "entities/Label.js";
import {Line} from "entities/Line.js";
import {Rect} from "entities/Rect.js";
import {TileMap} from "entities/TileMap.js";

// Functional Entities
import {Animator} from "entities/Animator.js";

// Extended Entities
import {AnimatedSprite} from "entities/AnimatedSprite.js";
import {MobileSprite} from "entities/MobileSprite.js";

// UI Entities
import {Button} from "entities/Button.js";

/**
 * Get the list of classes.
 *
 * @param {Map} customEntities A collection of entities custom to your game or animation.
 * @returns {Map}
 */
export function getClassList(customEntities = new Map()) {
  var classList = new Map();
  classList.set("BaseEntity", Entity);

  classList.set("Image",ImageEntity);
  classList.set("Sprite",Sprite);
  classList.set("Label",Label);
  classList.set("Line",Line);
  classList.set("Rect",Rect);
  classList.set("TileMap",TileMap);

  classList.set("Animator", Animator);

  classList.set("AnimatedSprite", AnimatedSprite);
  classList.set("MobileSprite",MobileSprite);

  classList.set("Button", Button);


  // { 'namespace|name': class reference }
  customEntities.forEach(function(name, classRef){
    classList.set(name, classRef);
  });

  return classList;
}

