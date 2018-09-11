/* =========================================================================
 *
 *  GameCharacter.ts
 *  character controller
 *
 * ========================================================================= */
module ECS {
    declare var FidoAudio: any;
    declare var PIXI: any;
    declare var TweenLite: any;
    declare var Cubic: any;

    export class GameCharacter{
        position:any;
        runningFrames:any;
        jumpFrames:any;
        slideFrame:any;
        dashFrames:any;
        shootFrame:any;
        indoTightFrame:any;
        marioFrame:any;

        view:any;
        ground:number;
        gravity:number;
        baseSpeed:number;
        speed:any;
        activeCount:number;
        isJumped:boolean;
        accel:number;
        width:number;
        height:number;
        onGround:boolean;
        rotationSpeed :number;
        joyRiding :boolean;
        level :number;
        realAnimationSpeed :number;
        volume :number;
        isDead:boolean;
        isActive:boolean;
        onGroundCache:boolean;
        bounce:number;

        vStart:number;
        mass:number;
        angle:number;
        isSlide:boolean=false;
        startJump:boolean;
        b_jumpTwo:boolean;
        smooth:number;
        cnt:number;

        specialEffectView:any;
        shinobiEffect1:any;
        shinobiEffect2:any;
        shinobiEffect3:any;
        backEffect:any;

        marioEffect:any;
        indoEffect:any;
        indonTight:any;

        ninjiaEffectNumber:number =0;
        isPlayingNinjiaEffect:boolean = false;
        isPlayingInoEffect:boolean = false;

