/* =========================================================================
 *
 *  GameManager.ts
 *  .....
 *
 * ========================================================================= */
/// <reference path="./GameItems.ts" />
/// <reference path="./GameBackGround.ts" />
module ECS {
    declare var PIXI: any;
    declare var data: any;
    

    export class GameObjectPool{
        classType:any;
        pool:any;
        constructor(classType:any){
            this.classType=classType;
            this.pool = [];
        }

        getObject()
        {
            var object = this.pool.pop();
            if(!object)
            {
                object =  new this.classType();
                
            }
            return object;
        }
    }


    export class SegmentManager{
        engine:any;
        sections:any;
        count:number;
        currentSegment:any;
        startSegment:any;
        chillMode:boolean;
        last:number;
        position:number;
  

        constructor(engine:any){
          console.log("init segmeng manager!");
          this.engine = engine;  
          this.sections = data;
          this.count = 0;
          this.currentSegment = data[0];
          //console.log(this.currentSegment);
          this.startSegment = {length:1135 * 2, floor:[0,1135], blocks:[], coins:[], platform:[]},
          this.chillMode = true;
          this.last = 0; 
          this.position = 0;
        }

        reset(dontReset:boolean)
        {
            if(dontReset)this.count = 0;
            this.currentSegment = this.startSegment;
            this.currentSegment.start = -200;
            
            for ( var i = 0; i < this.currentSegment.floor.length; i++) 
            {
                this.engine.floorManager.addFloor( this.currentSegment.start + this.currentSegment.floor[i]);
            }
        }

        update()
        {
            this.position = GameConfig.camera.x + GameConfig.width * 2;
            
            var relativePosition = this.position - this.currentSegment.start;
            // console.log("relativePosition:"+relativePosition);
            // console.log("length:"+this.currentSegment.length);
            if(relativePosition > this.currentSegment.length)
            {
                
                //var nextSegment = this.startSegment;//this.sections[this.count % this.sections.length];
                var nextSegment = this.sections[this.count % this.sections.length];

                // section finished!
                nextSegment.start = this.currentSegment.start + this.currentSegment.length;
                
                this.currentSegment = nextSegment;
                
                // add the elements!
                //console.log(this.currentSegment.floor.length);
                var floors = this.currentSegment.floor;
                var length = floors.length/1.0;
                for ( var i = 0; i < length; i++) 
                {
                   //console.log(this.currentSegment.start + this.currentSegment.floor[i]);
                   this.engine.floorManager.addFloor(this.currentSegment.start + this.currentSegment.floor[i]);
                }
                
                var blocks = this.currentSegment.blocks;
                var length = blocks.length/2;
                
                for ( var i = 0; i < length; i++) 
                {
                    this.engine.enemyManager.addEnemy(this.currentSegment.start + blocks[i*2], blocks[(i*2)+1]);
                }
                
                var pickups = this.currentSegment.coins;
                var length = pickups.length/2;
                
                for ( var i = 0; i < length; i++) 
                {
                    //random distribute
                    var seed = Math.random()*10;
                    var curType = FOODMODE.INDON;
                    if(seed > 5){
                        curType = FOODMODE.JAPAN;
                    }

                    this.engine.pickupManager.addPickup(this.currentSegment.start + pickups[i*2], pickups[(i*2)+1],curType);
                }

                var platforms = this.currentSegment.platform;
                var length = platforms.length/2;
                
                for ( var i = 0; i < length; i++) 
                {
                    this.engine.platManager.addPlatform(this.currentSegment.start + platforms[i*2], platforms[(i*2)+1]);
                }
                
                this.count ++;
                
            }
            
        }
    
    }

    export class Platform{

