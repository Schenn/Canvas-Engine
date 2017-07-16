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

import {Entity} from "../entities/Entity.js";
import * as utilities from "../engineParts/utilities.js";

const privateProperties = new WeakMap();

/**
 * A Sprite is an entity which uses a section of a larger image as its source.
 * It maintains the information needed to render that image section on the screen.
 *
 * @class Sprite
 * @memberOf CanvasEngine.Entities
 * @augments CanvasEngine.Entities.Image
 * @borrows CanvasEngine.Components.Renderer as CanvasEngine.Entities.Sprite#components~Renderer
 * @borrows CanvasEngine.Components.SpriteSheet as CanvasEngine.Entities.Sprite#components~SpriteSheetName
 * @borrows CanvasEngine.Components.Image as CanvasEngine.Entities.Sprite#components~ImageName
 * @param {LocalParams~SpriteParams} params
 *
 */
export class Sprite extends Entity {
  constructor(params, EntityManager){
    super(params,EntityManager);
    privateProperties[this.name] = {};
    privateProperties[this.name].currentSpriteName = "";
    privateProperties[this.name].currentSheet = "default";

    let self = this;

    let myParams = {
      draw: function(ctx){
        ctx.drawImage(
          Object.assign({},
            // this is renderer
            this,
            self.getFromComponent(privateProperties[self.name].currentSheet+"Image", "asObject"))
        );
      }
    };
    Object.assign(myParams, params);

    this.EntityManager.attachComponent(this, "Renderer", myParams);

    let refNames = Object.keys(params.spritesheets);

    refNames.forEach((refName, index)=>{
      let ssheet = params.spritesheets[refName];
      let image = {};
      image[refName+"Image"] = {
        source: ssheet.Source,
        height: params.height,
        width: params.width,
        callback: function(){
          self.messageToComponent("Renderer", "markDirty");
        }
      };
      let sheet = {};
      sheet[refName+"Sheet"]={spritesheet: ssheet};
      this.EntityManager.attachComponent(this, {
        Image:image,
        SpriteSheet:sheet
      });
    });

    this.Sprite = utilities.exists(params.defaultSprite)? params.defaultSprite : 0;
  }

  set Sprite(name){
    privateProperties[this.name].currentSpriteName = name;
    // Set the current sprite image to nextFrame
    this.messageToComponent(privateProperties[this.name].currentSheet+"Image",
      "setSprite",
      this.getFromComponent(privateProperties[this.name].currentSheet+"Sheet", "getSprite", name)
    );
  }

  get Sprite(){
    return privateProperties[this.name].currentSpriteName;
  }

  set Sheet(sheet){
    privateProperties[this.name].currentSheet = sheet;
  }

  get Sheet(){
    return privateProperties[this.name].sheet;
  }
}