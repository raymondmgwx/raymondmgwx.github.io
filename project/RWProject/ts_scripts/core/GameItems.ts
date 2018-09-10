/* =========================================================================
 *
 *  GameItems.ts
 *  item
 *
 * ========================================================================= */
/// <reference path="./GameConfig.ts" />
module ECS {
    declare var PIXI: any;
    declare var Math2:any;
    declare var Fido:any;
    declare var TweenLite:any;
    declare var Elastic:any;
    declare var Cubic:any;
    declare var Sine:any;

    function formatScore(n:any){
        var nArray = n.toString().split("");
        var text = "";
        var total = nArray.length;
        
        var offset = (total % 3)-1;
        for(var i = 0; i < total; i++)
        {
            text += nArray[i];
            if((i - offset) % 3 == 0 && i != total-1)text+=",";	
        }
        
        return text;
    }



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
            if(!this.pickupTextures) this.pickupTextures = ["pickup_01.png", "pickup_02.png", "pickup_03.png", "pickup_04.png", "pickup_05.png", "pickup_06.png", "pickup_07.png", "pickup_08.png"];

            this.position = new PIXI.Point();
            
            this.view = new PIXI.DisplayObjectContainer();
            this.clip = new PIXI.Sprite(PIXI.Texture.fromFrame(this.pickupTextures[Math2.randomInt(0, this.pickupTextures.length-1)]));
            
            this.clip.anchor.x = 0.5;
            this.clip.anchor.y = 0.5;
            
            this.shine = PIXI.Sprite.fromFrame("pickupShine.png");
            this.shine.anchor.x = this.shine.anchor.y = 0.5;

            this.shine.scale.x = this.shine.scale.y = 1;
            this.shine.alpha = 0.5;
            this.view.addChild(this.shine);
            this.view.addChild(this.clip);
            