        position:any;
        views:any;
        width:number;
        height:number;
        numberOfBlock:number;
        constructor(){
            this.position = new PIXI.Point();

            this.numberOfBlock = -3+Math.random() * (8 - 5) + 5;
            this.views =[];
            for(var i=0;i<this.numberOfBlock*2;i++){
                var view =  new PIXI.Sprite(PIXI.Texture.fromFrame("img/floatingGround.png"));
                view.anchor.x = 0.5;
                view.anchor.y = 0.5;
                view.width = 50;
                view.height=50;
                this.views.push(view);
            }

            this.width = 50*this.numberOfBlock*2;
            this.height = 50;
        }
        update()
        { 
            for(var i=-this.numberOfBlock;i<this.numberOfBlock;i++){
                this.views[i+this.numberOfBlock].position.x = this.position.x + 50*i - GameConfig.camera.x;;
                this.views[i+this.numberOfBlock].position.y = this.position.y;
            }

        }
    }

    export class PlatformManager{
        engine:any;
        platforms:any;
        platformPool:any;
        position:any;
        constructor(engine:any){
            console.log("init platform manager!");
            this.engine = engine;
            this.platforms = [];
            this.platformPool = new GameObjectPool(Platform);
        }
        update(){
            for (var i = 0; i < this.platforms.length; i++) 
            {
                var platform = this.platforms[i]
                platform.update();
                
                // this.platforms.splice(i, 1);
                // for(var i=0;i<platform.numberOfBlock;i++){
                //     if(platform.views[i].position.x < -500 -GameConfig.xOffset && !this.engine.player.isDead)
                //     {                        
                //         this.engine.view.gameFront.removeChild(platform.views[i]);
                //     }  
                // }
                // i--;

            }
        }
        destroyAll()
        {
            for (var i = 0; i < this.platforms.length; i++) 
            {
                var platform = this.platforms[i];
                this.platforms.splice(i, 1);
                // for(var i=0;i<platform.numberOfBlock;i++){
                //     if(platform.views[i].position.x < -500 -GameConfig.xOffset && !this.engine.player.isDead)
                //     {                        
                //         this.engine.view.gameFront.removeChild(platform.views[i]);
                //     }  
                // }
                i--;
            }
            
            this.platforms = [];
        }

        addPlatform(x, y)
        {
            var platform = this.platformPool.getObject();
            platform.position.x = x;
            platform.position.y = y;

            for(var i=-platform.numberOfBlock;i<platform.numberOfBlock;i++){
                platform.views[i+platform.numberOfBlock].position.x = platform.position.x + 50*i- GameConfig.camera.x;;
                platform.views[i+platform.numberOfBlock].position.y = platform.position.y;


                this.platforms.push(platform);
                this.engine.view.gameFront.addChild(platform.views[i+platform.numberOfBlock]);
            }
        }
    }


    export class EnemyManager{
        engine:any;
        enemies:any;
        enemyPool:any;
        spawnCount:number;
        explosion:any;
        isHit:boolean;
        view:any;
        position:any;
        constructor(engine:any){
            console.log("init enemy manager!");
            this.engine = engine;
            this.enemies = [];
            this.enemyPool = new GameObjectPool(GameEnemy);
            this.spawnCount = 0;
        }

        update()
        {
            for (var i = 0; i < this.enemies.length; i++) 
            {
                var enemy = this.enemies[i]
                enemy.update();
                
                if(enemy.view.position.x < -100 -GameConfig.xOffset && !this.engine.player.isDead)
                {
                    ////this.enemyPool.returnObject(enemy);
                    this.enemies.splice(i, 1);
                    
                    this.engine.view.gameFront.removeChild(enemy.view);
                    i--;
                }else if(enemy.isHit){
                    this.enemies.splice(i, 1);
                    
                    this.engine.view.gameFront.removeChild(enemy.view);
                    i--;
                }
            }
        }
        
        addEnemy(x, y)
        {
            var enemy = this.enemyPool.getObject();
            enemy.position.x = x;
            enemy.position.y = y;
            enemy.view.textures = enemy.moveingFrames;
            enemy.view.play();
            this.enemies.push(enemy);
            this.engine.view.gameFront.addChild(enemy.view);
        }
        
