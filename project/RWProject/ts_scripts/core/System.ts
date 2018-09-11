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
    declare var FidoAudio:any;

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
                    
                
                    var loader = new PIXI.AssetLoader([
                        "img/stretched_hyper_tile.jpg",
                        "img/doroCat.png",
                        "img/dash_stock.png",
                        "img/blade.png",
                        "img/SplashAssets.json",
                        "img/WorldAssets-hd.json",
                        "img/PixiAssets-hd.json",
                        "img/platform.png",
                        "img/bg_up.png",
                        "img/bg_down.png",
                        "img/floatingGround.png",
                        "assets/background/BackgroundAssets.json",
                        "assets/food/food.json",
                        "assets/playUI/playPanel.json",
                        "assets/playUI/number.json",
                        "assets/character/chara1.json",
                        "img/blackSquare.jpg",
                    ]);
                
                    loader.addEventListener('onComplete', (event)=> {
                        console.log("data assets loaded!");
                        this.stressTest.remove();
                        this.init();
                        
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

            game.view.showHud();

            //bind event 
            let evtSys = new EventListenerSystem();
            evtSys.bindEvent(); 

            requestAnimationFrame(update);
            GameConfig.resize();
        
            GameConfig.interactive = false;

            FidoAudio.play('gameMusic');
            game.start();
            game.player.jump();
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
        window.addEventListener("keyup", this.onKeyUp, true);
        window.addEventListener("touchstart", this.onTouchStart, true);

        
        }
        onKeyDown(event:any) {
            if (event.keyCode == 32 || event.keyCode == 38) {
                if (GameConfig.game.isPlaying && !GameConfig.game.player.startJump&& !GameConfig.game.player.isPlayingNinjiaEffect) 
                    GameConfig.game.player.jump();
                if (GameConfig.game.isPlaying && GameConfig.game.player.isJumped &&  !GameConfig.game.player.isPlayingNinjiaEffect) 
                    GameConfig.game.player.jumpTwo(); 
            }else if(event.keyCode == 40) {
               
                if (GameConfig.game.isPlaying && !GameConfig.game.player.isJumped && GameConfig.game.player.onGround){
                    GameConfig.game.player.slide(true);
                }
                    
            }else if(event.keyCode == 39) {
               
                if (GameConfig.game.isPlaying && GameConfig.specialMode == SPECIALMODE.JAPANMODE){
                    GameConfig.game.player.view.textures =  GameConfig.game.player.dashFrames;
                    GameConfig.game.player.ninjiaOperate();
                }else if(GameConfig.game.isPlaying && GameConfig.specialMode == SPECIALMODE.INDONMODE){
                    GameConfig.game.player.view.textures =  GameConfig.game.player.runningFrames;
                    GameConfig.game.player.indoOperate();
                }
                    
            }
        }

        onKeyUp(event:any) {
             if(event.keyCode == 40) {
                
                if (GameConfig.game.isPlaying && GameConfig.game.player.isSlide){
                    GameConfig.game.player.slide(false);
                }
                    
            }
        }

        onTouchStart(event:any){
                if (event.target.type !== 'button') {
                    if (GameConfig.game.isPlaying && !(GameConfig.playerMode == PLAYMODE.JUMPING1))
                        GameConfig.game.player.jump();
                    if (GameConfig.game.isPlaying && (GameConfig.playerMode == PLAYMODE.JUMPING1))
                        GameConfig.game.player.jumpTwo(); 
                }
        }
        
    }
}