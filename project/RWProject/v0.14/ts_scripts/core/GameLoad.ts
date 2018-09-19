/* =========================================================================
 *
 *  GameLoad.ts
 *  system using for load the game resources
 *
 * ========================================================================= */
/// <reference path="./System.ts" />
/// <reference path="./GameAudio.ts" />
/// <reference path="./GameKernel.ts" />
/// <reference path="./GameView.ts" />
/// <reference path="./GameBackGround.ts" />
module ECS {

    declare var PIXI:any;
    declare var Howler:any;

    export function update() {
        GameConfig.game.update();
        requestAnimationFrame(update);
    }

    export class MainSystem extends System {
        OtherSystems: Utils.HashSet<System>;
        constructor(othSystems: Utils.HashSet<System>) {
            super("main");
            this.OtherSystems = othSystems;
        }
        Execute() {
            super.Execute();
            this.OtherSystems.forEach(function (key, val) {
                (<System>val).Execute();
            });
        }
    }

    export class LoadingSystem extends System {
        device:any;
        width:number;
        height:number;

        loadingFrames:any;
        bgImage:any;
        logoImage:any;
        resourceList:any;

        app:any;
        loadingStage:any;

        constructor() {
            super("loading");
            //device info detect
            this.device = new Utils.DeviceDetect();
            //console.log(this.device.PrintInfo());
            GameConfig.audio = new GameAudio();
            Howler.mobileAutoEnable = true;
            //game resources list
            this.resourceList =
            [
                "img/doroCat.png",
                "img/dash_stock.png",
                "img/blade.png",
                "img/bg_up.png",
                "img/bg_up_ios.png",
                "img/bg_down.png",
                "img/PlayPanel/btn_jump.png",
                "img/PlayPanel/btn_slide.png",
                "img/PlayPanel/btn_atk.png",
                "img/floatingGround.png",
                "assets/background/BackgroundAssets.json",
                "assets/food/food.json",
                "assets/playUI/playPanel.json",
                "assets/playUI/number.json",
                "assets/character/chara1.json",
                "assets/specialEffect/WorldAssets-hd.json"
            ];
        }

        playStartScreenMusic(){
            GameConfig.audio.setVolume('StartMusic', 0.5);
            GameConfig.audio.play("StartMusic");
        }

        loadingAnime(){
            var loadingTextures = [];
    
            for (var i = 0; i < 3; i++) {
                var texture = PIXI.loader.resources['img/Loading' + (i+1) + '.png'].texture;
                loadingTextures.push(texture);
            }
    
            var loading = new PIXI.extras.AnimatedSprite(loadingTextures);
    
            loading.x = this.width * 0.5;
            loading.y = this.height * 0.7;
            loading.anchor.set(0.5);
            loading.animationSpeed = 0.1;
            loading.play();
            this.loadingStage.addChild(loading);
            
        }

        Init(){
            super.Init();

            this.width = window.innerWidth;
            this.height = window.innerHeight;

            //init app for game(add some fundmental options)
            this.app = new PIXI.Application({ 
                width: this.width,         
                height: this.height,       
                antialias: true,    // default: false
                transparent: false, // default: false
                resolution: 1       // default: 1
              }
            );

            //setting renderer
            this.app.renderer.backgroundColor = 0x061639;
            this.app.renderer.view.style.position = "absolute";
            this.app.renderer.view.style.display = "block";
            this.app.renderer.autoResize = true;
            this.app.renderer.resize(this.width, this.height);

            document.body.appendChild(this.app.view);

            this.loadingFrames = [
                "img/Loading1.png",
                "img/Loading2.png",
                "img/Loading3.png"
            ];
            this.bgImage = "img/bg.png";
            this.logoImage = "img/logo.png";

            //loading panel
            PIXI.loader
                .add(this.loadingFrames)
                .add(this.bgImage)
                .add(this.logoImage)
                .load(()=>{
                    console.log("show loading panel!");
                    //show bg image
                    this.loadingStage = new PIXI.Container();
                    let load_bg = new PIXI.Sprite(PIXI.loader.resources[this.bgImage].texture);
                    load_bg.anchor.x = 0;
                    load_bg.anchor.y = 0;
                    load_bg.height = this.height;
                    load_bg.width = this.width;
                    this.loadingStage.addChild(load_bg);
                    //show logo
                    let logo = new PIXI.Sprite(PIXI.loader.resources[this.logoImage].texture);
                    logo.anchor.set(0.5);
                    logo.position.x = this.width * 0.5;
                    logo.position.y = this.height * 0.4;

                    let logoRatio = logo.width/logo.height;
                    logo.height = this.height/2;
                    logo.width = logo.height * logoRatio;
                    this.loadingStage.addChild(logo);
                    this.loadingAnime();

                    //TODO! progress bar animation
                    this.app.stage.addChild(this.loadingStage);

                    //read game resources
                    this.LoadGameResources();
                });
        }