        destroyAll()
        {
            for (var i = 0; i < this.enemies.length; i++) 
            {
                var enemy = this.enemies[i];
                enemy.reset();
                //this.enemyPool.returnObject(enemy);
                this.engine.view.gameFront.removeChild(enemy.view);
            }
            
            this.enemies = [];
        }
        
        destroyAllOffScreen()
        {
            for (var i = 0; i < this.enemies.length; i++) 
            {
                var enemy = this.enemies[i];
                
                if(enemy.x > GameConfig.camera.x + GameConfig.width)
                {
                    this.engine.view.game.removeChild(enemy.view);
                    this.enemies.splice(i, 1);
                    i--;
                }
            }
        }
    }

    export class PickupManager{
        engine:any;
        pickups:any;
        pickupPool:any;
        spawnCount:number;
        pos:any;

        pickedUpPool:any;
        canPickOrNot:boolean=true;
        MAX_PICKUP_NUM:number = 4;
        constructor(engine:any){
            console.log("init pick up manager!");
            this.engine=engine;
            this.pickups = [];
            this.pickupPool = new GameObjectPool(PickUp);        
            this.spawnCount = 0;
            this.pos = 0
            this.pickedUpPool = [];

        }

        update(){
            for (var i = 0; i < this.pickups.length; i++) 
            {
                var pickup = this.pickups[i]
                
                pickup.update();
                
                if(pickup.isPickedUp)
                {

                        
                    pickup.ratio += (1-pickup.ratio)*0.3 * GameConfig.time.DELTA_TIME;

                    if(pickup.ratio > 0.99)
                    {
                                    
                        //this.pickupPool.returnObject(pickup);
                        this.pickups.splice(i, 1);
                        this.engine.view.game.removeChild(pickup.view);
                        i--;
                    }
            
                }
                else
                {
                    if(pickup.view.position.x < -100-GameConfig.xOffset)
                    {
                        // remove!
                        this.engine.view.game.removeChild(pickup.view);
                        this.pickups.splice(i, 1);
                        i--;
                    }
                }
                
            }
        }

        addPickup(x:number, y:number,type:FOODMODE)
        {
            var pickup = this.pickupPool.getObject();
            pickup.position.x = x
            pickup.position.y = y
            pickup.foodType = type;
            
            this.pickups.push(pickup);
            this.engine.view.game.addChild(pickup.view);
        }