        constructor(){

            console.log("init character!");
            this.position = new PIXI.Point();
	
            this.runningFrames = [
                PIXI.Texture.fromFrame("CHARACTER/RUN/Character-01.png"),
                PIXI.Texture.fromFrame("CHARACTER/RUN/Character-02.png"),
                PIXI.Texture.fromFrame("CHARACTER/RUN/Character-03.png"),
                PIXI.Texture.fromFrame("CHARACTER/RUN/Character-04.png"),
                PIXI.Texture.fromFrame("CHARACTER/RUN/Character-05.png"),
                PIXI.Texture.fromFrame("CHARACTER/RUN/Character-06.png"),
            ];

            this.indoTightFrame =[
                PIXI.Texture.fromFrame("CHARACTER/POWER EFFECTS/INDONTIGHT/boom0001.png"),
                PIXI.Texture.fromFrame("CHARACTER/POWER EFFECTS/INDONTIGHT/boom0002.png"),
                PIXI.Texture.fromFrame("CHARACTER/POWER EFFECTS/INDONTIGHT/boom0003.png"),
                PIXI.Texture.fromFrame("CHARACTER/POWER EFFECTS/INDONTIGHT/boom0004.png")
            ]

            this.jumpFrames =[
                PIXI.Texture.fromFrame("CHARACTER/JUMP/Jump.png"),
            ];

            this.slideFrame =[
                PIXI.Texture.fromFrame("CHARACTER/SLIDE/Slide.png"),
            ];
            
            this.dashFrames = [
                PIXI.Texture.fromFrame("CHARACTER/POWER/DASH/dash0002.png")
            ];
            
            this.shootFrame = [
                PIXI.Texture.fromFrame("CHARACTER/POWER/SHOOT/shoot0001.png"),
                PIXI.Texture.fromFrame("CHARACTER/POWER/SHOOT/shoot0002.png")
            ];

            
            this.view = new PIXI.MovieClip(this.runningFrames);
            this.view.animationSpeed = 0.23;
            
            this.view.anchor.x = 0.5;
            this.view.anchor.y = 0.65;
            this.view.height=135;
            this.view.width=75;
            
            this.position.y = 477;
            this.ground = 477;
            this.gravity = 9.8;
            
            this.baseSpeed = 8;
            this.speed = new PIXI.Point(this.baseSpeed, 0);
            
            this.activeCount = 0;
            this.isJumped = false;
            this.accel =0;
            
            this.width = 26
            this.height = 37;
            
            this.onGround = true;
            this.rotationSpeed = 0;
            this.joyRiding = false;
            this.level = 1;
            this.realAnimationSpeed = 0.23;
            
            this.volume = 0.3;

            //start speed
            this.vStart = 30;
            this.mass = 65;
            this.angle =Math.PI * 45/360;
            this.startJump =false;
            this.b_jumpTwo = false;
            this.smooth = 0.05;
            this.cnt =0;

            this.shinobiEffect1 = new PIXI.Sprite(PIXI.Texture.fromImage("img/dash_stock.png"));
            this.shinobiEffect1.anchor.x = -1.5;
            this.shinobiEffect1.anchor.y = 5.5;
            this.shinobiEffect1.scale.x = 0.2;
            this.shinobiEffect1.scale.y = 0.2;

            this.shinobiEffect2 = new PIXI.Sprite(PIXI.Texture.fromImage("img/dash_stock.png"));
            this.shinobiEffect2.anchor.x = 0;
            this.shinobiEffect2.anchor.y = 5.5;
            this.shinobiEffect2.scale.x = 0.2;
            this.shinobiEffect2.scale.y = 0.2;

            this.shinobiEffect3 = new PIXI.Sprite(PIXI.Texture.fromImage("img/dash_stock.png"));
            this.shinobiEffect3.anchor.x = 1.5;
            this.shinobiEffect3.anchor.y = 5.5;
            this.shinobiEffect3.scale.x = 0.2;
            this.shinobiEffect3.scale.y = 0.2;

            this.backEffect = new PIXI.Sprite(PIXI.Texture.fromImage("img/blade.png"));
            this.backEffect.anchor.x = 0.8;
            this.backEffect.anchor.y = 0.5;
            this.backEffect.scale.x = 1;
            this.backEffect.scale.y = 1;

            

            this.specialEffectView = new PIXI.Sprite(PIXI.Texture.fromFrame("CHARACTER/POWER EFFECTS/DASH/dash-shinobi-new.png"));

    
            this.specialEffectView.anchor.x = 0.2;
            this.specialEffectView.anchor.y = 0.5;
            this.specialEffectView.scale.x = 2;
            this.specialEffectView.scale.y = 2;

            this.indoEffect = new PIXI.Sprite(PIXI.Texture.fromFrame("CHARACTER/POWER EFFECTS/SHOOT/maung shoot-new.png"));

    
            this.indoEffect.anchor.x = 0.2;
            this.indoEffect.anchor.y = 0.6;
            this.indoEffect.scale.x = 2;
            this.indoEffect.scale.y = 2;

            this.marioEffect = new PIXI.Sprite(PIXI.Texture.fromFrame("CHARACTER/POWER EFFECTS/MARIO/maung ninja.png"));

    
            this.marioEffect.anchor.x = 0.1;
            this.marioEffect.anchor.y = 0.52;
            this.marioEffect.scale.x = 2;
            this.marioEffect.scale.y = 2;


            this.indonTight = new PIXI.MovieClip(this.indoTightFrame);
            this.indonTight.animationSpeed = 0.1;
            
            this.indonTight.anchor.x = 0.5;
            this.indonTight.anchor.y = 0.5;
            this.indonTight.height=GameConfig.height/2;
            this.indonTight.width=GameConfig.width/2;


            
            //this.view.addChild(this.indonTight);
            //this.indonTight.play();
        }

        update()
        {
            if(this.isDead)
            {
                //console.log("died"); continue update
                this.updateDieing();
            }
            else
            {
                this.updateRunning();
            }
        }

        joyrideMode()
        {
            this.joyRiding = true;
            //FidoAudio.setVolume('runRegular', 0);
            //FidoAudio.play('hyperMode');
            TweenLite.to(this.speed, 0.3, {
                x : 20, 
                ease : Cubic.easeIn
            });
            this.realAnimationSpeed = 0.23 * 4
        }