        LoadGameResources(){
            PIXI.loader
            .add(this.resourceList)
            .load(()=>{
                console.log("data assets loaded!");
                //remove loading panel
                this.app.stage.removeChild(this.loadingStage);
                
                //setup game main system 
                GameConfig.app = this.app;
                GameConfig.width = this.width;
                GameConfig.height = this.height;
                GameConfig.device = this.device;
                GameConfig.allSystem =new Utils.HashSet<System>();
                let allSystem = GameConfig.allSystem;
                
                allSystem.set("background",new GameBackGroundSystem());
                allSystem.set("view",new GameViewSystem());
                allSystem.set("kernel",new GameKernelSystem());
               
                let mainSystem = new MainSystem(allSystem);
                
                //game start
                GameConfig.game = allSystem.get("kernel");

                //bind event 
                let evtSys = new EventListenerSystem();
                evtSys.bindEvent(); 

                var game = GameConfig.game;

                //show hud
                game.view.showHud();

                update();
                game.start();
                GameConfig.gameMode = GAMEMODE.PLAYING;
                GameConfig.playerMode = PLAYMODE.RUNNING;
                
                
            });
        }


        Execute() {
            super.Execute();
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
        //window.addEventListener("touchstart", this.onTouchStart, true);

        
        }
        onKeyDown(event:any) {
            if (event.keyCode == 32 || event.keyCode == 38) {
                GameConfig.audio.play("jump");
                if (GameConfig.game.isPlaying && !GameConfig.game.player.startJump&& !GameConfig.game.player.isPlayingNinjiaEffect) 
                    GameConfig.game.player.jump();
                if (GameConfig.game.isPlaying && GameConfig.game.player.isJumped &&  !GameConfig.game.player.isPlayingNinjiaEffect) 
                    GameConfig.game.player.jumpTwo(); 
            }else if(event.keyCode == 40) {
               
                //console.log(GameConfig.game.player.onGround);
                if (GameConfig.game.isPlaying && !GameConfig.game.player.isJumped && GameConfig.game.player.onGround){
                    GameConfig.game.player.slide(true);
                }
                    
            }else if(event.keyCode == 39) {
               
                if (GameConfig.game.isPlaying && GameConfig.specialMode == SPECIALMODE.JAPANMODE){
                    GameConfig.audio.play("ninjiaModeAttack");
                    GameConfig.game.player.view.textures =  GameConfig.game.player.dashFrames;
                    GameConfig.game.player.view.play();
                    GameConfig.game.player.ninjiaOperate();
                }else if(GameConfig.game.isPlaying && GameConfig.specialMode == SPECIALMODE.INDONMODE){
                    GameConfig.audio.play("indoMode");
                    GameConfig.game.player.view.textures =  GameConfig.game.player.runningFrames;
                    GameConfig.game.player.view.play();
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

        // onTouchStart(event:any){
        //         if (event.target.type !== 'button') {
        //             if (GameConfig.game.isPlaying && !(GameConfig.playerMode == PLAYMODE.JUMPING1))
        //                 GameConfig.game.player.jump();
        //             if (GameConfig.game.isPlaying && (GameConfig.playerMode == PLAYMODE.JUMPING1))
        //                 GameConfig.game.player.jumpTwo(); 
        //         }
        // }
        
    }

}