        removePickup(index:number,isPlayer:boolean = true,enemyEntity:any=undefined)
        {
            //collect food
            var pickup = this.pickups[index];
            pickup.isPickedUp = true;

            if(isPlayer){
                pickup.player = this.engine.player;
                pickup.pickupPosition = {x:pickup.position.x, y:pickup.position.y}//.clone();
                pickup.ratio = 0;
    
                //judge food pool, 0 jap 1 indo
                if(this.pickedUpPool.length <this.MAX_PICKUP_NUM-1){
                    //console.log("collect food, type:"+pickup.foodType);
                    this.pickedUpPool.push(pickup.foodType);
                    this.engine.view.specialFood.digits[this.pickedUpPool.length-1].texture = this.engine.view.specialFood.activeFoods[this.pickedUpPool.length-1];
                }else if(this.pickedUpPool.length == this.MAX_PICKUP_NUM-1 && this.canPickOrNot){
                    //console.log("collect food, type:"+pickup.foodType);
                    this.pickedUpPool.push(pickup.foodType);
                    this.engine.view.specialFood.digits[this.pickedUpPool.length-1].texture = this.engine.view.specialFood.activeFoods[this.pickedUpPool.length-1];
                    //count for jan food
                    var cnt = 0;
                    for(var i = 0; i<this.pickedUpPool.length;i++){
                        if(this.pickedUpPool[i] == 0){
                            cnt++;
                        }
                    }
    
                    GameConfig.audio.play("pickUpFood");
                    var otherCnt = 4-cnt;
                    var specialMode = SPECIALMODE.NINJAMODE;
                    if(cnt > otherCnt){
                        specialMode = SPECIALMODE.JAPANMODE;
                        GameConfig.game.player.view.addChild(GameConfig.game.player.shinobiEffect1);      
                        GameConfig.game.player.view.addChild(GameConfig.game.player.shinobiEffect2);      
                        GameConfig.game.player.view.addChild(GameConfig.game.player.shinobiEffect3);     
                        GameConfig.game.player.view.addChild(GameConfig.game.player.backEffect);
                        GameConfig.audio.play("ninjiaMode");
                        
                        //console.log("change special mode:japan");
                    }else if (cnt < otherCnt){
                        specialMode = SPECIALMODE.INDONMODE
                        GameConfig.tmpTimeClockStart = GameConfig.time.currentTime;
                        GameConfig.game.player.view.addChild(GameConfig.game.player.indoEffect);
                        GameConfig.audio.play("indoMode");
                        //console.log("change special mode:indo");
                    }else{
                        specialMode = SPECIALMODE.NINJAMODE;
                        GameConfig.tmpTimeClockStart = GameConfig.time.currentTime;
                        GameConfig.game.player.view.addChild(GameConfig.game.player.marioEffect);
                        GameConfig.game.player.speed.x*=2;

                        //console.log("change special mode:ninja");
                        GameConfig.audio.stop("GameMusic");
                        GameConfig.audio.play("superMarioMode");
                    }
    
                    GameConfig.specialMode = specialMode;
    
    
                    this.canPickOrNot = false;
    
                    
                }
            }else{
                //eat by cat
                pickup.player = enemyEntity;
                pickup.pickupPosition = {x:pickup.position.x, y:pickup.position.y}//.clone();
                pickup.ratio = 0;
            }
  
            
        }


        destroyAll()
        {
            for (var i = 0; i < this.pickups.length; i++) 
            {
                var pickup = this.pickups[i]
                    // remove!
                //this.pickupPool.returnObject(pickup);
                this.engine.view.game.removeChild(pickup.view);
            }
            
            this.pickups = [];
        }

        destroyAllOffScreen()
        {
            for (var i = 0; i < this.pickups.length; i++) 
            {
                var pickup = this.pickups[i];
                
                if(pickup.x > GameConfig.camera.x + GameConfig.width)
                {
                    //this.pickupPool.returnObject(pickup);
                    this.engine.view.game.removeChild(pickup.view);
                    this.pickups.splice(i, 1);
                    i--;
                }

            }
            
        }
    }

    export class Floor{
        position:any;
        view:any;
        constructor(){
            this.position = new PIXI.Point();
            var view =  new PIXI.Sprite(PIXI.Texture.fromFrame("img/bg_down.png"));
            this.view = view;
        }
    }

    export class FloorManager{
        engine:any;
        count:number;
        floors:any;
        floorPool:any;
        constructor(engine:any){
            console.log("init floor manager!");
            this.engine = engine;
            this.count = 0;
            this.floors = [];
            this.floorPool = new GameObjectPool(Floor);
        }

        update(){
            for ( var i = 0; i < this.floors.length; i++) 
            {
                var floor = this.floors[i];
                floor.view.position.x = floor.position.x - GameConfig.camera.x -16;
                
                if(floor.position.x < -1135 - GameConfig.xOffset -16)
                {
                    //console.log("delete floor");
                    this.floors.splice(i, 1);
                    i--;
                    this.engine.view.gameFront.removeChild(floor);
                }
            }
        }

        addFloor(floorData)
        {
            var floor = this.floorPool.getObject();
            floor.position.x = floorData;
            //floor.position.y = 520;
            floor.position.y = (<GameBackGroundSystem>(GameConfig.allSystem.get("background"))).bgTex.spriteHeight;
            floor.view.position.y = floor.position.y;
            this.engine.view.gameFront.addChild(floor.view);
            this.floors.push(floor);
        }