        normalMode()
        {
            this.joyRiding = false;
            //FidoAudio.setVolume('runFast', 0);
            //if(this.onGround === true) FidoAudio.setVolume('runRegular', this.volume);
            TweenLite.to(this.speed, 0.6, {
                x : this.baseSpeed, 
                ease : Cubic.easeOut
            });
            this.realAnimationSpeed = 0.23;
        }

        chkOnGround(){
            if(Math.abs(this.position.y-this.ground)<=1){
                return true;
            }

            return false;
        }


        resetSpecialFoods(){
            for(var i =0;i<4;i++){
                GameConfig.game.view.specialFood.digits[i].texture = GameConfig.game.view.specialFood.foods[i];
            }
        }

        ninjiaOperate(){
            if(this.ninjiaEffectNumber <3 && !this.isPlayingNinjiaEffect){
                //console.log("dash");
                this.isPlayingNinjiaEffect=true;
                GameConfig.tmpTimeClockStart = GameConfig.time.currentTime;
                this.view.addChild(this.specialEffectView);
                
                switch(this.ninjiaEffectNumber){
                    case 0:
                    this.view.removeChild(this.shinobiEffect1);
                    break;
                    case 1:
                    this.view.removeChild(this.shinobiEffect2);
                    break;
                    case 2:
                    this.view.removeChild(this.shinobiEffect3);
                    break;
                }
                
                GameConfig.game.player.speed.x*=10;
                this.ninjiaEffectNumber++;
            }
        }

        indoOperate(){
            if(!this.isPlayingInoEffect){
                            
                GameConfig.tmpTimeClockStart = GameConfig.time.currentTime;
                GameConfig.game.player.view.addChild(GameConfig.game.player.indoEffect);
                this.view.addChild(this.indonTight);
                this.indonTight.play();
                this.isPlayingInoEffect = true;
                this.view.textures = this.shootFrame;
            }
        }

        ninjaMode(){


            if(this.isPlayingNinjiaEffect){
                GameConfig.tmpTimeClockEnd = GameConfig.time.currentTime;
                var DuringTime = GameConfig.timeClock();
                //console.log(DuringTime);
                if(DuringTime > 200){
                    this.view.textures = this.runningFrames;
                    this.speed.x/=10;
     
                    this.view.removeChild(this.specialEffectView);
                    this.isPlayingNinjiaEffect = false;
                    if(this.ninjiaEffectNumber ==3){
                      
                            this.ninjiaEffectNumber =0;
                            GameConfig.specialMode = SPECIALMODE.NONE;
                            GameConfig.game.pickupManager.pickedUpPool = [];
                            GameConfig.game.pickupManager.canPickOrNot = true;
                            this.resetSpecialFoods();
                            this.view.removeChild(this.backEffect);
                            console.log("ninja finished!");
            
                    }
                }
            }
       
        }

        marioMode(){
            GameConfig.tmpTimeClockEnd = GameConfig.time.currentTime;
            var DuringTime = GameConfig.timeClock();
            //console.log(DuringTime);
            if(DuringTime > 5000){
                console.log("mario finished!");
                GameConfig.specialMode = SPECIALMODE.NONE;
                GameConfig.game.pickupManager.pickedUpPool = [];
                GameConfig.game.pickupManager.canPickOrNot = true;
                this.speed.x/=2;
                this.view.removeChild(this.marioEffect);
                this.resetSpecialFoods();
            }
        }

        indoMode(){
            if(this.isPlayingInoEffect){
                this.indonTight.textures = this.indoTightFrame;
                GameConfig.tmpTimeClockEnd = GameConfig.time.currentTime;
                var DuringTime = GameConfig.timeClock();
                if(DuringTime > 1000){
                    console.log("indo finished!");
                    this.isPlayingInoEffect = false;
                    GameConfig.specialMode = SPECIALMODE.NONE;
                    GameConfig.game.pickupManager.pickedUpPool = [];
                    GameConfig.game.pickupManager.canPickOrNot = true;
                    this.view.removeChild(this.indonTight);
                    this.view.removeChild(this.indoEffect);
                    this.resetSpecialFoods();
                }
            }

        }

