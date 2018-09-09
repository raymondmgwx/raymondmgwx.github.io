/* =========================================================================
 *
 *  GameKernel.ts
 *  game execute logical
 *
 * ========================================================================= */
/// <reference path="./GameConfig.ts" />
module ECS {
    declare var PIXI: any;
    declare var Fido: any;
    declare var TweenLite:any;
    declare var Cubic:any;
    declare var Elastic:any;
    declare var Sine:any;

    export class GameKernel {
        player:any;
        view:any;
        segmentManager:any;
        enemyManager:any;
        pickupManager:any;
        floorManager:any;
        collisionManager:any;
        LocalStorage:any;
        bulletMult :number;
        pickupCount :number;
        tscore :number;
        joyrideMode : boolean;
        joyrideCountdown :number;
        isPlaying : boolean;
        levelCount :number;
        gameReallyOver : boolean;
        isDying : boolean;
        score:number;
        
        constructor() {
            this.player = new GameCharacter();
            this.view = new GameView(this);
            this.segmentManager = new SegmentManager(this);
            //this.enemyManager = new EnemyManager(this);
            this.pickupManager      = new PickupManager(this);
            this.floorManager       = new FloorManager(this);
            this.collisionManager   = new CollisionManager(this);
            this.LocalStorage       = new Fido.LocalStorage(GameConfig.bundleId);
            
            this.player.view.visible =  false;
            this.bulletMult = 1;
            this.pickupCount = 0;
            this.score = 0;
            this.joyrideMode = false;
            this.joyrideCountdown = 0;
            this.isPlaying = false;
            this.levelCount = 0;
            this.gameReallyOver = false;
            this.isDying = false;
            
            this.view.game.addChild(this.player.view);
        }

        start(){
            this.segmentManager.reset();
            //this.enemyManager.destroyAll();
            this.pickupManager.destroyAll();
            this.isPlaying = true;
            this.gameReallyOver = false;
            this.score = 0;
            this.player.level = 1;
            this.player.position.y = 477;
            this.player.speed.y = 0;
            this.player.speed.x = this.player.baseSpeed;
            this.player.view.rotation = 0;
            this.player.isFlying = false;
            this.player.isDead = false;
            this.player.view.play()
            this.player.view.visible = true;
            this.segmentManager.chillMode = false;
            this.bulletMult = 1;

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
                this.segmentManager.update();
                this.floorManager.update();
                //this.enemyManager.update();
                this.pickupManager.update();

                if(this.joyrideMode)
                {
                    this.joyrideCountdown -= GameConfig.time.DELTA_TIME;

                    if(this.joyrideCountdown <= 0)
                    {
                        this.joyrideComplete();
                    }
                }
                
                this.levelCount += GameConfig.time.DELTA_TIME;
            
                if(this.levelCount > (60 * 60))
                {
                    this.levelCount = 0;
                    this.player.level += 0.05;
                    GameConfig.time.speed += 0.05;
                }
            }
            else
            {
                if(this.joyrideMode)
                {
                    this.joyrideCountdown += GameConfig.time.DELTA_TIME;
                }
            }

            this.view.update();
        }

        reset(){
            //this.enemyManager.destroyAll();
            this.floorManager.destroyAll();
            
            this.segmentManager.reset();
            this.view.zoom = 1;
            this.pickupCount = 0;
            this.levelCount = 0;
            this.player.level = 1;
            
            this.view.game.addChild(this.player.view);
        }

        joyrideComplete()
        {
            this.joyrideMode = false;
            this.pickupCount = 0;
            this.bulletMult += 0.3;
            this.view.normalMode();
            this.player.normalMode();
            //this.enemyManager.destroyAll();
        }

