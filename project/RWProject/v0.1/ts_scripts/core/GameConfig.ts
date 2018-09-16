/* =========================================================================
 *
 *  GameConfig.ts
 *  config file
 *
 * ========================================================================= */
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
        static xOffset:number=0;
        static high_mode:boolean=true;
        static camera   :any = new PIXI.Point();
  
        static bundleId :string = "rw.raymond.wang";
        static newHighScore:boolean=false;
        static time:any = new GameRunTime();

        static width:number=800;
        static height:number = 600;
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

        static resize() {
            window.scrollTo(0, 0);
        
            var h = 640;
            var width = window.innerWidth || document.body.clientWidth;
            var height = window.innerHeight || document.body.clientHeight;
            var ratio = height / h;
        
            if (this.game) {
                var view = this.game.view.renderer.view;
                view.style.height = h * ratio + "px";
        
                var newWidth = (width / ratio);
        
                view.style.width = width + "px";
        
                // this.logo.position.x = newWidth / 2;
                // this.logo.position.y = h / 2 - 20;
        
                // if (black) {
                //     black.scale.x = newWidth / 16;
                //     black.scale.y = h / 16;
                // }
        
                // this.countdown.position.x = newWidth / 2;
                // this.countdown.position.y = h / 2;
        
                this.game.view.resize(newWidth, h);
        
                // pauseButton.position.x = newWidth - 60;
                // pauseButton.position.y = h - 60;
        
                // pauseScreen.position.x = (newWidth * 0.5);
                // pauseScreen.position.y = h * 0.5;
        
                // resumeButton.position.x = (newWidth * 0.5);
                // resumeButton.position.y = (h * 0.5);
        
                // restartButton.position.x = (newWidth * 0.5) + 125;
                // restartButton.position.y = (h * 0.5);
        
                // soundOffButton.position.x = (newWidth * 0.5) - 125;
                // soundOffButton.position.y = (h * 0.5);
        
                // soundOnButton.position.x = (newWidth * 0.5) - 125;
                // soundOnButton.position.y = (h * 0.5);
            }
        
            this.width = (width / ratio);
            this.height = h;
        }
    }
}