        updateRunning()
        {
            this.view.animationSpeed = this.realAnimationSpeed * GameConfig.time.DELTA_TIME * this.level;
            this.indonTight.animationSpeed = this.realAnimationSpeed * GameConfig.time.DELTA_TIME * this.level;


            switch( GameConfig.playerMode){
                case PLAYMODE.JUMPING1:
  
                    this.speed.y = -this.vStart * Math.sin(this.angle) ;  
                break;
                case PLAYMODE.JUMPING2:
                
                    this.speed.y = -this.vStart * Math.sin(this.angle) ;  
                break;
                case PLAYMODE.FALL:
                    //should have gravity
                     this.speed.y += this.gravity  * GameConfig.time.DELTA_TIME *this.smooth;
                break;
                case PLAYMODE.RUNNING:
                    this.speed.y=0;
                break;
                
            }



            if(!this.chkOnGround() && (GameConfig.playerMode == PLAYMODE.JUMPING1 || GameConfig.playerMode == PLAYMODE.JUMPING2 ))GameConfig.playerMode = PLAYMODE.FALL;
            else if(GameConfig.playerMode == PLAYMODE.FALL &&  this.chkOnGround()) GameConfig.playerMode = PLAYMODE.RUNNING; 


            //console.log(GameConfig.playerMode);            
            
            this.position.x += this.speed.x * GameConfig.time.DELTA_TIME * this.level;
            this.position.y += this.speed.y * GameConfig.time.DELTA_TIME;
            //console.log(this.speed.y);
            
            if(this.onGround !== this.onGroundCache)
            {
                this.onGroundCache = this.onGround;
                if(this.onGround && GameConfig.playerMode == PLAYMODE.RUNNING )
                {
                    this.view.textures = this.runningFrames;
                }
                else if(GameConfig.playerMode == PLAYMODE.JUMPING1  || GameConfig.playerMode == PLAYMODE.JUMPING2)
                {
                    this.view.textures = this.jumpFrames;
                }
            }

            if(GameConfig.playerMode == PLAYMODE.SLIDE ){
                this.view.textures = this.slideFrame;
            }else if(this.onGround &&GameConfig.playerMode != PLAYMODE.SLIDE )
            {

                //console.log(GameConfig.specialMode);
                switch(GameConfig.specialMode){
                    case SPECIALMODE.NONE:
                      this.view.textures = this.runningFrames;
                    break;
                    case SPECIALMODE.NINJAMODE:
                    
                    this.view.textures = this.runningFrames;
  
                    break;
                    case SPECIALMODE.JAPANMODE:
                    
                    this.view.textures = this.runningFrames;

                    break;
                    case SPECIALMODE.INDONMODE:
                    this.view.textures = this.runningFrames;
     
                    break;
                }

            }
            else if(GameConfig.playerMode == PLAYMODE.JUMPING1  || GameConfig.playerMode == PLAYMODE.JUMPING2)
            {
                this.view.textures = this.jumpFrames;
            }


            switch(GameConfig.specialMode){
                case SPECIALMODE.NONE:
                
                break;
                case SPECIALMODE.NINJAMODE:
                this.marioMode();
        

                break;
                case SPECIALMODE.JAPANMODE:
                if(this.ninjiaEffectNumber<=3){
                    this.ninjaMode();
                }


                break;
                case SPECIALMODE.INDONMODE:
                
                this.indoMode();
 
                break;
            }

            
            GameConfig.camera.x = this.position.x - 100;
            
            this.view.position.x = this.position.x - GameConfig.camera.x;
            this.view.position.y = this.position.y - GameConfig.camera.y;
            
            this.view.rotation += (this.speed.y * 0.05 - this.view.rotation) * 0.1;
        }