        destroyAll()
        {
            for (var i = 0; i < this.floors.length; i++) 
            {
                var floor = this.floors[i];
                this.engine.view.gameFront.removeChild(floor);
            }
            
            this.floors = [];
        }
    }

    export class CollisionManager{
        engine:any;
        isOnPlat:boolean=false;
        constructor(engine){    
            console.log("init collision manager!");
            this.engine = engine;
        }

        update(){
            this.playerVsBlock();
            this.playerVsPickup();
            this.playerVsFloor();
            this.playerVsPlat();
            this.catVsPickup();
        }

        playerVsBlock(){
            var enemies = this.engine.enemyManager.enemies;
            var player = this.engine.player;
            var floatRange = 0;
            
            for (var i = 0; i < enemies.length; i++) 
            {
                var enemy = enemies[i]
                
                if(player.isSlide){
                    floatRange = 10;
                }else if(GameConfig.specialMode == SPECIALMODE.INDONMODE && GameConfig.game.player.isPlayingInoEffect){
                    floatRange = -2000;
                }
                else{
                    floatRange = 0;
                }
                var xdist = enemy.position.x - player.position.x;
                var ydist = enemy.position.y - player.position.y;


                //detect japan mode and ninjia mode
                if(xdist > -enemy.width/2+floatRange && xdist < enemy.width/2-floatRange)
                {
                    var ydist = enemy.position.y - player.position.y;
                
                    if(ydist > -enemy.height/2-20 +floatRange&& ydist < enemy.height/2 -floatRange)
                    {
                            //attack cat and get point
                            GameConfig.game.score += 10;
                            switch(GameConfig.specialMode){
                                case SPECIALMODE.NONE:
                                    player.die();
                                    this.engine.gameover();
                                    enemy.hit();
                                break;
                                case SPECIALMODE.INDONMODE:
                                    if(floatRange == -2000){
                                        enemy.hit();
                                    }else{
                                        player.die();
                                        this.engine.gameover();
                                        enemy.hit();
                                    }
                   
                                break;
                                case SPECIALMODE.JAPANMODE:
                                if(GameConfig.game.player.isPlayingNinjiaEffect){
                                    enemy.hit();
                                }else{
                                    player.die();
                                    this.engine.gameover();
                                    enemy.hit();
                                }      
                                break;
                                case SPECIALMODE.NINJAMODE:
                                    enemy.hit();
        
                                break;
                        }
                    }
                }
            }
        }

        catVsPickup(){
            var pickups = this.engine.pickupManager.pickups;
            var enemies = this.engine.enemyManager.enemies;

            for (var i = 0; i < enemies.length; i++) 
            {
                var enemy = enemies[i]
                if(enemy.isHit)continue;
                //console.log("cat eat!");
                for (var j = 0; j < pickups.length; j++){
                    var pickup = pickups[j]
                    if(pickup.isPickedUp) continue;

                    //console.log("chk cat eat!");
                    var xdist = pickup.position.x - enemy.position.x;
                    if(xdist > -pickup.width/2 && xdist < pickup.width/2)
                    {
                        var ydist = pickup.position.y - enemy.position.y;
                        //console.log("cat eat food1!");
                        if(ydist > -pickup.height/2 -20&& ydist < pickup.height/2)
                        {
                            //console.log("cat eat food!");
                            enemy.view.textures = enemy.stealFrames;
                            GameConfig.audio.play("catCome");
                            enemy.view.play();
                            enemy.isEatNow = true;
                            this.engine.pickupManager.removePickup(j,false,enemy);
                            //this.engine.pickup(i);
                        }
                    }
                }
            }
        }

