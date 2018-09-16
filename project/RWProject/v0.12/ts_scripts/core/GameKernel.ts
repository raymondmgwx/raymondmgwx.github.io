/* =========================================================================
 *
 *  GameKernel.ts
 *  game execute logical
 *
 * ========================================================================= */
/// <reference path="./System.ts" />
/// <reference path="./GameConfig.ts" />
/// <reference path="./GameLocalData.ts" />
/// <reference path="./GameBackGround.ts" />
/// <reference path="./GameView.ts" />
/// <reference path="./GameManager.ts" />
/// <reference path="./GameCharacter.ts" />
module ECS {
    declare var PIXI: any;
    declare var TweenLite:any;
    declare var Cubic:any;


    export class GameKernelSystem extends System {
        player:any;
        view:GameViewSystem;
        segmentManager:any;
        enemyManager:any;
        pickupManager:any;
        floorManager:any;
        platManager:any;
        collisionManager:any;

        LocalData:any;

        bulletMult :number;
        pickupCount :number;
        tscore :number;

        isPlaying : boolean;
        levelCount :number;
        gameReallyOver : boolean;
        isDying : boolean;

        //user score
        score:number;
        distanceScore:number;
        
        constructor() {
            super("game kernel")
            this.view = <GameViewSystem>(GameConfig.allSystem.get("view"));
            this.player = new GameCharacter();
            this.segmentManager = new SegmentManager(this);
            this.enemyManager = new EnemyManager(this);
            this.platManager = new PlatformManager(this);
            this.pickupManager      = new PickupManager(this);
            this.floorManager       = new FloorManager(this);
            this.collisionManager   = new CollisionManager(this);
            this.LocalData       = new GameLocalData(GameConfig.localID);
            
            this.player.view.visible =  false;
            this.bulletMult = 1;
            this.pickupCount = 0;

            this.score = 0;
            this.distanceScore = 0;

            this.isPlaying = false;
            this.levelCount = 0;
            this.gameReallyOver = false;
            this.isDying = false;
            
            this.view.game.addChild(this.player.view);
        }

        start(){
            this.segmentManager.reset();
            this.enemyManager.destroyAll();
            this.pickupManager.destroyAll();
            this.platManager.destroyAll();
            this.isPlaying = true;
            this.gameReallyOver = false;

            this.player.level = 1;
            this.player.speed.y = 0;
            this.player.speed.x = this.player.baseSpeed;
            this.player.view.rotation = 0;
            this.player.isFlying = false;
            this.player.isDead = false;
            this.player.view.play()
            this.player.view.visible = true;
            this.segmentManager.chillMode = false;
            this.bulletMult = 1;

            GameConfig.audio.stop("StartMusic");
            GameConfig.audio.setVolume('GameMusic', 0.5);
            GameConfig.audio.play("GameMusic");
        }

        update(){
            //console.log("game update!!");
            GameConfig.time.update();
            
            var targetCamY = 0;
            if(targetCamY > 0) targetCamY = 0;
            if(targetCamY < -70) targetCamY = -70;
            
            GameConfig.camera.y = targetCamY;
            
            if(GameConfig.gameMode !== GAMEMODE.PAUSED)
            {
                this.player.update();
                this.collisionManager.update();
                this.platManager.update();
                this.segmentManager.update();
                this.floorManager.update();
                this.enemyManager.update();
                this.pickupManager.update();

                this.levelCount += GameConfig.time.DELTA_TIME;
            
                if(this.levelCount > (60 * 60))
                {
                    this.levelCount = 0;
                    this.player.level += 0.05;
                    GameConfig.time.speed += 0.05;
                }
            }
 

            this.view.update();

        }

        // reset(){
        //     this.enemyManager.destroyAll();
        //     this.platManager.destroyAll();
        //     this.floorManager.destroyAll();
            
        //     this.segmentManager.reset();
        //     this.view.zoom = 1;
        //     this.pickupCount = 0;
        //     this.levelCount = 0;
        //     this.player.level = 1;
            
        //     this.view.game.addChild(this.player.view);
        // }

 

        gameover()
        {
            this.isPlaying = false;
            this.isDying = true;
            this.segmentManager.chillMode = true;
            
            var nHighscore = this.LocalData.get('highscore');
            if(!nHighscore || this.score > nHighscore) 
            {
                this.LocalData.store('highscore', this.score);
                GameConfig.newHighscore = true;
            }
            
            //this.onGameover();
            
            this.view.game.addChild(this.player.view);
            
            TweenLite.to(this.view, 0.5, {
                zoom : 2, 
                ease : Cubic.easeOut
            });

            //this.reset();
            //this.start();
        }

        // gameoverReal()
        // {
        //     this.gameReallyOver = true;
        //     this.isDying = false;
        //     //this.onGameoverReal();
        // }

        pickup(idx:number)
        {
            if(this.player.isDead) return; 
                
            this.pickupCount++;

        }
    }



    export class GameVines{
        vines:any;
        owner:any;
        speed:number;
        constructor(owner:any){
            this.vines = [];
            this.owner = owner;
            for (var i=0; i < 10; i++) 
            {
                var vine = new PIXI.Sprite.fromFrame("01_hanging_flower3.png");
                vine.offset = i * 100 + Math.random() * 50;
                vine.speed = (1.5 + Math.random() * 0.25 )/2;
                vine.position.y = Math.random() * -200;
                owner.addChild(vine);
                vine.position.x = 200;
                this.vines.push(vine);
            };	
                          
            this.speed = 1;
        }

        setPosition(position:any)
        {
            for (var i=0; i < this.vines.length; i++) 
            {
                var vine = this.vines[i];
                
                var pos = -(position + vine.offset) * vine.speed;
                pos %=  this.owner.width;
                pos +=  this.owner.width;
                
                vine.position.x = pos
            };	
        }
    }
}