        updateDieing()
        {
            this.speed.x *= 0.999;
            
            if(this.onGround) this.speed.y *= 0.99;
            
            this.speed.y += 0.1;
            this.accel += (0 - this.accel) * 0.1 * GameConfig.time.DELTA_TIME;
            
            this.speed.y += this.gravity  * GameConfig.time.DELTA_TIME;;
            
            this.position.x += this.speed.x  * GameConfig.time.DELTA_TIME;;
            this.position.y += this.speed.y  * GameConfig.time.DELTA_TIME;;

            GameConfig.camera.x = this.position.x - 100;
            
            this.view.position.x = this.position.x - GameConfig.camera.x;
            this.view.position.y = this.position.y - GameConfig.camera.y;
            
            if(this.speed.x < 5)
            {
                this.view.rotation += this.rotationSpeed * (this.speed.x / 5) * GameConfig.time.DELTA_TIME;
            }
            else
            {
                this.view.rotation += this.rotationSpeed * GameConfig.time.DELTA_TIME;
            }
        }
        jumpTwo()
        {

            
            //console.log("jump two");
            if(this.isDead)
            {
                if(this.speed.x < 5)
                {
                    this.isDead = false
                    this.speed.x = 10;
                }
            }

            if(Math.abs(this.position.y-this.ground)>1)
            {
                GameConfig.playerMode = PLAYMODE.JUMPING2;
                //this.b_jumpTwo = true;
            }
            // else
            // {
            //     this.b_jumpTwo = false;
            // }
        }

        slide(isSlide:boolean){
                 if(this.isDead)
                 {
                     if(this.speed.x < 5)
                     {
                         this.isDead = false
                         this.speed.x = 10;
                     }
                 }
                 
                 if(Math.abs(this.position.y-this.ground)<=1)
                 {
                     this.isSlide = isSlide;
                     if(isSlide) GameConfig.playerMode = PLAYMODE.SLIDE;
                     else GameConfig.playerMode = PLAYMODE.RUNNING;
                 }
        }

        jump()
        {
      
            //console.log("click jump");
            if(this.isDead)
            {
                if(this.speed.x < 5)
                {
                    this.isDead = false
                    this.speed.x = 10;
                }
            }

            // if(Math.abs(this.position.y-this.ground)>1)
            // {
            //     this.isJumped = true;
            //     this.startJump = false;
            // }
            // else
            // {
            //     this.isJumped = false;
            //     this.startJump = true;
            // }
            GameConfig.playerMode = PLAYMODE.JUMPING1;
        }

        die()
        {
            if(this.isDead) return;

            TweenLite.to(GameConfig.time, 0.5, {
                speed : 0.1, 
                ease : Cubic.easeOut, 
                onComplete : function()
                {
                    //FidoAudio.play('deathJingle');
                    TweenLite.to(GameConfig.time, 2, {
                        speed : 1, 
                        delay : 1
                    });
                }
            });

            this.isDead = true;
            this.bounce = 0;
            this.speed.x = 15;
            this.speed.y = -15;
            this.rotationSpeed = 0.3;
            this.view.stop();
        }


        boil()
        {
            if(this.isDead) return;
        
            
            this.isDead = true;
        }

        fall()
        {
            this.startJump = false;
            //this.b_jumpTwo = false;
            this.isJumped = true;
        }

        isAirbourne(){}

        stop()
        {
            this.view.stop();
        }

        resume()
        {
            this.view.play();
        }
    }



    export class GameEnemy{

        position:any;
        view:any;
        explodeView:any;
        isHit:boolean;
        width:number;
        height:number;
        explosion:any;

        moveingFrames:any;
        stealFrames:any;
        
