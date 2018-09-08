/* =========================================================================
 *
 *  System.ts
 *  system using for controlling the game
 *
 * ========================================================================= */
/// <reference path="./Entity.ts" />
/// <reference path="./HashSet.ts" />
/// <reference path="./Utils.ts" />
module ECS {
    declare var PIXI: any;
    declare var TweenLite:any;

    export function update() {
        GameConfig.game.update();
    
    
        requestAnimationFrame(update);

    }

    export class System {
        name: string;
        GlobalDatas: ECS.Entity;
        MainSystem: ECS.System;
        constructor(name: string) {
            this.name = name;
        }
        Execute() {
            console.log("[" + this.name + "]System Execute!");
        }
    }

    export class LoadingSystem extends System {
        stressTest:any;
        constructor() {
            super("loading");
        }

        StressTestCompleted(){
            this.stressTest.end();
            GameConfig.resize();
            window.addEventListener('resize', function() {
                GameConfig.resize();
            });
    
        }

        Execute() {
            super.Execute();
             //FidoAudio.init();
             this.stressTest = new PIXI.StressTest(()=>{
                    this.stressTest.end();
                
                    GameConfig.interactive = false;
                    //<any>document.body.scroll = "no";
                
                    var loader = new PIXI.AssetLoader([
                        "img/stretched_hyper_tile.jpg",
                        "img/SplashAssets.json",
                        "img/WorldAssets-hd.json",
                        "img/HudAssets-hd.json",
                        "img/PixiAssets-hd.json",
                        "img/iP4_BGtile.png",
                        "img/blackSquare.jpg",
                        "assets/hud/pausedPanel.png",
                        "assets/hud/pixieRevised_controls.png",
                        "assets/hud/ContinuePlay.png",
                        "assets/hud/RestartPlay.png",
                        "assets/hud/soundOff.png",
                        "assets/hud/soundOn.png",
                        "assets/hud/pause.png",
                        "assets/hud/PersonalBest.png"
                    ]);
                
                    loader.addEventListener('onComplete', (event)=> {
                        console.log("data assets loaded!");
                        this.stressTest.remove();
                        this.init();
                        //clearInterval(loadInterval);
                    });
                
                    loader.load();
                    GameConfig.resize();
             });
        }

        init() {
            GameConfig.gameMode = GAMEMODE.INTRO;
            GameConfig.interactive = false;
        
            GameConfig.game = new GameKernel();
            var game = GameConfig.game;
        
            document.body.appendChild(game.view.renderer.view);
            game.view.renderer.view.style.position = "absolute";
            game.view.renderer.view.webkitImageSmoothingEnabled = false

            //bind event 
            let evtSys = new EventListenerSystem();
            evtSys.bindEvent(); 

            requestAnimationFrame(update);
            GameConfig.resize();
        
            GameConfig.interactive = false;

            game.start();
            GameConfig.gameMode = GAMEMODE.PLAYING;
        
        }

   
    }


    export class MainSystem extends System {
        OtherSystems: Utils.HashSet<System>;
        constructor(GlobalDatas: ECS.Entity, othSystems: Utils.HashSet<System>) {
            super("main");
            this.GlobalDatas = GlobalDatas;
            this.OtherSystems = othSystems;
            this.MainSystem = this;
        }
        Execute() {
            super.Execute();
            var g = this.GlobalDatas;
            var m = this.MainSystem;
            this.OtherSystems.forEach(function (key, val) {
                (<System>val).GlobalDatas = g;
                (<System>val).MainSystem = m;
                (<System>val).Execute();
            });
        }
    }


    export class EventListenerSystem extends System{
        constructor(){
            super("eventlistener");
        }

        bindEvent(){

            //for pc version
            window.addEventListener("keydown", this.onKeyDown, true);
            //window.addEventListener("keyup", this.onKeyUp, true);

            //touch start
            GameConfig.game.view.container.mousedown = GameConfig.game.view.container.touchstart = function(event) {
                this.onKeyDown(event);
            }
        
        }
        onKeyDown(event:any) {
            if (event.keyCode == 32) {
                if (GameConfig.game.isPlaying && !GameConfig.game.player.isJumped) GameConfig.game.player.jump();
            }
        }
        onTouchStart(event:any){
                event.originalEvent.preventDefault();
                if (event.target.type !== 'button') {
                    if (GameConfig.game.isPlaying && !GameConfig.game.player.isJumped) GameConfig.game.player.jump();
                }
        }
        
    }
}