/* =========================================================================
 *
 *  GameView.ts
 *  game view scene
 *
 * ========================================================================= */
/// <reference path="./System.ts" />
/// <reference path="./HashSet.ts" />
/// <reference path="./GameConfig.ts" />
/// <reference path="./GameUI.ts" />
/// <reference path="./GameItems.ts" />
module ECS {

        declare var TweenLite:any;
        declare var PIXI:any;
        declare var Elastic:any;
        declare var Sine:any;

        export class GameViewSystem extends System {

            game:any;
            gameFront:any;
            renderer:any;
            GameContainer:any;
            hudContainer:any;
            GameStage:any;

            scoreUI:any;
            bestScoreUI:any;
            distanceScoreUI:any;

            background:any;
            trail:any;
            trail2:any;
            count:number;
            zoom:number;
            white:any;
            splash:any;
            dust:any;
    
            specialFood:any;
            UIPanelUpRight:any;
            constructor() {
                super("game view");
                this.renderer = GameConfig.app.renderer;

                this.GameStage = new PIXI.Container();
                this.GameContainer = new PIXI.Container();
                
                //init scene layer
                this.hudContainer = new PIXI.Container();
                this.game = new PIXI.Container();
                this.gameFront = new PIXI.Container();
    
                this.GameContainer.addChild(this.game);
                this.GameContainer.addChild(this.gameFront);
            
                this.GameStage.addChild(this.GameContainer);
                this.GameStage.addChild(this.hudContainer);
    
                //background container
                this.background = (<GameBackGroundSystem>(GameConfig.allSystem.get("background"))).BackGroundContainer;
                this.game.addChild(this.background);
    
                this.count = 0;
                this.zoom = 1;
    
                GameConfig.xOffset = this.GameContainer.position.x;
                GameConfig.app.stage.addChild(this.GameStage);
            }
    
            showHud() {
                
                //up left ui panel
                this.specialFood = new Specialfood();

                //up right ui panel
                this.UIPanelUpRight = new GameUIPanelUpRight();
                this.scoreUI = new Score(this.UIPanelUpRight.startXList,this.UIPanelUpRight.startYList);
                this.bestScoreUI = new BestScore(this.UIPanelUpRight.startXList,this.UIPanelUpRight.startYList);
                this.distanceScoreUI = new DistanceScore(this.UIPanelUpRight.startXList,this.UIPanelUpRight.startYList);

                this.hudContainer.addChild(this.UIPanelUpRight.uiContainer);
                this.hudContainer.addChild(this.scoreUI.container);
                this.hudContainer.addChild(this.bestScoreUI.container);
                this.hudContainer.addChild(this.distanceScoreUI.container);

                this.hudContainer.addChild(this.specialFood);
            }
        
            
            update() {

                let kernel = GameConfig.game;

                this.count += 0.01;
            
                
                var ratio = (this.zoom - 1);
                var position = -GameConfig.width / 2
                var position2 = -kernel.player.view.position.x;
                var inter = position + (position2 - position) * ratio;
        
                this.GameContainer.position.x = inter * this.zoom;
                this.GameContainer.position.y = -kernel.player.view.position.y * this.zoom;
        
                this.GameContainer.position.x += GameConfig.width / 2;
                this.GameContainer.position.y += GameConfig.height / 2;
        
                GameConfig.xOffset = this.GameContainer.position.x;
        
                if (this.GameContainer.position.y > 0) this.GameContainer.position.y = 0;
                var yMax = -GameConfig.height * this.zoom;
                yMax += GameConfig.height;
        
                if (this.GameContainer.position.y < yMax) this.GameContainer.position.y = yMax;
        
                this.GameContainer.scale.x = this.zoom;
                this.GameContainer.scale.y = this.zoom;
                

                // this.trail.target = kernel.player;
                // this.trail2.target = kernel.player;
            
                // this.trail.update();
                // this.trail2.update();
                //this.dust.update();
            
                //this.lava.setPosition(GameConfig.camera.x + 4000);
                //this.bestScore.update();

                //update score ui panel
                if(this.scoreUI.currentScore !=kernel.score)this.scoreUI.setScore(kernel.score);
                if(this.distanceScoreUI.currentScore !=kernel.distanceScore)this.distanceScoreUI.setScore(kernel.distanceScore);
   

                var hightScore = this.bestScoreUI.LocalData.get('highscore') || 0;
                if(this.bestScoreUI.highScore != hightScore)this.bestScoreUI.update();

                this.renderer.render(GameConfig.app.stage);
            }
            

            // doSplash() {
            //     this.splash.splash(this.kernel.player.position);
            // }
            
            normalMode() {
                this.game.removeChild(this.background);
                this.game.addChildAt(this.background, 0);
                //this.stage.addChild(this.white)
                this.white.alpha = 1;
            
                TweenLite.to(this.white, 0.5, {
                    alpha: 0,
                    ease: Sine.easeOut
                });
            }
            
            // resize(w, h) {
            //     //    console.log("Width ->" + w);
            //     //    console.log("Height -> " + h);
            
            //     GameConfig.width = w;
            //     GameConfig.height = h;
            
            //     this.renderer.resize(w, h);
            //     this.background.width = w;
            
            //     this.bestScore.position.x = 900 ;
            //     this.bestScore.position.y =22;
            //     this.bestScore.scale.x = 0.3;
            //     this.bestScore.scale.y = 0.3;
            
            //     this.score.position.x = 740;
            //     this.score.position.y = 22;
            //     this.score.scale.x = 0.3;
            //     this.score.scale.y = 0.3;
    
            //     this.specialFood.position.x = 0;
            //     this.specialFood.position.y = 12;
    
            //     this.playUIPanel.position.x = 0;
            //     this.playUIPanel.position.y = 12;
            
            //     this.white.scale.x = w / 16;
            //     this.white.scale.y = h / 16;
            
            //     // this.powerBar.position.x = w - 295;
            //     // this.powerBar.position.y = 12;
            // }
    
        }
}