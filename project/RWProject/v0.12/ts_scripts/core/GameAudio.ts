/* =========================================================================
 *
 *  GameAudio.ts
 *  music for game(using cocoonjs and howl)
 *
 * ========================================================================= */
/// <reference path="./GameLocalData.ts" />
/// <reference path="./GameConfig.ts" />
/// <reference path="./Utils.ts" />
 module ECS{

    declare var Howl:any;
    declare var Howler:any;
    
     export class GameAudio{
        soundPool:any = {};
        loadedCount:number=0;
    
        device:any = new Utils.DeviceDetect();
        localData:any = new GameLocalData(GameConfig.localID);

        soundList:any;
        constructor(){
            this.soundList = [
                {   src: './audio/startScreen',
                    volume: 0.6,
                    maxVolume: 0.6,
                    loop: true,
                    autoPlay: false,
                    type: 'music',
                    name: 'StartMusic'},
                {
                    src: './audio/gameScreen',
                    volume: 0.6,
                    maxVolume: 0.6,
                    loop: true,
                    autoPlay: false,
                    type: 'music',
                    name: 'GameMusic'},
                {
                    src: './audio/jump01',
                    volume: 0.6,
                    maxVolume: 0.6,
                    loop: false,
                    autoPlay: false,
                    type: 'music',
                    name: 'jump'},
                {
                    src: './audio/indoNTiger',
                    volume: 0.6,
                    maxVolume: 0.6,
                    loop: false,
                    autoPlay: false,
                    type: 'music',
                    name: 'indoMode'},
                {
                    src: './audio/ninjiaStart',
                    volume: 0.6,
                    maxVolume: 0.6,
                    loop: false,
                    autoPlay: false,
                    type: 'music',
                    name: 'ninjiaMode'},
                {
                    src: './audio/ninjiaAttack',
                    volume: 0.6,
                    maxVolume: 0.6,
                    loop: false,
                    autoPlay: false,
                    type: 'music',
                    name: 'ninjiaModeAttack'},
                {
                    src: './audio/superMario',
                    volume: 0.6,
                    maxVolume: 0.6,
                    loop: true,
                    autoPlay: false,
                    type: 'music',
                    name: 'superMarioMode'},
                {
                    src: './audio/catCome',
                    volume: 0.6,
                    maxVolume: 0.6,
                    loop: false,
                    autoPlay: false,
                    type: 'music',
                    name: 'catCome'},
                {
                    src: './audio/catDead',
                    volume: 0.6,
                    maxVolume: 0.6,
                    loop: false,
                    autoPlay: false,
                    type: 'music',
                    name: 'catDead'},
                {
                    src: './audio/pickUpFood',
                    volume: 0.6,
                    maxVolume: 0.6,
                    loop: false,
                    autoPlay: false,
                    type: 'music',
                    name: 'pickUpFood'},
                {
                    src: './audio/playerDead',
                    volume: 0.6,
                    maxVolume: 0.6,
                    loop: false,
                    autoPlay: false,
                    type: 'music',
                    name: 'playerDead'}
            ];
            this.init();
        }
        init() {

            for (var i = 0; i < this.soundList.length; i++) {
                var cSound = this.soundList[i];

                cSound.audio = new Howl({
                    src: [cSound.src + ".mp3"],
                    html5: true,
                    loop:cSound.loop,
                    onload: ()=> { 
                        // this.loadedCount++;  
                        // if(this.loadedCount == this.soundList.length){
                        //     console.log("all music loaded");
                        //     this.setVolume('StartMusic', 0.1);
                        //     this.play("StartMusic");
                        // }
 
                    },
                    onloaderror:()=>{
                        alert("load sound error!");
                    }
                });

                this.soundPool[cSound.name] = cSound;
            }
            

        }
    
        play(id) {
            if (this.soundPool.hasOwnProperty(id)) {
                this.soundPool[id].audio.play();
    
            } else {
                console.log("WARNING :: Couldn't find sound '" + id + "'.");
            }
        }

        soundExists(id) {
            return this.soundPool.hasOwnProperty(id);
        }
    
        setVolume(id, volume) {
            if (!this.soundExists(id)) return;

            Howler.volume(volume);
        }
    
        stop(id) {
            this.soundPool[id].audio.stop();
        }
     }
 }