        gameover()
        {
            this.isPlaying = false;
            this.isDying = true;
            this.segmentManager.chillMode = true;
            
            var nHighscore = this.LocalStorage.get('highscore');
            if(!nHighscore || this.score > nHighscore) 
            {
                this.LocalStorage.store('highscore', this.score);
                GameConfig.newHighscore = true;
            }
            
            //this.onGameover();
            
            this.view.game.addChild(this.player.view);
            
            TweenLite.to(this.view, 0.5, {
                zoom : 2, 
                ease : Cubic.easeOut
            });
        }

        gameoverReal()
        {
            this.gameReallyOver = true;
            this.isDying = false;
            //this.onGameoverReal();
        }

        pickup()
        {
            if(this.player.isDead) return; 
                
            this.score += 10;
            
 
            
            this.view.score.jump();
            this.pickupCount++;

            if(this.pickupCount >= 50 * this.bulletMult && !this.player.isDead)
            {
                this.pickupCount = 0;
                this.joyrideMode = true;
                this.joyrideCountdown = 60 * 10;
                this.view.joyrideMode();
                this.player.joyrideMode();
                this.player.position.x = 0;
                GameConfig.camera.x = GameConfig.game.player.position.x - 100;
                //this.enemyManager.destroyAll();
                this.pickupManager.destroyAll();
                this.floorManager.destroyAll();	
                this.segmentManager.reset();
            }
        }
    }

    export class BackGroundElement{
        sprites:any;
        spriteWidth:number;
        speed;number;
        constructor(texture:any,y:number,owner:any){
            this.sprites = [];
            this.spriteWidth = texture.width-1;
            var amount = Math.ceil(940 / this.spriteWidth);
            if(amount < 3)amount = 3;
            
            for (var i=0; i < amount; i++) 
            {
                var sprite = new PIXI.Sprite(texture);
                sprite.position.y = y;
                owner.addChild(sprite);
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
                pos +=  h * 2;
                
                this.sprites[i].position.x = Math.floor(pos) - GameConfig.xOffset
            };	
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

    export class GameBackground{

        vines:GameVines;

        width:number;
        scrollPosition:number;
        foggyTrees:BackGroundElement;
        rearSilhouette:BackGroundElement;
        rearCanopy:BackGroundElement;
        farCanopy:BackGroundElement;
        roofLeaves:BackGroundElement;
        frontSilhouette:BackGroundElement;

        tree1:any;
        tree2:any;
        addChild:any;
        updateTransform:any;

        constructor(front:any){
                console.log("init background!");
                PIXI.DisplayObjectContainer.call( this );
                this.width = 1000;
                this.scrollPosition = 1500;

                //console.log(PIXI.Texture);
                var fogTex = PIXI.Texture.fromImage("img/background.png");
                fogTex.width = 960;
                fogTex.height = 500;
        
                this.foggyTrees = new BackGroundElement(fogTex, 120, this);
                //this.rearSilhouette = new BackGroundElement(PIXI.Texture.fromFrame("03_rear_silhouette.png"), 358, this);
                //this.rearCanopy = new BackGroundElement(PIXI.Texture.fromFrame("03_rear_canopy.png"), 0, this);
                
                


                this.tree1 = PIXI.Sprite.fromFrame("tree1.png");
                this.tree1.anchor.x = 0.5;
                this.addChild(this.tree1);
                
                this.tree2 = PIXI.Sprite.fromFrame("tree2.png");
                this.tree2.anchor.x = 0.5;
                this.tree2.position.y = 50;
                this.addChild(this.tree2);

                //this.farCanopy = new BackGroundElement(PIXI.Texture.fromFrame("02_front_canopy.png"), 0, this);
                //this.vines = new GameVines(this);
                //this.roofLeaves = new BackGroundElement(PIXI.Texture.fromFrame("00_roof_leaves.png"), 0, this);
                
                //this.frontSilhouette = new BackGroundElement(PIXI.Texture.fromFrame("01_front_silhouette.png"), 424, this);
                
                this.foggyTrees.speed = 1/2;
                //this.rearSilhouette.speed = 1.2/2;
                
                //this.rearCanopy.speed = 1.2/2;
                //this.farCanopy.speed = 1.5/2;
                //this.frontSilhouette.speed = 1.6/2;
                //this.roofLeaves.speed = 2/2;
        }
    }
    GameBackground.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
                        
    GameBackground.prototype.updateTransform = function()
    {
        this.scrollPosition = GameConfig.camera.x + 4000;

        var treePos = -this.scrollPosition * 1.5/2;
        treePos %= this.width + 556;
        treePos += this.width + 556;
        treePos -= this.tree1.width/2;
        this.tree1.position.x = treePos -GameConfig.xOffset;
        
        var treePos2 = -(this.scrollPosition + this.width/2) * 1.5/2;
        treePos2 %= this.width + 556;
        treePos2 += this.width + 556;
        treePos2 -= this.tree2.width/2;
        this.tree2.position.x = treePos2 -GameConfig.xOffset;
        
        this.foggyTrees.setPosition(this.scrollPosition);
        //this.rearSilhouette.setPosition(this.scrollPosition);
        //this.rearCanopy.setPosition(this.scrollPosition);
       // this.farCanopy.setPosition(this.scrollPosition);
        //this.frontSilhouette.setPosition(this.scrollPosition);
        
        //this.roofLeaves.setPosition(this.scrollPosition);
        
        //this.vines.setPosition(this.scrollPosition);
        
        
        PIXI.DisplayObjectContainer.prototype.updateTransform.call( this );
    }

    export class JoyBackGround{
        width:number;
        scrollPosition:number;
        swoosh:any;
        scale:any;
        constructor(){
            PIXI.DisplayObjectContainer.call( this );
            this.width = 1000;
            this.scrollPosition = 1500;
            var SCALE =1// 0.5
            this.swoosh = new BackGroundElement(PIXI.Texture.fromImage("img/stretched_hyper_tile.jpg"), 0 , this);
            this.swoosh.speed = 0.7
            this.scale.y = 1.7;
            this.scale.x = 4;
        }
    }

    //Game View
    export class GameView {
        kernel:GameKernel;
        renderer:any;
        stage:any;
        container:any;
        hud:any;
        game:any;
        gameFront:any;
        normalBackground:any;
        powerBar:any;
        score:any;
        bestScore:any;
        background:any;
        trail:any;
        trail2:any;
        count:number;
        zoom:number;
        white:any;
        splash:any;
        dust:any;
        constructor(kernel:GameKernel) {
            console.log("init game view!");
            
            this.kernel = kernel;
            this.renderer = PIXI.autoDetectRenderer(600, 800);
            GameConfig.high_mode = (this.renderer instanceof PIXI.WebGLRenderer);
            this.stage = new PIXI.Stage();
            this.container = new PIXI.DisplayObjectContainer();
            this.container.hitArea = this.stage.hitArea;
            this.container.interactive = true;
            
            //init scene layer
            this.hud = new PIXI.DisplayObjectContainer();
            this.game = new PIXI.DisplayObjectContainer();
            this.gameFront = new PIXI.DisplayObjectContainer();

            this.container.addChild(this.game);
            this.container.addChild(this.gameFront);
        
            this.stage.addChild(this.container);
            this.stage.addChild(this.hud);

            this.normalBackground = new GameBackground(this.gameFront);

            this.powerBar = new PowerBar();
            this.score = new Score();
            this.bestScore = new BestScore();
            this.background = this.normalBackground;

            this.score.position.x = 300;

            this.game.addChild(this.background);
            this.hud.addChild(this.powerBar);
            this.hud.addChild(this.score);
            this.hud.addChild(this.bestScore);

            this.trail = new GameCharacterTrail(this.game);
            this.trail2 = new GameCharacterTrailFire(this.game);

            this.powerBar.alpha = 0;
            this.score.alpha = 0;
            this.bestScore.alpha = 0;

            this.count = 0;
            this.zoom = 1;

            this.white = PIXI.Sprite.fromImage("img/whiteSquare.jpg");
            GameConfig.xOffset = this.container.position.x;

            //this.dust = new PixiDust();
            //this.container.addChild(this.dust);

            this.splash = new Splash();
            this.splash.position.y = 300;
            this.splash.position.x = 300;

            this.game.addChild(this.splash);
        }

        showHud() {
            var start = {
                x: GameConfig.width + 300,
                y: 0
            };
        
            this.score.alpha = 1;
            this.score.position.x = start.x;
            TweenLite.to(this.score.position, 1, {
                x: GameConfig.width - 295 - 20,
                ease: Elastic.easeOut
            });
        
            this.bestScore.alpha = 1;
            this.bestScore.position.x = start.x;
            this.bestScore.position.y -= 14;
            TweenLite.to(this.bestScore.position, 1, {
                x: GameConfig.width - 20,
                ease: Elastic.easeOut
            });
        
            this.powerBar.alpha = 1;
            this.powerBar.position.x = GameConfig.width;
            TweenLite.to(this.powerBar.position, 1, {
                x: GameConfig.width - 295,
                ease: Elastic.easeOut,
                delay: 0.3
            });
        }
        
        hideHud() {
        
        }
        
        update() {
            this.count += 0.01;
        
            
            var ratio = (this.zoom - 1);
            var position = -GameConfig.width / 2
            var position2 = -this.kernel.player.view.position.x;
            var inter = position + (position2 - position) * ratio;
    
            this.container.position.x = inter * this.zoom;
            this.container.position.y = -this.kernel.player.view.position.y * this.zoom;
    
            this.container.position.x += GameConfig.width / 2;
            this.container.position.y += GameConfig.height / 2;
    
            GameConfig.xOffset = this.container.position.x;
    
            if (this.container.position.y > 0) this.container.position.y = 0;
            var yMax = -GameConfig.height * this.zoom;
            yMax += GameConfig.height;
    
            if (this.container.position.y < yMax) this.container.position.y = yMax;
    
            this.container.scale.x = this.zoom;
            this.container.scale.y = this.zoom;
            
        
            this.trail.target = this.kernel.player;
            this.trail2.target = this.kernel.player;
        
            this.trail.update();
            this.trail2.update();
            //this.dust.update();
        
            //this.lava.setPosition(GameConfig.camera.x + 4000);
            this.bestScore.update();
            this.score.setScore(Math.round(this.kernel.score));
            this.powerBar.bar.scale.x = ((this.kernel.pickupCount / (50 * this.kernel.bulletMult)) * (248 / 252))
            this.renderer.render(this.stage);
        }
        
        joyrideMode() {
            this.game.removeChild(this.background);
            //this.background = this.joyBackground;
            this.game.addChildAt(this.background, 0);
            this.stage.addChild(this.white);
            this.white.alpha = 1;
        
            TweenLite.to(this.white, 0.7, {
                alpha: 0,
                ease: Sine.easeOut
            });
        }
        
        doSplash() {
            this.splash.splash(this.kernel.player.position);
        }
        
        normalMode() {
            this.game.removeChild(this.background);
            this.background = this.normalBackground;
            this.game.addChildAt(this.background, 0);
            this.stage.addChild(this.white)
            this.white.alpha = 1;
        
            TweenLite.to(this.white, 0.5, {
                alpha: 0,
                ease: Sine.easeOut
            });
        }
        
        resize(w, h) {
            //    console.log("Width ->" + w);
            //    console.log("Height -> " + h);
        
            GameConfig.width = w;
            GameConfig.height = h;
        
            this.renderer.resize(w, h);
            this.background.width = w;
        
            this.bestScore.position.x = w - 20;
            this.bestScore.position.y = 100;
        
            this.score.position.x = w - 295 - 20;
            this.score.position.y = 12;
        
            this.white.scale.x = w / 16;
            this.white.scale.y = h / 16;
        
            this.powerBar.position.x = w - 295;
            this.powerBar.position.y = 12;
        }

    }

}