        speed:number;
        isEatNow:boolean=false;
        constructor(){
            this.position = new PIXI.Point();
            // this.view = new PIXI.Sprite(PIXI.Texture.fromFrame("img/doroCat.png"));
            // this.view.anchor.x = 0.5;
            // this.view.anchor.y = 0.5;
            // this.view.width = 150;
            // this.view.height=150;
            
            this.isHit = false;
            this.width = 150;
            this.height = 150;
            this.speed = -10 + Math.random()*20;;

            this.moveingFrames = [
                PIXI.Texture.fromFrame("CHARACTER/NEKO/WALK/neko0001.png"),
                PIXI.Texture.fromFrame("CHARACTER/NEKO/WALK/neko0002.png"),
                PIXI.Texture.fromFrame("CHARACTER/NEKO/WALK/neko0003.png"),
                PIXI.Texture.fromFrame("CHARACTER/NEKO/WALK/neko0004.png"),
            ];

            this.stealFrames =[
                PIXI.Texture.fromFrame("CHARACTER/NEKO/STEAL/steal0001.png"),
                PIXI.Texture.fromFrame("CHARACTER/NEKO/STEAL/steal0002.png"),
                PIXI.Texture.fromFrame("CHARACTER/NEKO/STEAL/steal0003.png"),
                PIXI.Texture.fromFrame("CHARACTER/NEKO/STEAL/steal0004.png")
            ]

            this.view = new PIXI.MovieClip(this.moveingFrames);
            this.view.animationSpeed = 0.23;
            
            this.view.anchor.x = 0.5;
            this.view.anchor.y = 0.5;
            this.view.height=150;
            this.view.width=150;
        }

        reset(){
            if(this.explosion)
            {
                this.view.removeChild(this.explosion);
                this.explosion.reset();
            }
            
            this.isHit = false;
            this.view.width = 157;
        }

        hit()
        {   
            if(this.isHit) return;
            this.isHit = true;
            
            if(!this.explosion) this.explosion = new Explosion();
            
            this.explosion.explode();
            this.view.addChild(this.explosion);
        
            this.view.setTexture(PIXI.Texture.fromImage("img/empty.png"))
        }

        update()
        {
            this.view.animationSpeed = 0.23 * GameConfig.time.DELTA_TIME;

            this.view.position.x = this.position.x - GameConfig.camera.x ;

            if(!this.isEatNow){
                this.position.x += this.speed  * Math.sin(GameConfig.time.DELTA_TIME);
                GameConfig.tmpTimeClockStart1 = GameConfig.time.currentTime;
            }else{
                GameConfig.tmpTimeClockEnd1 = GameConfig.time.currentTime;
                if(GameConfig.timeClock1()>2000){
                    this.isEatNow = false;
                    this.view.textures = this.moveingFrames;
                }
            }
            this.view.position.y = this.position.y;
        }
    }

    export class Partical{

        anchor:any;
        speed:any;
        constructor(){
            PIXI.Sprite.call(this, PIXI.Texture.fromFrame("starPops0004.png"));
            this.anchor.x = 0.5;
            this.anchor.y = 0.5;
            this.speed = new PIXI.Point();
          
        }

        
    }
    Partical.prototype =   Object.create( PIXI.Sprite.prototype );

    export class GameCharacterTrail{
        stage:any;
        target:any;
        particals:any;
        particalPool:any;
        max:number;
        count:number;

        constructor(stage:any){
            this.stage = stage;
            this.target = new PIXI.Point();
            this.particals = [];
            this.particalPool = new GameObjectPool(Partical);
            this.max = 100
            this.count = 0;
        }

