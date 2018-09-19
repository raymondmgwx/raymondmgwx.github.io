/* =========================================================================
 *
 *  GameItems.ts
 *  item
 *
 * ========================================================================= */
/// <reference path="./GameConfig.ts" />
module ECS {
    declare var PIXI: any;

    export class PickUp{
        pickupTextures:any;
        position:any;
        view:any;
        clip:any;
        shine:any;
        width:number;
        height:number;

        count:number;
        isPickedUp:boolean;
        ratio:number;
        pickupPosition:any;
        player:any;

        foodType:FOODMODE;
        constructor(){
            
            this.pickupTextures = ["pickup_01.png", "pickup_02.png", "pickup_03.png", "pickup_04.png", "pickup_05.png", "pickup_06.png", "pickup_07.png", "pickup_08.png"];

            this.position = new PIXI.Point();
            
            this.view = new PIXI.Container();
            this.clip = new PIXI.Sprite(PIXI.Texture.fromFrame(this.pickupTextures[Math.floor(Math.random()*this.pickupTextures.length)]));
            
            this.clip.anchor.x = 0.5;
            this.clip.anchor.y = 0.5;
            
            this.shine = PIXI.Sprite.fromFrame("pickupShine.png");
            this.shine.anchor.x = this.shine.anchor.y = 0.5;

            this.shine.scale.x = this.shine.scale.y *GameConfig.height/GameConfig.fixedHeight;
            this.shine.alpha = 0.5;
            this.view.addChild(this.shine);
            this.view.addChild(this.clip);
            
            this.width = GameConfig.height* 100/GameConfig.fixedHeight
            this.height = GameConfig.height* 100/GameConfig.fixedHeight;
            
            this.count = Math.random() * 300;

        }

        update(){
            if(!this.isPickedUp)
            {
                this.count += 0.1 * GameConfig.time.DELTA_TIME;
                this.clip.scale.x = GameConfig.height* 0.4/GameConfig.fixedHeight + Math.sin(this.count) * 0.1;
                this.clip.scale.y = GameConfig.height* 0.4/GameConfig.fixedHeight - Math.cos(this.count) * 0.1;
                this.clip.rotation = Math.sin(this.count * 1.5) * 0.2;
                
                this.shine.rotation = this.count * 0.2;
            }
            else
            {
                this.view.scale.x = 1-this.ratio;
                this.view.scale.y = 1-this.ratio;
                this.position.x = this.pickupPosition.x + (this.player.position.x - this.pickupPosition.x) * this.ratio;
                this.position.y = this.pickupPosition.y + (this.player.position.y - this.pickupPosition.y) * this.ratio;
            }
            
            this.view.position.x = this.position.x - GameConfig.camera.x;
            this.view.position.y = this.position.y;
            
        }
    }

}