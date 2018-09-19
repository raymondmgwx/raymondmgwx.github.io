/* =========================================================================
 *
 *  GameConfig.ts
 *  config file
 *
 * ========================================================================= */
/// <reference path="./HashSet.ts" />
/// <reference path="./GameAudio.ts" />
module ECS {
    declare var PIXI: any;
    export class GameRunTime{
        DELTA_TIME:number;
        lastTime:number;
        speed:number;

        currentTime:any;
        constructor(){
            this.DELTA_TIME = 1;	
            this.lastTime = Date.now();
            this.speed = 1;
        }
        update(){
            var time = Date.now();
            var currentTime =  time;
            this.currentTime = currentTime;

            //console.log("current time:"+currentTime);
            var passedTime = currentTime - this.lastTime;

            this.DELTA_TIME = ((passedTime) * 0.06);
            this.DELTA_TIME *= this.speed;

            if(this.DELTA_TIME > 2.3) this.DELTA_TIME = 2.3;

            this.lastTime = currentTime;
        }
    }


    export enum FOODMODE{
        JAPAN,
        INDON
    }

    export enum SPECIALMODE{
        NONE,
        JAPANMODE,
        INDONMODE,
        NINJAMODE
    }

    export enum GAMEMODE{
        TITLE,
        COUNT_DOWN,
        PLAYING,
        GAME_OVER,
        INTRO,
        PAUSED
    }

    export enum PLAYMODE{
        RUNNING,
        JUMPING1,
        JUMPING2,
        FALL,
        SLIDE
    }


    export class GameConfig{
        static app:any;
        static device:any;
        static allSystem:Utils.HashSet<System>;
        static audio:GameAudio;
        static width:number=800;
        static height:number = 600;

        static fixedHeight:number = 600;

        static xOffset:number=0;
        static high_mode:boolean=true;
        static camera   :any = new PIXI.Point();
  
        static localID :string = "rw.raymond.wang";
        static newHighScore:boolean=false;
        static time:any = new GameRunTime();


        static interactive:boolean = true;
        static newHighscore:boolean;


        static gameMode:any;
        static playerMode:any;
        static specialMode:any= SPECIALMODE.NONE;

        static game:any;
        static black:any;

        static isOnPlat:boolean = false;

        static tmpTimeClockStart:any;
        static tmpTimeClockEnd:any;

        static timeClock(){
            return this.tmpTimeClockEnd-this.tmpTimeClockStart;
        }

        static tmpTimeClockStart1:any;
        static tmpTimeClockEnd1:any;
        static timeClock1(){
            return this.tmpTimeClockEnd1-this.tmpTimeClockStart1;
        }

    }
}