        update(){	
            if(this.target.isFlying && !this.target.isDead )
            {
                this.count++;
                
                if(this.count % 3)
                {
                    var partical = this.particalPool.getObject();
                    
                    this.stage.addChild(partical);
                    partical.position.x = this.target.view.position.x + ( Math.random() * 10)-5 - 20;
                    partical.position.y = this.target.view.position.y + 50;
                    partical.direction = 0;
                    partical.dirSpeed = Math.random() > 0.5 ? -0.1 : 0.1
                    partical.sign = this.particals.length % 2 ? -1 : 1;
                    partical.scaly = Math.random() *2 -1// - this.target.speed.x * 0.3;
                    partical.speed.y = this.target.accel * 3;
                    partical.alphay = 2;
                    partical.rotation = Math.random() * Math.PI * 2;
                    partical.scale.x = partical.scale.y = 0.2+Math.random() * 0.5;
                    
                    this.particals.push(partical);
                }
                
            }
            
            for (var i=0; i < this.particals.length; i++) 
            {
                var partical =  this.particals[i];
                
                partical.dirSpeed += 0.003 * partical.sign;
                if(partical.dirSpeed > 2)partical.dirSpeed = 2;
                
                partical.direction += partical.dirSpeed;
                
                partical.speed.x = Math.sin(partical.direction);// *= 1.1;
                partical.speed.y = Math.cos(partical.direction);

                partical.position.x += partical.speed.x * 5 * partical.scaly;
                partical.position.y += partical.speed.y * 3;
                
                partical.alphay *= 0.85;
                partical.rotation += partical.speed.x * 0.1;
                
                partical.alpha = partical.alphay > 1 ? 1 : partical.alphay;
                
                if(partical.alpha < 0.01)
                {
                    this.stage.removeChild(partical);
                    this.particals.splice(i, 1);
                    //this.particalPool.returnObject(partical);
                    i--;
                }
            }	
        }
    }

    export class ParticalFire{
        anchor:any;
        speed:any;
        constructor(){
            PIXI.Sprite.call(this, PIXI.Texture.fromFrame("fireCloud.png"));
            this.anchor.x = 0.5;
            this.anchor.y = 0.5;
            
            this.speed = new PIXI.Point();
        }

    }
    ParticalFire.prototype =  Object.create( PIXI.Sprite.prototype );

    export class GameCharacterTrailFire{
        stage:any;
        target:any;
        particals:any;
        particalPool:any;
        max:number;
        count:number;
        mOffset:any;
        spare:any;
        constructor(stage:any){
            this.stage = stage;
            this.target = new PIXI.Point();
            
            this.particals = [];
            this.particalPool = new GameObjectPool(ParticalFire);
            this.max = 100
            this.count = 0;
            
            this.mOffset = PIXI.mat3.create()//PIXI.mat3.identity(PIXI.mat3.create());
            this.mOffset[2] = -30//this.position.x;
            this.mOffset[5] = 30//this.position.y;
            this.spare = PIXI.mat3.create()//PIXI.mat3.identity();
        }

        update()
        {
            //PIXI.Rope.prototype.updateTransform.call(this);
            
            if(this.target.isDead)
            {
                this.mOffset
                
                PIXI.mat3.multiply(this.mOffset, this.target.view.localTransform, this.spare);
            
                this.count++;
                
                if(this.count % 3)
                {
                    
                    var partical = this.particalPool.getObject();
                    
                    
                    this.stage.addChild(partical);
                    partical.position.x =this.spare[2]
                    partical.position.y = this.spare[5]
                    
                    partical.speed.x = 1+Math.random()*2;
                    partical.speed.y = 1+Math.random()*2;
                    
                    partical.speed.x *= -1
                    partical.speed.y *=1
  
                    partical.alphay = 2;
                    partical.rotation = Math.random() * Math.PI * 2;
                    partical.scale.x = partical.scale.y = 0.2+Math.random() * 0.5;
                    this.particals.push(partical);
                }
                
            }// add partical!
            
            for (var i=0; i < this.particals.length; i++) 
            {
                var partical =  this.particals[i];
                
                partical.scale.x = partical.scale.y *= 1.02;
                    partical.alphay *= 0.85;
                
                partical.alpha = partical.alphay > 1 ? 1 : partical.alphay;
                partical.position.x += partical.speed.x * 2 
                partical.position.y += partical.speed.y * 2
                
                if(partical.alpha < 0.01)
                {
                    this.stage.removeChild(partical);
                    this.particals.splice(i, 1);
                    //this.particalPool.returnObject(partical);
                    i--;
                }
            };	
        }
    }

}