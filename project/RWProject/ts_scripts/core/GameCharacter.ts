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
        flyingFrames:any;
        crashFrames:any;
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
        onGroundCache:any;
        bounce:number;

        vStart:number;
        mass:number;
        angle:number;
        startJump:boolean;
        b_jumpTwo:boolean;
        smooth:number;
        cnt:number;
        
        constructor(){

            console.log("init character!");
            this.position = new PIXI.Point();
	
            this.runningFrames = [
                PIXI.Texture.fromFrame("RUN/Timeline 100001.png"),
                PIXI.Texture.fromFrame("RUN/Timeline 100002.png"),
                PIXI.Texture.fromFrame("RUN/Timeline 100003.png"),
                PIXI.Texture.fromFrame("RUN/Timeline 100004.png")
            ];
            
            this.flyingFrames = [
                PIXI.Texture.fromFrame("RUN/Timeline 100001.png"),
                PIXI.Texture.fromFrame("RUN/Timeline 100002.png"),
                PIXI.Texture.fromFrame("RUN/Timeline 100003.png"),
                PIXI.Texture.fromFrame("RUN/Timeline 100004.png")
            ];
            
            this.crashFrames = [
                PIXI.Texture.fromFrame("RUN/Timeline 100001.png"),
                PIXI.Texture.fromFrame("RUN/Timeline 100002.png"),
                PIXI.Texture.fromFrame("RUN/Timeline 100003.png"),
                PIXI.Texture.fromFrame("RUN/Timeline 100004.png")
            ];
            
            this.view = new PIXI.MovieClip(this.flyingFrames);
            this.view.animationSpeed = 0.23;
            
            this.view.anchor.x = 0.5;
            this.view.anchor.y = 0.5;
            
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
            
            this.onGround = false;
            this.rotationSpeed = 0;
            this.joyRiding = false;
            this.level = 1;
            this.realAnimationSpeed = 0.23;
            
            this.volume = 0.3;

            //start speed
            this.vStart = 35;
            this.mass = 65;
            this.angle =Math.PI * 45/360;
            this.startJump =false;
            this.b_jumpTwo = false;
            this.smooth = 0.05;
            this.cnt =0;
        }

        update()
        {
            if(this.isDead)
            {
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
            if(this.onGround === true) //FidoAudio.setVolume('runRegular', this.volume);
            TweenLite.to(this.speed, 0.6, {
                x : this.baseSpeed, 
                ease : Cubic.easeOut
            });
            this.realAnimationSpeed = 0.23;
        }

        updateRunning()
        {
            this.view.animationSpeed = this.realAnimationSpeed * GameConfig.time.DELTA_TIME * this.level;

            // if(this.isActive)
            // {
            //     this.isJumped = true;
            // }
            
            var oldSpeed = this.speed.y;
            
            if(this.b_jumpTwo)
            {
                this.speed.y = -this.vStart * Math.sin(this.angle) ;
                this.b_jumpTwo = false;
                this.isJumped = false;
            }

            
            if(this.startJump)
            {
                this.speed.y += this.gravity  * GameConfig.time.DELTA_TIME *this.smooth;
                
                if(Math.abs(this.position.y-this.ground)<=1 && this.cnt ==0){
                    this.isJumped = true;
                    this.cnt +=1;
                    this.speed.y = -this.vStart * Math.sin(this.angle) ;

                }else if (Math.abs(this.position.y-this.ground)<=1 && this.cnt ==1){
   
                    this.startJump = false;
                    this.isJumped = false;
                    this.cnt =0;
                }
            }
            
            
            this.position.x += this.speed.x * GameConfig.time.DELTA_TIME * this.level;
            this.position.y += this.speed.y * GameConfig.time.DELTA_TIME;
            
            if(this.onGround !== this.onGroundCache)
            {
                this.onGroundCache = this.onGround;
                
                if(this.onGround)
                {
                    this.view.textures = this.runningFrames;
                }
                else
                {
                    this.view.textures = this.flyingFrames;
                }
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

            this.b_jumpTwo = true;
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

            if(Math.abs(this.position.y-this.ground)>1)
            {
                this.isJumped = true;
                this.startJump = false;
            }
            else
            {
                this.isJumped = false;
                this.startJump = true;
                this.activeCount = 0;
            }
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
            this.isActive = false;
            this.isJumped = false;
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
        isHit:boolean;
        width:number;
        height:number;
        explosion:any;
        constructor(){
            this.position = new PIXI.Point();
            this.view = new PIXI.Sprite(PIXI.Texture.fromFrame("spike_box.png"));
            this.view.anchor.x = 0.5;
            this.view.anchor.y = 0.5;
            this.isHit = false;
            this.width = 150;
            this.height = 150;
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
            
            this.view.position.x = this.position.x - GameConfig.camera.x;
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