        playerVsPickup(){
            
            var pickups = this.engine.pickupManager.pickups;
            var player = this.engine.player;
            
            for (var i = 0; i < pickups.length; i++) 
            {
                var pickup = pickups[i]
                if(pickup.isPickedUp) continue;
                
                var xdist = pickup.position.x - player.position.x;
                if(xdist > -pickup.width/2 && xdist < pickup.width/2)
                {
                    var ydist = pickup.position.y - player.position.y;
                
                    if(ydist > -pickup.height/2-20 && ydist < pickup.height/2)
                    {
                        this.engine.pickupManager.removePickup(i);
                        this.engine.pickup(i);

                    }
                }
            }
        }

        playerVsPlat(){
            var player = this.engine.player;
            var platforms = this.engine.platManager.platforms;

            for (var i = 0; i < platforms.length; i++) 
            {
                var plat = platforms[i];

                var xdist = plat.position.x - player.position.x;

                //check jump to the plat or not
                if(xdist > -plat.width/2 && xdist < plat.width/2)
                {
                    var ydist = plat.position.y - player.position.y;
                
                    if(ydist > -plat.height/2 -20&& ydist < plat.height/2)
                    {

                        if(player.position.y < plat.position.y-10){
                            
                            //player jump to the plat
                            player.position.y = plat.position.y-plat.height/2-player.height/2;
                            player.ground = player.position.y;

                            GameConfig.isOnPlat = true;
                            player.onGround = true;
                        }
                    }
                }
            }

            //check leave the plat
            if(GameConfig.isOnPlat){
                var flag = true;
                for (var i = 0; i < platforms.length; i++) 
                {
                    var plat = platforms[i];
    
                    var xdist = plat.position.x - player.position.x;
                    if(xdist > -plat.width/2 && xdist < plat.width/2)
                    {
                        var ydist = plat.position.y-plat.height/2-player.height/2 - player.position.y;
    
                        if(ydist <=0)
                        {
                            //console.log("noy");
                            flag = false;
                        }
                    }
                }
                
                if(flag){
                    
                    GameConfig.isOnPlat = false;;
                    player.ground = this.engine.player.floorHeight;
                    GameConfig.playerMode = PLAYMODE.FALL;
                    //console.log("leave plat");
                }
            }

        }

        playerVsFloor(){
            var floors = this.engine.floorManager.floors;
            var player = this.engine.player;
            
            var max = floors.length;
  
            player.onGround = false;
            
            if(player.position.y > GameConfig.height)
            {
                if(this.engine.isPlaying)
                {
                    player.boil();
                    //this.engine.view.doSplash();
                    this.engine.gameover();
                }
                else
                {
                    player.speed.x *= 0.95;
                    
                    if(!GameConfig.interactive)
                    {
                        //game end
                        //showGameover();
                        GameConfig.interactive = true;
                    }
                    
                    if(player.bounce === 0) {
                        player.bounce++;
                        player.boil();
                        //this.engine.view.doSplash();
                    }

                    return;
                }
            }
            
            for (var i = 0; i < max; i++) 
            {
                var floor = floors[i];
                var xdist = floor.position.x - player.position.x + 1135;

                //console.log(player.position.y + "/" + this.engine.player.floorHeight);
                if(player.position.y >= this.engine.player.floorHeight)
                {
                    if(xdist > 0 && xdist < 1135)
                    {
                        if(player.isDead)
                        {
                            player.bounce++;
                            
                            if(player.bounce > 2)
                            {						
                                return;
                            }

                                
                            player.speed.y *= -0.7;
                            player.speed.x *= 0.8;
                            
                            if(player.rotationSpeed > 0)
                            {
                                player.rotationSpeed = Math.random() * -0.3;
                            }
                            else if(player.rotationSpeed === 0)
                            {
                                player.rotationSpeed = Math.random() * 0.3;
                            }
                            else
                            {
                                player.rotationSpeed = 0;
                            }
                        }
                        else
                        {
                            player.speed.y = -0.3;
                        }
                        
                        
                        if(!player.isFlying)
                        {
                            player.position.y = this.engine.player.floorHeight;
                            player.onGround = true;
                            
                        }	
                    }
                }
            }

        }
    }

}
