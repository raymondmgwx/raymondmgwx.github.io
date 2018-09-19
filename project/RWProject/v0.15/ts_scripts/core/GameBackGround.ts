/* =========================================================================
 *
 *  GameBackGround.ts
 *  game view scene - background
 *
 * ========================================================================= */
/// <reference path="./System.ts" />
module ECS {
    declare var PIXI:any;

    export class BackGroundElement{
        sprites:any;
        spriteWidth:number;
        spriteHeight:number;
        speed;number;
        constructor(texture:any){
            this.sprites = [];
            this.spriteWidth = texture.width-5;
            this.spriteHeight = GameConfig.height*4/5;
            var amount =3;

            for (var i=0; i < amount; i++) 
            {
                var sprite = new PIXI.Sprite(texture);
                sprite.height = GameConfig.height*4/5;
                sprite.position.y = 0;
                this.sprites.push(sprite);
            };	
                          
            this.speed = 1;
        }

        setPosition(position:any){
            var h = this.spriteWidth;
            
            for (var i=0; i < this.sprites.length; i++) 
            {
                var pos = -position * this.speed;
                pos += i *  h ;
                pos %=  h * this.sprites.length ;
                
                pos += h/2;
                if(!GameConfig.device.desktop)pos += h/2;

                this.sprites[i].position.x = pos;
            };	
        }
    }

    export class GameBackGroundSystem extends System{

        width:number;
        scrollPosition:number;
        bgTex:BackGroundElement;
        rearSilhouette:any;
        rearCanopy:BackGroundElement;
        farCanopy:BackGroundElement;
        roofLeaves:BackGroundElement;
        frontSilhouette:BackGroundElement;

        groundAssetList:any;
        groundSpriteList:any;

        cloud1:any;
        cloud2:any;
        BackGroundContainer:any;

        constructor(){
                super("view-background")
                this.BackGroundContainer = new PIXI.Container();

                this.width = GameConfig.width;
                this.scrollPosition = GameConfig.camera.x;

                var bgTex = PIXI.loader.resources["img/bg_up.png"].texture;
                if(!GameConfig.device.desktop)bgTex = PIXI.loader.resources["img/bg_up_ios.png"].texture;

                this.bgTex = new BackGroundElement(bgTex);
                for(var i=0;i<this.bgTex.sprites.length;i++){
                    this.BackGroundContainer.addChild(this.bgTex.sprites[i]);
                }

                this.groundAssetList =[
                    "obstacle all-11.png",
                    "tree1.png",
                    "obstacle all-13.png",
                    "tree2.png"
                ];
                this.groundSpriteList = [];

                for(var i=0;i<this.groundAssetList.length;i++){
                    var gSprite =  PIXI.Sprite.fromFrame(this.groundAssetList[i]);
                    gSprite.anchor.x = 0.5;
                    gSprite.anchor.y = 0.5;
                    gSprite.width = 140*GameConfig.height /GameConfig.fixedHeight;
                    gSprite.height = 240*GameConfig.height /GameConfig.fixedHeight;
                    gSprite.position.y = this.bgTex.spriteHeight - gSprite.height/2;
                    this.BackGroundContainer.addChild(gSprite);
                    this.groundSpriteList.push(gSprite);
                }

                this.cloud1 = PIXI.Sprite.fromFrame("cloud1.png");
                this.cloud1.position.y = GameConfig.height/5;
                this.BackGroundContainer.addChild(this.cloud1);
                
                this.cloud2 = PIXI.Sprite.fromFrame("cloud2.png");
                this.cloud2.position.y = GameConfig.height/8;
                this.BackGroundContainer.addChild(this.cloud2);;
                
                this.bgTex.speed = 1/2;

                GameConfig.app.ticker.add((delta)=> {
                   // console.log("background run!");
                    this.scrollPosition = GameConfig.camera.x;

                    var intervalDistance = this.bgTex.sprites[0].width/4;
                        
                    var cloud1Pos = -this.scrollPosition * 1.5/2;
                    cloud1Pos %= this.width + intervalDistance;
                    cloud1Pos += this.width + intervalDistance;
                    cloud1Pos -= this.cloud1.width/2;
                    this.cloud1.position.x = cloud1Pos -GameConfig.xOffset;
                    
                    var cloud2Pos = -(this.scrollPosition + this.width/2) * 1.5/2;
                    cloud2Pos %= this.width + intervalDistance;
                    cloud2Pos += this.width + intervalDistance;
                    cloud2Pos -= this.cloud2.width/2;
                    this.cloud2.position.x = cloud2Pos -GameConfig.xOffset;

                    //
                    for(var i=0;i<this.groundAssetList.length;i++){
                        var gSpritePos =-(this.scrollPosition + this.width*(i+1))*3/4;
                        gSpritePos %= this.width + intervalDistance;
                        gSpritePos += this.width + intervalDistance;
                        gSpritePos -= this.groundSpriteList[i].width/2;
                        this.groundSpriteList[i].position.x = gSpritePos -GameConfig.xOffset;      
                    }
    
                    this.bgTex.setPosition(this.scrollPosition);
                });
        }
    }
}