            this.width = 100;
            this.height = 100;
            this.count = Math.random() * 300;

        }

        update(){
            if(!this.isPickedUp)
            {
                this.count += 0.1 * GameConfig.time.DELTA_TIME;
                this.clip.scale.x = 0.55 + Math.sin(this.count) * 0.1;
                this.clip.scale.y = 0.55 - Math.cos(this.count) * 0.1;
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

    export class PowerBar{
        barBG:any;
        addChild:any;
        bar:any;
        frame:any;
        position:any;
        constructor(){
            PIXI.DisplayObjectContainer.call( this );

            this.barBG =  PIXI.Sprite.fromFrame("bulletTime_back.png");
            this.addChild(this.barBG);
            this.barBG.position.x = 20;
            this.barBG.position.y = 30;
            
            
            
            this.bar =  PIXI.Sprite.fromFrame("powerFillBar.png");
            this.addChild(this.bar);
            this.bar.position.x = 20;
            this.bar.position.y = 30;
            
            this.frame = PIXI.Sprite.fromFrame("bulletTime_BG.png");
            this.addChild(this.frame);
            this.position.x = 100;
        }
    }
    PowerBar.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);


    export class Specialfood{
        foods:any;
        digits:any;
        startX:number;
        addChild:any;
        setFoodPic:any;
        constructor(){

            PIXI.DisplayObjectContainer.call( this );
        
            
            this.foods = [  "number_01.png",
                            "number_02.png",
                            "number_03.png",
                            "number_04.png"];
            
            for(var i=0;i<4;i++){
                this.foods[i] = PIXI.Texture.fromFrame(this.foods[i]);
            }
            this.startX = 10;
            
            this.digits = [];
            
            for ( var i = 0; i < 4; i++) 
            {
                this.digits[i] = new PIXI.Sprite(this.foods[i]);
                this.addChild(this.digits[i]);
                this.setFoodPic(this.digits[i],i*this.digits[i].width);
            }

            
            
        }

    }

    Specialfood.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );
    Specialfood.prototype.setFoodPic = function(food:any,posx:number)
    {

        food.position.x = this.startX+posx; 

    }
 



    export class Score{
        ratio:number;
        glyphs:any;
        digits:any;
        addChild:any;
        setScore:any;
        jump:any;
        constructor(){

            PIXI.DisplayObjectContainer.call( this );
            
            this.ratio = 0;
            
            this.glyphs = {
                    0:"number_00.png",
                    1:"number_01.png",
                    2:"number_02.png",
                    3:"number_03.png",
                    4:"number_04.png",
                    5:"number_05.png",
                    6:"number_06.png",
                    7:"number_07.png",
                    8:"number_08.png",
                    9:"number_09.png",
                    ",":"number_comma.png"
            };
            
            for(var s in this.glyphs)this.glyphs[s] = PIXI.Texture.fromFrame(this.glyphs[s]);
            
            this.digits = [];
            
            for ( var i = 0; i < 8; i++) 
            {
                this.digits[i] = new PIXI.Sprite(this.glyphs[i]);
                this.addChild(this.digits[i]);
            }
            
            this.setScore(formatScore(12345))
        }

    }

    Score.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );
    Score.prototype.setScore = function(score:any)
    {
        var split = formatScore(score).split("");
        var position = 100;
        var gap = -10;
        for ( var i = 0; i < split.length; i++) 
        {
            var digit = this.digits[i];
            digit.visible = true;
            digit.setTexture(this.glyphs[split[i]]);
            digit.position.x = position; 
            position += digit.width + gap;
        }
        
        for ( var i = 0; i < this.digits.length; i++) 
        {
            this.digits[i].position.x -= position;
        }
        
        for ( var i = split.length; i < this.digits.length; i++) 
        {
            this.digits[i].visible = false;
        }
    }
    Score.prototype.jump=function()
    {
        this.ratio = 2.2;
    }


    export class BestScore{
        addChild:any;
        LocalStorage:any;
        ratio:number;
        glyphs:any;
        digits:any;
        title:any;
        setScore:any;
        jump:any;
        update:any;
        constructor(){
            PIXI.DisplayObjectContainer.call( this );
         
            
            this.LocalStorage = new Fido.LocalStorage(GameConfig.bundleId);
            this.ratio = 0;
            
            this.glyphs = {
                0 : "number_00.png",
                1 : "number_01.png",
                2 : "number_02.png",
                3 : "number_03.png",
                4 : "number_04.png",
                5 : "number_05.png",
                6 : "number_06.png",
                7 : "number_07.png",
                8 : "number_08.png",
                9 : "number_09.png",
                "," : "number_comma.png"
            };
            
            for(var s in this.glyphs) this.glyphs[s] = PIXI.Texture.fromFrame(this.glyphs[s]);
            
            this.digits = [];
            
            for (var i = 0; i < 8; i++) 
            {
                this.digits[i] = new PIXI.Sprite(this.glyphs[i]);
                this.digits[i].scale.set(0.36);
                this.addChild(this.digits[i]);
            }

            this.title = PIXI.Sprite.fromFrame("assets/hud/PersonalBest.png");
            this.title.anchor.x = 0;
            this.title.anchor.y = 0;
            this.title.position.y = 1;
            this.addChild(this.title); 
        }

    }

    BestScore.prototype =  Object.create( PIXI.DisplayObjectContainer.prototype );
    BestScore.prototype.setScore=function(score){
        var split = formatScore(score).split("");
        var position = 0;
        var gap = 3;

        this.title.position.x = 100;
        position+=this.title.position.x+70+gap; 

        for ( var i = 0; i < split.length; i++) 
        {
            var digit = this.digits[i];
            digit.visible = true;
            digit.setTexture(this.glyphs[split[i]]);
            digit.position.x = position;
            digit.anchor.x = 0;
            digit.anchor.y = 0;
            position += digit.width - gap;
        }
        
        position = 150 + position / 2;
        this.title.position.x -= position;

        for ( var i = 0; i < this.digits.length; i++) 
        {
            this.digits[i].position.x -= position;
        }
        
        for ( var i = split.length; i < this.digits.length; i++) 
        {
            this.digits[i].visible = false;
        }
    }

    BestScore.prototype.jump=function()
    {
        this.ratio = 2.2;
    }

    BestScore.prototype.update=function()
    {
        
        this.setScore(Math.round(parseInt(this.LocalStorage.get('highscore'))) || 0);
    }
    
    export class Splash{
        textures:any;
        anchor:any;
        scale:any;
        animationSpeed:number;
        visible:boolean;
        realPosition:any;
        position:any;
        currentFrame:any;
        updateTransform:any;
        splash:any;
        constructor(){
            this.textures = [PIXI.Texture.fromFrame("lavaFrame_01.png"),
                            PIXI.Texture.fromFrame("lavaFrame_02.png"),
                            PIXI.Texture.fromFrame("lavaFrame_03.png"),
                            PIXI.Texture.fromFrame("lavaFrame_04.png"),
                            PIXI.Texture.fromFrame("lavaFrame_05.png"),
                            PIXI.Texture.fromFrame("lavaFrame_06.png"),
                            PIXI.Texture.fromFrame("lavaFrame_07.png"),
                            PIXI.Texture.fromFrame("lavaFrame_08.png"),
                            PIXI.Texture.fromFrame("lavaFrame_09.png"),
                            PIXI.Texture.fromFrame("lavaFrame_10.png"),
                            PIXI.Texture.fromFrame("lavaFrame_11.png"),
                            PIXI.Texture.fromFrame("lavaFrame_12.png")];
            
            PIXI.MovieClip.call( this, this.textures );
            this.anchor.x = 0.5;
            this.anchor.y = 1;
            this.scale.x = this.scale.y = 2;
            this.animationSpeed = 0.3;
            this.visible =false;

        }

    }

    Splash.prototype = Object.create( PIXI.MovieClip.prototype );
     
    Splash.prototype.splash = function(position:any)
    {
        this.realPosition = position.x;
    
        this.position.y = 620;//this.engine.steve.view.position.y;
    
        //this.gotoAndPlay(0)
        this.visible = true;
    };

    Splash.prototype.updateTransform = function()
    {
        if(!this.visible)return;
        
        PIXI.MovieClip.prototype.updateTransform.call(this);
        this.position.x = this.realPosition - GameConfig.camera.x 
        
        
        if(this.currentFrame > this.textures.length-1)
        {
            //this.stop();
            this.visible =false;
        }
    }
}