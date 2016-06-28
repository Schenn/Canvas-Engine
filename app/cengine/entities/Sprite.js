/**
 * @author Steven Chennault <schenn@gmail.com>
 */
/**
 * @typedef {object} LocalParams~SpriteParams
 * @property {object} spritesheets
 * @property {number} height
 * @property {number} width
 * @property {string | number} [defaultSprite]
 */

import Entity from "Entity.js";
import privateProperties from "../engineParts/propertyDefinitions";

/**
 * @class Sprite
 * @memberOf CanvasEngine.Entities
 * @augments CanvasEngine.Entities.Image
 * @borrows CanvasEngine.Components.Renderer as CanvasEngine.Entities.Sprite#components~Renderer
 * @borrows CanvasEngine.Components.SpriteSheet as CanvasEngine.Entities.Sprite#components~SpriteSheetName
 * @borrows CanvasEngine.Components.Image as CanvasEngine.Entities.Sprite#components~ImageName
 * @param {LocalParams~SpriteParams} params
 *
 */
class Sprite extends Entity {
  constructor(params, EntityManager){
    super(params,EntityManager);
    privateProperties[this].currentSpriteName = "";
    privateProperties[this].currentSheet = "default";

    var myParams = {
      draw: ctx => {
        ctx.drawImage(this.getFromComponent(privateProperties[this].currentSheet+"Image", "asObject"));
      }
    };
    Object.assign(myParams, params);

    this.EntityManager.attachComponent(this, "Renderer", myParams);

    for(let sheetName in params.spritesheets){
      let image = {};
      image[sheetName+"Image"] = {
        source: params.spritesheets[sheetName].source(),
        height: params.height,
        width: params.width,
        callback: function(){
          this.Entity.messageToComponent("Renderer", "markDirty");
        }
      };
      let sheet = {};
      sheet[sheetName+"Sheet"]={spritesheet: params.spritesheets[sheetName]};
      this.EntityManager.attachComponent(this, {
        Image:image,
        SpriteSheet:sheet
      });
    }

    this.Sprite = utilities.exists(params.defaultSprite)? params.defaultSprite : 0;
  }

  set Sprite(name){
    privateProperties[this].currentSpriteName = name;
    // Set the current sprite image to nextFrame
    this.messageToComponent(privateProperties[this].currentSheet+"Image",
      "setSprite",
      sprite.getFromComponent(privateProperties[this].currentSheet+"Sheet", "getSprite", name)
    );
  }

  get Sprite(){
    return privateProperties[this].currentSpriteName;
  }

  set Sheet(sheet){
    privateProperties[this].currentSheet = sheet;
  }

  get Sheet(){
    return privateProperties[this].sheet;
  }
}

export default Sprite;