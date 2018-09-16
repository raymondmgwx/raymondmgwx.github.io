/* =========================================================================
 *
 *  GameUI.ts
 *  game ui panel
 *
 * ========================================================================= */
/// <reference path="./GameConfig.ts" />
module ECS {
    declare var PIXI: any;

    function formatScore(n:any){
        var nArray = n.toString().split("");
        var text = "";
        var total = nArray.length;
        
        var offset = (total % 3)-1;
        for(var i = 0; i < total; i++)
        {
            text += nArray[i];
        }
        
        return text;
    }

    //UIPanel
    export class GameUIPanelUpRight{
       
        uiContainer:any;
        uiList:any;
        uiSprites:any;

        startX:number;
        ratio:number=0.6;
        startYList:Array<number>;
        startXList:Array<number>;

        constructor(){
            this.uiContainer = new PIXI.Container();
            this.uiList = [ "Score.png",
                            "Best Score.png",
                            "Distance.png",
                            "Pause.png"];
            this.startXList = new Array<number>();
            this.startYList = new Array<number>();
            
            let allSpritesLength = 0;
            this.uiSprites = [];
            for(var i=0;i<this.uiList.length;i++){
                this.uiList[i] = PIXI.Texture.fromFrame(this.uiList[i]);
                this.uiSprites[i] = new PIXI.Sprite(this.uiList[i]);
                this.uiSprites[i].scale.x = this.ratio;
                this.uiSprites[i].scale.y = this.ratio;
                allSpritesLength += this.uiSprites[i].width;
            }
            this.startX = GameConfig.width - allSpritesLength;
            
            
            
            for ( var i = 0; i < this.uiList.length; i++) 
            {
                this.startXList.push(this.startX);
                this.startYList.push(this.uiSprites[i].height);
                this.uiContainer.addChild(this.uiSprites[i]);
                this.uiSprites[i].position.x = this.startX;
                this.startX +=this.uiSprites[i].width;
            }     
        }

    }

    export class NumberUI{
        
        container:any;
        numberList:any;
        tmpList:any;
        numberSprite:any;

        startX:number;
        startY:number;

        currentScore:number = 0;
        ratio:number =1;
        xOffset:number=15;
        yOffset:number=15;

        constructor(startXList:any,startYList:any){
            this.ratio =0.3;
            this.startX = startXList[1];
            this.startY = startYList[0];

            this.container = new PIXI.Container();
            this.tmpList  = [];

            this.numberList = {
                    0:"Number-0.png",
                    1:"Number-1.png",
                    2:"Number-2.png",
                    3:"Number-3.png",
                    4:"Number-4.png",
                    5:"Number-5.png",
                    6:"Number-6.png",
                    7:"Number-7.png",
                    8:"Number-8.png",
                    9:"Number-9.png"
            };
            
            for(var s in this.numberList)this.numberList[s] = PIXI.Texture.fromFrame(this.numberList[s]);
            
            this.numberSprite = [];
            
            for ( var i = 0; i < 10; i++) 
            {
                this.numberSprite[i] = new PIXI.Sprite(this.numberList[i]);
                this.numberSprite[i].scale.x = this.ratio;
                this.numberSprite[i].scale.y = this.ratio;
            }
            
            this.setScore(0)
        }
        resetScore(){
            for ( var i = 0; i < this.tmpList.length; i++) 
            {
                this.container.removeChild(this.tmpList[i]);
            }
        }

        setScore(score:any)
        {
            this.currentScore = score;
            this.resetScore();

            var split = formatScore(score).split("");
            var position = this.startX - this.xOffset;

            var allLength =0;
            //count all number length
            for ( var i = 0; i < split.length; i++){
                var l = this.numberList[split[i]].width*this.ratio; 
                allLength += l;
            }
            position -= allLength;
            for ( var i = 0; i < split.length; i++) 
            {
                var ns = this.numberSprite[i];
                ns.visible = true;
                ns.setTexture(this.numberList[split[i]]);
                ns.position.x = position; 
                ns.position.y = this.startY/2 - this.yOffset;
                position += ns.width;
                this.tmpList.push(ns);
                this.container.addChild(ns);
            }
            
        }
    }

    export class Score extends NumberUI{

        constructor(startXList:any,startYList:any){
            super(startXList,startYList);
        }
     
    }

    export class BestScore extends NumberUI{
        
        LocalData:any;
        hightScore :number;

        constructor(startXList:any,startYList:any){
            super(startXList,startYList)
            this.startX = startXList[2];
            this.LocalData = new GameLocalData(GameConfig.localID);
            this.hightScore = this.LocalData.get('highscore') || 0;
            this.update();
        }

        update()
        {
            this.setScore(this.LocalData.get('highscore') || 0);
        }
    }

    export class DistanceScore extends NumberUI{

        constructor(startXList:any,startYList:any){
            super(startXList,startYList);
            this.startX = startXList[3];
            this.setScore(0);
        }
     
    }



}