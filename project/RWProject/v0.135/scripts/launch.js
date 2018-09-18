var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Utils;
(function (Utils) {
    ;
    var HashSet = /** @class */ (function () {
        function HashSet() {
            this.items = {};
        }
        HashSet.prototype.set = function (key, value) {
            this.items[key] = value;
        };
        HashSet.prototype["delete"] = function (key) {
            return delete this.items[key];
        };
        HashSet.prototype.has = function (key) {
            return key in this.items;
        };
        HashSet.prototype.get = function (key) {
            return this.items[key];
        };
        HashSet.prototype.len = function () {
            return Object.keys(this.items).length;
        };
        HashSet.prototype.forEach = function (f) {
            for (var k in this.items) {
                f(k, this.items[k]);
            }
        };
        return HashSet;
    }());
    Utils.HashSet = HashSet;
})(Utils || (Utils = {}));
/* =========================================================================
 *
 *  Component.ts
 *  Each entity can obtain many components
 *
 * ========================================================================= */
/// <reference path="./HashSet.ts" />
var ECS;
(function (ECS) {
    var Component = /** @class */ (function () {
        function Component(name) {
            this.name = name;
        }
        return Component;
    }());
    ECS.Component = Component;
})(ECS || (ECS = {}));
/* =========================================================================
 *
 *  Utils.ts
 *  Tools
 *
 * ========================================================================= */
var Utils;
(function (Utils) {
    var DeviceDetect = /** @class */ (function () {
        function DeviceDetect() {
            this.arora = false;
            this.chrome = false;
            this.epiphany = false;
            this.firefox = false;
            this.mobileSafari = false;
            this.ie = false;
            this.ieVersion = 0;
            this.midori = false;
            this.opera = false;
            this.safari = false;
            this.webApp = false;
            this.cocoonJS = false;
            this.android = false;
            this.chromeOS = false;
            this.iOS = false;
            this.linux = false;
            this.macOS = false;
            this.windows = false;
            this.desktop = false;
            this.pixelRatio = 0;
            this.iPhone = false;
            this.iPhone4 = false;
            this.iPad = false;
            this.blob = false;
            this.canvas = false;
            this.localStorage = false;
            this.file = false;
            this.fileSystem = false;
            this.webGL = false;
            this.worker = false;
            this.audioData = false;
            this.webAudio = false;
            this.ogg = false;
            this.opus = false;
            this.mp3 = false;
            this.wav = false;
            this.m4a = false;
            this.webm = false;
            this.touch = false;
            var ua = navigator.userAgent;
            this.CheckBrowser(ua);
            this.CheckOS(ua);
            this.CheckDevice();
            this.CheckAudio();
            this.CheckFeatures();
        }
        DeviceDetect.prototype.CheckBrowser = function (ua) {
            if (/Arora/.test(ua)) {
                this.arora = true;
            }
            else if (/Chrome/.test(ua)) {
                this.chrome = true;
            }
            else if (/Epiphany/.test(ua)) {
                this.epiphany = true;
            }
            else if (/Firefox/.test(ua)) {
                this.firefox = true;
            }
            else if (/Mobile Safari/.test(ua)) {
                this.mobileSafari = true;
            }
            else if (/MSIE (\d+\.\d+);/.test(ua)) {
                this.ie = true;
                this.ieVersion = parseInt(RegExp.$1, 10);
            }
            else if (/Midori/.test(ua)) {
                this.midori = true;
            }
            else if (/Opera/.test(ua)) {
                this.opera = true;
            }
            else if (/Safari/.test(ua)) {
                this.safari = true;
            }
            // Native Application
            if (navigator['standalone']) {
                this.webApp = true;
            }
            // CocoonJS Application
            if (navigator['isCocoonJS']) {
                this.cocoonJS = true;
            }
        };
        DeviceDetect.prototype.CheckOS = function (ua) {
            if (/Android/.test(ua)) {
                this.android = true;
            }
            else if (/CrOS/.test(ua)) {
                this.chromeOS = true;
            }
            else if (/iP[ao]d|iPhone/i.test(ua)) {
                this.iOS = true;
            }
            else if (/Linux/.test(ua)) {
                this.linux = true;
            }
            else if (/Mac OS/.test(ua)) {
                this.macOS = true;
            }
            else if (/Windows/.test(ua)) {
                this.windows = true;
            }
            if (this.windows || this.macOS || this.linux) {
                this.desktop = true;
            }
        };
        DeviceDetect.prototype.CheckDevice = function () {
            this.pixelRatio = window['devicePixelRatio'] || 1;
            this.iPhone = navigator.userAgent.toLowerCase().indexOf('iphone') !== -1;
            this.iPhone4 = (this.pixelRatio === 2 && this.iPhone);
            this.iPad = navigator.userAgent.toLowerCase().indexOf('ipad') !== -1;
        };
        DeviceDetect.prototype.CheckFeatures = function () {
            if (typeof window['Blob'] !== 'undefined')
                this.blob = true;
            this.canvas = !!window['CanvasRenderingContext2D'];
            try {
                this.localStorage = !!localStorage.getItem;
            }
            catch (error) {
                this.localStorage = false;
            }
            this.file = !!window['File'] && !!window['FileReader'] && !!window['FileList'] && !!window['Blob'];
            this.fileSystem = !!window['requestFileSystem'];
            this.webGL = !!window['WebGLRenderingContext'];
            this.worker = !!window['Worker'];
            if ('ontouchstart' in document.documentElement || window.navigator.msPointerEnabled) {
                this.touch = true;
            }
        };
        DeviceDetect.prototype.CheckAudio = function () {
            this.audioData = !!(window['Audio']);
            this.webAudio = !!(window['webkitAudioContext'] || window['AudioContext']);
            var audioElement = document.createElement('audio');
            var result = false;
            try {
                if (result = !!audioElement.canPlayType) {
                    if (audioElement.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, '')) {
                        this.ogg = true;
                    }
                    if (audioElement.canPlayType('audio/mpeg;').replace(/^no$/, '')) {
                        this.mp3 = true;
                    }
                    // Mimetypes accepted:
                    //   developer.mozilla.org/En/Media_formats_supported_by_the_audio_and_video_elements
                    //   bit.ly/iphoneoscodecs
                    if (audioElement.canPlayType('audio/wav; codecs="1"').replace(/^no$/, '')) {
                        this.wav = true;
                    }
                    if (audioElement.canPlayType('audio/x-m4a;') || audioElement.canPlayType('audio/aac;').replace(/^no$/, '')) {
                        this.m4a = true;
                    }
                }
            }
            catch (e) { }
        };
        DeviceDetect.prototype.PrintInfo = function () {
            var output = "DEVICE OUTPUT\n\n";
            output += "---\n";
            output += "Browser Info :: \n";
            output += "Arora : " + this.arora + "\n";
            output += "Chrome : " + this.chrome + "\n";
            output += "Epiphany : " + this.epiphany + "\n";
            output += "Firefox : " + this.firefox + "\n";
            output += "Mobile Safari : " + this.mobileSafari + "\n";
            output += "IE : " + this.ie;
            if (this.ie) {
                output += " (Version " + this.ieVersion + ")\n";
            }
            else {
                output += "\n";
            }
            output += "Midori : " + this.midori + "\n";
            output += "Opera : " + this.opera + "\n";
            output += "Safari : " + this.safari + "\n";
            output += "Web App : " + this.webApp + "\n";
            output += "CocoonJS : " + this.cocoonJS + "\n";
            output += "Android : " + this.android + "\n";
            output += "---\n";
            output += "Operating System :: \n";
            output += "Chrome OS : " + this.chromeOS + "\n";
            output += "iOS : " + this.iOS + "\n";
            output += "Linux : " + this.linux + "\n";
            output += "Mac OS : " + this.macOS + "\n";
            output += "Windows : " + this.windows + "\n";
            output += "Desktop : " + this.desktop + "\n";
            output += "---\n";
            output += "Device Type : \n";
            output += "Pixel Ratio : " + this.pixelRatio + "\n";
            output += "iPhone : " + this.iPhone + "\n";
            output += "iPhone 4 : " + this.iPhone4 + "\n";
            output += "iPad : " + this.iPad + "\n";
            output += "---\n";
            output += "Features :: \n";
            output += "Blob : " + this.blob + "\n";
            output += "Canvas : " + this.canvas + "\n";
            output += "LocalStorage : " + this.localStorage + "\n";
            output += "File : " + this.file + "\n";
            output += "File System : " + this.fileSystem + "\n";
            output += "WebGL : " + this.webGL + "\n";
            output += "Workers : " + this.worker + "\n";
            output += "---\n";
            output += "Audio :: \n";
            output += "AudioData : " + this.audioData + "\n";
            output += "WebAudio : " + this.webAudio + "\n";
            output += "Supports .ogg : " + this.ogg + "\n";
            output += "Supports Opus : " + this.opus + "\n";
            output += "Supports .mp3 : " + this.mp3 + "\n";
            output += "Supports .wav : " + this.wav + "\n";
            output += "Supports .m4a : " + this.m4a + "\n";
            output += "Supports .webm : " + this.webm;
            return output;
        };
        return DeviceDetect;
    }());
    Utils.DeviceDetect = DeviceDetect;
})(Utils || (Utils = {}));
/* =========================================================================
 *
 *  GameConfig.ts
 *  config file
 *
 * ========================================================================= */
/// <reference path="./HashSet.ts" />
var ECS;
(function (ECS) {
    var GameRunTime = /** @class */ (function () {
        function GameRunTime() {
            this.DELTA_TIME = 1;
            this.lastTime = Date.now();
            this.speed = 1;
        }
        GameRunTime.prototype.update = function () {
            var time = Date.now();
            var currentTime = time;
            this.currentTime = currentTime;
            //console.log("current time:"+currentTime);
            var passedTime = currentTime - this.lastTime;
            this.DELTA_TIME = ((passedTime) * 0.06);
            this.DELTA_TIME *= this.speed;
            if (this.DELTA_TIME > 2.3)
                this.DELTA_TIME = 2.3;
            this.lastTime = currentTime;
        };
        return GameRunTime;
    }());
    ECS.GameRunTime = GameRunTime;
    var FOODMODE;
    (function (FOODMODE) {
        FOODMODE[FOODMODE["JAPAN"] = 0] = "JAPAN";
        FOODMODE[FOODMODE["INDON"] = 1] = "INDON";
    })(FOODMODE = ECS.FOODMODE || (ECS.FOODMODE = {}));
    var SPECIALMODE;
    (function (SPECIALMODE) {
        SPECIALMODE[SPECIALMODE["NONE"] = 0] = "NONE";
        SPECIALMODE[SPECIALMODE["JAPANMODE"] = 1] = "JAPANMODE";
        SPECIALMODE[SPECIALMODE["INDONMODE"] = 2] = "INDONMODE";
        SPECIALMODE[SPECIALMODE["NINJAMODE"] = 3] = "NINJAMODE";
    })(SPECIALMODE = ECS.SPECIALMODE || (ECS.SPECIALMODE = {}));
    var GAMEMODE;
    (function (GAMEMODE) {
        GAMEMODE[GAMEMODE["TITLE"] = 0] = "TITLE";
        GAMEMODE[GAMEMODE["COUNT_DOWN"] = 1] = "COUNT_DOWN";
        GAMEMODE[GAMEMODE["PLAYING"] = 2] = "PLAYING";
        GAMEMODE[GAMEMODE["GAME_OVER"] = 3] = "GAME_OVER";
        GAMEMODE[GAMEMODE["INTRO"] = 4] = "INTRO";
        GAMEMODE[GAMEMODE["PAUSED"] = 5] = "PAUSED";
    })(GAMEMODE = ECS.GAMEMODE || (ECS.GAMEMODE = {}));
    var PLAYMODE;
    (function (PLAYMODE) {
        PLAYMODE[PLAYMODE["RUNNING"] = 0] = "RUNNING";
        PLAYMODE[PLAYMODE["JUMPING1"] = 1] = "JUMPING1";
        PLAYMODE[PLAYMODE["JUMPING2"] = 2] = "JUMPING2";
        PLAYMODE[PLAYMODE["FALL"] = 3] = "FALL";
        PLAYMODE[PLAYMODE["SLIDE"] = 4] = "SLIDE";
    })(PLAYMODE = ECS.PLAYMODE || (ECS.PLAYMODE = {}));
    var GameConfig = /** @class */ (function () {
        function GameConfig() {
        }
        GameConfig.timeClock = function () {
            return this.tmpTimeClockEnd - this.tmpTimeClockStart;
        };
        GameConfig.timeClock1 = function () {
            return this.tmpTimeClockEnd1 - this.tmpTimeClockStart1;
        };
        GameConfig.width = 800;
        GameConfig.height = 600;
        GameConfig.xOffset = 0;
        GameConfig.high_mode = true;
        GameConfig.camera = new PIXI.Point();
        GameConfig.localID = "rw.raymond.wang";
        GameConfig.newHighScore = false;
        GameConfig.time = new GameRunTime();
        GameConfig.interactive = true;
        GameConfig.specialMode = SPECIALMODE.NONE;
        GameConfig.isOnPlat = false;
        return GameConfig;
    }());
    ECS.GameConfig = GameConfig;
})(ECS || (ECS = {}));
/* =========================================================================
 *
 *  System.ts
 *  system using for controlling the game
 *
 * ========================================================================= */
/// <reference path="./HashSet.ts" />
/// <reference path="./Utils.ts" />
/// <reference path="./GameConfig.ts" />
var ECS;
(function (ECS) {
    var System = /** @class */ (function () {
        function System(name) {
            this.name = name;
        }
        System.prototype.Init = function () {
            console.log("[" + this.name + "]System initialization!");
        };
        System.prototype.Execute = function () {
            console.log("[" + this.name + "]System Execute!");
        };
        return System;
    }());
    ECS.System = System;
})(ECS || (ECS = {}));
/* =========================================================================
 *
 *  Entity.js
 *  Each entity has an unique ID
 *
 * ========================================================================= */
/// <reference path="./Component.ts" />
/// <reference path="./HashSet.ts" />
var ECS;
(function (ECS) {
    var Entity = /** @class */ (function () {
        function Entity(name) {
            this.name = name;
            this.id = (+new Date()).toString(16) +
                (Math.random() * 100000000 | 0).toString(16) +
                this.count;
            this.count++;
            this.components = new Utils.HashSet();
        }
        Entity.prototype.addComponent = function (component) {
            this.components.set(component.name, component);
            //console.log("add ["+component.name+"] component");
        };
        Entity.prototype.removeComponent = function (component) {
            var name = component.name;
            var deletOrNot = this.components["delete"](name);
            if (deletOrNot) {
                console.log("delete [" + name + "] success!");
            }
            else {
                console.log("delete [" + name + "] fail! not exist!");
            }
        };
        return Entity;
    }());
    ECS.Entity = Entity;
})(ECS || (ECS = {}));
/* =========================================================================
 *
 *  GameLocalData.ts
 *  local storage for game
 *
 * ========================================================================= */
var ECS;
(function (ECS) {
    var GameLocalData = /** @class */ (function () {
        function GameLocalData(id) {
            this.id = id;
        }
        GameLocalData.prototype.store = function (key, value) {
            localStorage.setItem(this.id + '.' + key, value);
        };
        GameLocalData.prototype.get = function (key) {
            return localStorage.getItem(this.id + '.' + key) || 0;
        };
        GameLocalData.prototype.remove = function (key) {
            localStorage.removeItem(this.id + '.' + key);
        };
        GameLocalData.prototype.reset = function () {
            for (var i in localStorage) {
                if (i.indexOf(this.id + '.') !== -1)
                    localStorage.removeItem(i);
            }
        };
        return GameLocalData;
    }());
    ECS.GameLocalData = GameLocalData;
})(ECS || (ECS = {}));
/* =========================================================================
 *
 *  GameAudio.ts
 *  music for game(using cocoonjs and howl)
 *
 * ========================================================================= */
/// <reference path="./GameLocalData.ts" />
/// <reference path="./GameConfig.ts" />
/// <reference path="./Utils.ts" />
var ECS;
(function (ECS) {
    var GameAudio = /** @class */ (function () {
        function GameAudio() {
            this.soundPool = {};
            this.device = new Utils.DeviceDetect();
            this.localData = new ECS.GameLocalData(ECS.GameConfig.localID);
            this.soundList = [
                { src: './audio/startScreen',
                    volume: 0.6,
                    maxVolume: 0.6,
                    loop: true,
                    autoPlay: false,
                    type: 'music',
                    name: 'StartMusic' },
                {
                    src: './audio/gameScreen',
                    volume: 0.6,
                    maxVolume: 0.6,
                    loop: true,
                    autoPlay: false,
                    type: 'music',
                    name: 'GameMusic'
                },
                {
                    src: './audio/jump01',
                    volume: 0.6,
                    maxVolume: 0.6,
                    loop: false,
                    autoPlay: false,
                    type: 'music',
                    name: 'jump'
                },
                {
                    src: './audio/indoNTiger',
                    volume: 0.6,
                    maxVolume: 0.6,
                    loop: false,
                    autoPlay: false,
                    type: 'music',
                    name: 'indoMode'
                },
                {
                    src: './audio/ninjiaStart',
                    volume: 0.6,
                    maxVolume: 0.6,
                    loop: false,
                    autoPlay: false,
                    type: 'music',
                    name: 'ninjiaMode'
                },
                {
                    src: './audio/ninjiaAttack',
                    volume: 0.6,
                    maxVolume: 0.6,
                    loop: false,
                    autoPlay: false,
                    type: 'music',
                    name: 'ninjiaModeAttack'
                },
                {
                    src: './audio/superMario',
                    volume: 0.6,
                    maxVolume: 0.6,
                    loop: true,
                    autoPlay: false,
                    type: 'music',
                    name: 'superMarioMode'
                },
                {
                    src: './audio/catCome',
                    volume: 0.6,
                    maxVolume: 0.6,
                    loop: false,
                    autoPlay: false,
                    type: 'music',
                    name: 'catCome'
                },
                {
                    src: './audio/catDead',
                    volume: 0.6,
                    maxVolume: 0.6,
                    loop: false,
                    autoPlay: false,
                    type: 'music',
                    name: 'catDead'
                },
                {
                    src: './audio/pickUpFood',
                    volume: 0.6,
                    maxVolume: 0.6,
                    loop: false,
                    autoPlay: false,
                    type: 'music',
                    name: 'pickUpFood'
                },
                {
                    src: './audio/playerDead',
                    volume: 0.6,
                    maxVolume: 0.6,
                    loop: false,
                    autoPlay: false,
                    type: 'music',
                    name: 'playerDead'
                }
            ];
            this.init();
        }
        GameAudio.prototype.init = function () {
            for (var i = 0; i < this.soundList.length; i++) {
                var cSound = this.soundList[i];
                cSound.audio = new Howl({
                    src: [cSound.src + ".mp3"],
                    html5: true,
                    loop: cSound.loop,
                    onload: function () {
                    },
                    onloaderror: function () {
                        alert("load sound error!");
                    }
                });
                this.soundPool[cSound.name] = cSound;
            }
        };
        GameAudio.prototype.play = function (id) {
            if (this.soundPool.hasOwnProperty(id)) {
                this.soundPool[id].audio.play();
            }
            else {
                console.log("WARNING :: Couldn't find sound '" + id + "'.");
            }
        };
        GameAudio.prototype.soundExists = function (id) {
            return this.soundPool.hasOwnProperty(id);
        };
        GameAudio.prototype.setVolume = function (id, volume) {
            if (!this.soundExists(id))
                return;
            Howler.volume(volume);
        };
        GameAudio.prototype.stop = function (id) {
            this.soundPool[id].audio.stop();
        };
        return GameAudio;
    }());
    ECS.GameAudio = GameAudio;
})(ECS || (ECS = {}));
/* =========================================================================
 *
 *  GameBackGround.ts
 *  game view scene - background
 *
 * ========================================================================= */
/// <reference path="./System.ts" />
var ECS;
(function (ECS) {
    var BackGroundElement = /** @class */ (function () {
        function BackGroundElement(texture) {
            this.sprites = [];
            this.spriteWidth = texture.width - 5;
            this.spriteHeight = ECS.GameConfig.height * 4 / 5;
            var amount = 3;
            for (var i = 0; i < amount; i++) {
                var sprite = new PIXI.Sprite(texture);
                sprite.height = ECS.GameConfig.height * 4 / 5;
                sprite.position.y = 0;
                this.sprites.push(sprite);
            }
            ;
            this.speed = 1;
        }
        BackGroundElement.prototype.setPosition = function (position) {
            var h = this.spriteWidth;
            for (var i = 0; i < this.sprites.length; i++) {
                var pos = -position * this.speed;
                pos += i * h;
                pos %= h * this.sprites.length;
                pos += h / 2;
                if (!ECS.GameConfig.device.desktop)
                    pos += h / 2;
                this.sprites[i].position.x = pos;
            }
            ;
        };
        return BackGroundElement;
    }());
    ECS.BackGroundElement = BackGroundElement;
    var GameBackGroundSystem = /** @class */ (function (_super) {
        __extends(GameBackGroundSystem, _super);
        function GameBackGroundSystem() {
            var _this = _super.call(this, "view-background") || this;
            _this.BackGroundContainer = new PIXI.Container();
            _this.width = ECS.GameConfig.width;
            _this.scrollPosition = ECS.GameConfig.camera.x;
            var bgTex = PIXI.loader.resources["img/bg_up.png"].texture;
            if (!ECS.GameConfig.device.desktop)
                bgTex = PIXI.loader.resources["img/bg_up_ios.png"].texture;
            _this.bgTex = new BackGroundElement(bgTex);
            for (var i = 0; i < _this.bgTex.sprites.length; i++) {
                _this.BackGroundContainer.addChild(_this.bgTex.sprites[i]);
            }
            _this.tree1 = PIXI.Sprite.fromFrame("tree1.png");
            _this.tree1.anchor.x = 0.5;
            _this.tree1.anchor.y = 0.5;
            _this.tree1.width = 200;
            _this.tree1.height = ECS.GameConfig.height / 3;
            _this.tree1.position.y = _this.bgTex.spriteHeight - _this.tree1.height / 2;
            _this.BackGroundContainer.addChild(_this.tree1);
            _this.tree2 = PIXI.Sprite.fromFrame("tree2.png");
            _this.tree2.anchor.x = 0.5;
            _this.tree2.anchor.y = 0.5;
            _this.tree2.width = 200;
            _this.tree2.height = ECS.GameConfig.height / 3;
            _this.tree2.position.y = _this.bgTex.spriteHeight - _this.tree2.height / 2;
            _this.BackGroundContainer.addChild(_this.tree2);
            _this.cloud1 = PIXI.Sprite.fromFrame("cloud1.png");
            _this.cloud1.position.y = ECS.GameConfig.height / 5;
            _this.BackGroundContainer.addChild(_this.cloud1);
            _this.cloud2 = PIXI.Sprite.fromFrame("cloud2.png");
            _this.cloud2.position.y = ECS.GameConfig.height / 8;
            _this.BackGroundContainer.addChild(_this.cloud2);
            ;
            _this.bgTex.speed = 1 / 2;
            ECS.GameConfig.app.ticker.add(function (delta) {
                // console.log("background run!");
                _this.scrollPosition = ECS.GameConfig.camera.x;
                var intervalDistance = ECS.GameConfig.width;
                var treePos = -_this.scrollPosition * 1.5 / 2;
                treePos %= _this.width + intervalDistance;
                treePos += _this.width + intervalDistance;
                treePos -= _this.tree1.width / 2;
                _this.tree1.position.x = treePos - ECS.GameConfig.xOffset;
                var treePos2 = -(_this.scrollPosition + _this.width / 2) * 1.5 / 2;
                treePos2 %= _this.width + intervalDistance;
                treePos2 += _this.width + intervalDistance;
                treePos2 -= _this.tree2.width / 2;
                _this.tree2.position.x = treePos2 - ECS.GameConfig.xOffset;
                var cloud1Pos = -_this.scrollPosition * 1.5 / 2;
                cloud1Pos %= _this.width + intervalDistance;
                cloud1Pos += _this.width + intervalDistance;
                cloud1Pos -= _this.cloud1.width / 2;
                _this.cloud1.position.x = cloud1Pos - ECS.GameConfig.xOffset;
                var cloud2Pos = -(_this.scrollPosition + _this.width / 2) * 1.5 / 2;
                cloud2Pos %= _this.width + intervalDistance;
                cloud2Pos += _this.width + intervalDistance;
                cloud2Pos -= _this.cloud2.width / 2;
                _this.cloud2.position.x = cloud2Pos - ECS.GameConfig.xOffset;
                _this.bgTex.setPosition(_this.scrollPosition);
            });
            return _this;
        }
        return GameBackGroundSystem;
    }(ECS.System));
    ECS.GameBackGroundSystem = GameBackGroundSystem;
})(ECS || (ECS = {}));
/* =========================================================================
 *
 *  GameUI.ts
 *  game ui panel
 *
 * ========================================================================= */
/// <reference path="./GameConfig.ts" />
var ECS;
(function (ECS) {
    function formatScore(n) {
        var nArray = n.toString().split("");
        var text = "";
        var total = nArray.length;
        var offset = (total % 3) - 1;
        for (var i = 0; i < total; i++) {
            text += nArray[i];
        }
        return text;
    }
    //UIPanel
    var GameUIPanelUpRight = /** @class */ (function () {
        function GameUIPanelUpRight() {
            this.ratio = 0.6;
            this.uiContainer = new PIXI.Container();
            this.uiList = ["Score.png",
                "Best Score.png",
                "Distance.png",
                "Pause.png"];
            this.startXList = new Array();
            this.startYList = new Array();
            var allSpritesLength = 0;
            this.uiSprites = [];
            for (var i = 0; i < this.uiList.length; i++) {
                this.uiList[i] = PIXI.Texture.fromFrame(this.uiList[i]);
                this.uiSprites[i] = new PIXI.Sprite(this.uiList[i]);
                this.uiSprites[i].scale.x = this.ratio;
                this.uiSprites[i].scale.y = this.ratio;
                allSpritesLength += this.uiSprites[i].width;
            }
            this.startX = ECS.GameConfig.width - allSpritesLength;
            for (var i = 0; i < this.uiList.length; i++) {
                this.startXList.push(this.startX);
                this.startYList.push(this.uiSprites[i].height);
                this.uiContainer.addChild(this.uiSprites[i]);
                this.uiSprites[i].position.x = this.startX;
                this.startX += this.uiSprites[i].width;
            }
        }
        return GameUIPanelUpRight;
    }());
    ECS.GameUIPanelUpRight = GameUIPanelUpRight;
    var NumberUI = /** @class */ (function () {
        function NumberUI(startXList, startYList) {
            this.currentScore = 0;
            this.ratio = 1;
            this.xOffset = 15;
            this.yOffset = 15;
            this.ratio = 0.3;
            this.startX = startXList[1];
            this.startY = startYList[0];
            this.container = new PIXI.Container();
            this.tmpList = [];
            this.numberList = {
                0: "Number-0.png",
                1: "Number-1.png",
                2: "Number-2.png",
                3: "Number-3.png",
                4: "Number-4.png",
                5: "Number-5.png",
                6: "Number-6.png",
                7: "Number-7.png",
                8: "Number-8.png",
                9: "Number-9.png"
            };
            for (var s in this.numberList)
                this.numberList[s] = PIXI.Texture.fromFrame(this.numberList[s]);
            this.numberSprite = [];
            for (var i = 0; i < 10; i++) {
                this.numberSprite[i] = new PIXI.Sprite(this.numberList[i]);
                this.numberSprite[i].scale.x = this.ratio;
                this.numberSprite[i].scale.y = this.ratio;
            }
            this.setScore(0);
        }
        NumberUI.prototype.resetScore = function () {
            for (var i = 0; i < this.tmpList.length; i++) {
                this.container.removeChild(this.tmpList[i]);
            }
        };
        NumberUI.prototype.setScore = function (score) {
            this.currentScore = score;
            this.resetScore();
            var split = formatScore(score).split("");
            var position = this.startX - this.xOffset;
            var allLength = 0;
            //count all number length
            for (var i = 0; i < split.length; i++) {
                var l = this.numberList[split[i]].width * this.ratio;
                allLength += l;
            }
            position -= allLength;
            for (var i = 0; i < split.length; i++) {
                var ns = this.numberSprite[i];
                ns.visible = true;
                ns.setTexture(this.numberList[split[i]]);
                ns.position.x = position;
                ns.position.y = this.startY / 2 - this.yOffset;
                position += ns.width;
                this.tmpList.push(ns);
                this.container.addChild(ns);
            }
        };
        return NumberUI;
    }());
    ECS.NumberUI = NumberUI;
    var Score = /** @class */ (function (_super) {
        __extends(Score, _super);
        function Score(startXList, startYList) {
            return _super.call(this, startXList, startYList) || this;
        }
        return Score;
    }(NumberUI));
    ECS.Score = Score;
    var BestScore = /** @class */ (function (_super) {
        __extends(BestScore, _super);
        function BestScore(startXList, startYList) {
            var _this = _super.call(this, startXList, startYList) || this;
            _this.startX = startXList[2];
            _this.LocalData = new ECS.GameLocalData(ECS.GameConfig.localID);
            _this.hightScore = _this.LocalData.get('highscore') || 0;
            _this.update();
            return _this;
        }
        BestScore.prototype.update = function () {
            this.setScore(this.LocalData.get('highscore') || 0);
        };
        return BestScore;
    }(NumberUI));
    ECS.BestScore = BestScore;
    var DistanceScore = /** @class */ (function (_super) {
        __extends(DistanceScore, _super);
        function DistanceScore(startXList, startYList) {
            var _this = _super.call(this, startXList, startYList) || this;
            _this.startX = startXList[3];
            _this.setScore(0);
            return _this;
        }
        return DistanceScore;
    }(NumberUI));
    ECS.DistanceScore = DistanceScore;
})(ECS || (ECS = {}));
/* =========================================================================
 *
 *  GameItems.ts
 *  item
 *
 * ========================================================================= */
/// <reference path="./GameConfig.ts" />
var ECS;
(function (ECS) {
    var PickUp = /** @class */ (function () {
        function PickUp() {
            this.pickupTextures = ["pickup_01.png", "pickup_02.png", "pickup_03.png", "pickup_04.png", "pickup_05.png", "pickup_06.png", "pickup_07.png", "pickup_08.png"];
            this.position = new PIXI.Point();
            this.view = new PIXI.Container();
            this.clip = new PIXI.Sprite(PIXI.Texture.fromFrame(this.pickupTextures[Math.floor(Math.random() * this.pickupTextures.length)]));
            this.clip.anchor.x = 0.5;
            this.clip.anchor.y = 0.5;
            this.shine = PIXI.Sprite.fromFrame("pickupShine.png");
            this.shine.anchor.x = this.shine.anchor.y = 0.5;
            this.shine.scale.x = this.shine.scale.y = 1;
            this.shine.alpha = 0.5;
            this.view.addChild(this.shine);
            this.view.addChild(this.clip);
            this.width = 100;
            this.height = 100;
            this.count = Math.random() * 300;
        }
        PickUp.prototype.update = function () {
            if (!this.isPickedUp) {
                this.count += 0.1 * ECS.GameConfig.time.DELTA_TIME;
                this.clip.scale.x = 0.55 + Math.sin(this.count) * 0.1;
                this.clip.scale.y = 0.55 - Math.cos(this.count) * 0.1;
                this.clip.rotation = Math.sin(this.count * 1.5) * 0.2;
                this.shine.rotation = this.count * 0.2;
            }
            else {
                this.view.scale.x = 1 - this.ratio;
                this.view.scale.y = 1 - this.ratio;
                this.position.x = this.pickupPosition.x + (this.player.position.x - this.pickupPosition.x) * this.ratio;
                this.position.y = this.pickupPosition.y + (this.player.position.y - this.pickupPosition.y) * this.ratio;
            }
            this.view.position.x = this.position.x - ECS.GameConfig.camera.x;
            this.view.position.y = this.position.y;
        };
        return PickUp;
    }());
    ECS.PickUp = PickUp;
    var Specialfood = /** @class */ (function () {
        function Specialfood() {
            PIXI.DisplayObjectContainer.call(this);
            this.foods = ["Food Grey.png",
                "Food Grey.png",
                "Food Grey.png",
                "Food Grey.png"];
            this.activeFoods = ["Food.png",
                "Food.png",
                "Food.png",
                "Food.png"];
            for (var i = 0; i < 4; i++) {
                this.foods[i] = PIXI.Texture.fromFrame(this.foods[i]);
                this.activeFoods[i] = PIXI.Texture.fromFrame(this.activeFoods[i]);
            }
            this.startX = 10;
            this.digits = [];
            for (var i = 0; i < 4; i++) {
                this.digits[i] = new PIXI.Sprite(this.foods[i]);
                this.digits[i].scale.x = 0.6;
                this.digits[i].scale.y = 0.6;
                this.addChild(this.digits[i]);
                this.setFoodPic(this.digits[i], i * this.digits[i].width);
            }
        }
        return Specialfood;
    }());
    ECS.Specialfood = Specialfood;
    Specialfood.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
    Specialfood.prototype.setFoodPic = function (ui, posx) {
        ui.position.x = this.startX + posx;
    };
})(ECS || (ECS = {}));
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
var ECS;
(function (ECS) {
    var GameViewSystem = /** @class */ (function (_super) {
        __extends(GameViewSystem, _super);
        function GameViewSystem() {
            var _this = _super.call(this, "game view") || this;
            _this.renderer = ECS.GameConfig.app.renderer;
            _this.GameStage = new PIXI.Container();
            _this.GameContainer = new PIXI.Container();
            //init scene layer
            _this.hudContainer = new PIXI.Container();
            _this.game = new PIXI.Container();
            _this.gameFront = new PIXI.Container();
            _this.GameContainer.addChild(_this.game);
            _this.GameContainer.addChild(_this.gameFront);
            _this.GameStage.addChild(_this.GameContainer);
            _this.GameStage.addChild(_this.hudContainer);
            //background container
            _this.background = (ECS.GameConfig.allSystem.get("background")).BackGroundContainer;
            _this.game.addChild(_this.background);
            _this.count = 0;
            _this.zoom = 1;
            ECS.GameConfig.xOffset = _this.GameContainer.position.x;
            ECS.GameConfig.app.stage.addChild(_this.GameStage);
            return _this;
        }
        GameViewSystem.prototype.showHud = function () {
            //up left ui panel
            this.specialFood = new ECS.Specialfood();
            //up right ui panel
            this.UIPanelUpRight = new ECS.GameUIPanelUpRight();
            this.scoreUI = new ECS.Score(this.UIPanelUpRight.startXList, this.UIPanelUpRight.startYList);
            this.bestScoreUI = new ECS.BestScore(this.UIPanelUpRight.startXList, this.UIPanelUpRight.startYList);
            this.distanceScoreUI = new ECS.DistanceScore(this.UIPanelUpRight.startXList, this.UIPanelUpRight.startYList);
            this.hudContainer.addChild(this.UIPanelUpRight.uiContainer);
            this.hudContainer.addChild(this.scoreUI.container);
            this.hudContainer.addChild(this.bestScoreUI.container);
            this.hudContainer.addChild(this.distanceScoreUI.container);
            this.hudContainer.addChild(this.specialFood);
        };
        GameViewSystem.prototype.update = function () {
            var kernel = ECS.GameConfig.game;
            this.count += 0.01;
            var ratio = (this.zoom - 1);
            var position = -ECS.GameConfig.width / 2;
            var position2 = -kernel.player.view.position.x;
            var inter = position + (position2 - position) * ratio;
            this.GameContainer.position.x = inter * this.zoom;
            this.GameContainer.position.y = -kernel.player.view.position.y * this.zoom;
            this.GameContainer.position.x += ECS.GameConfig.width / 2;
            this.GameContainer.position.y += ECS.GameConfig.height / 2;
            ECS.GameConfig.xOffset = this.GameContainer.position.x;
            if (this.GameContainer.position.y > 0)
                this.GameContainer.position.y = 0;
            var yMax = -ECS.GameConfig.height * this.zoom;
            yMax += ECS.GameConfig.height;
            if (this.GameContainer.position.y < yMax)
                this.GameContainer.position.y = yMax;
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
            if (this.scoreUI.currentScore != kernel.score)
                this.scoreUI.setScore(kernel.score);
            if (this.distanceScoreUI.currentScore != kernel.distanceScore)
                this.distanceScoreUI.setScore(kernel.distanceScore);
            var hightScore = this.bestScoreUI.LocalData.get('highscore') || 0;
            if (this.bestScoreUI.highScore != hightScore)
                this.bestScoreUI.update();
            this.renderer.render(ECS.GameConfig.app.stage);
        };
        // doSplash() {
        //     this.splash.splash(this.kernel.player.position);
        // }
        GameViewSystem.prototype.normalMode = function () {
            this.game.removeChild(this.background);
            this.game.addChildAt(this.background, 0);
            //this.stage.addChild(this.white)
            this.white.alpha = 1;
            TweenLite.to(this.white, 0.5, {
                alpha: 0,
                ease: Sine.easeOut
            });
        };
        return GameViewSystem;
    }(ECS.System));
    ECS.GameViewSystem = GameViewSystem;
})(ECS || (ECS = {}));
/* =========================================================================
 *
 *  GameManager.ts
 *  .....
 *
 * ========================================================================= */
/// <reference path="./GameItems.ts" />
/// <reference path="./GameBackGround.ts" />
var ECS;
(function (ECS) {
    var GameObjectPool = /** @class */ (function () {
        function GameObjectPool(classType) {
            this.classType = classType;
            this.pool = [];
        }
        GameObjectPool.prototype.getObject = function () {
            var object = this.pool.pop();
            if (!object) {
                object = new this.classType();
            }
            return object;
        };
        return GameObjectPool;
    }());
    ECS.GameObjectPool = GameObjectPool;
    var SegmentManager = /** @class */ (function () {
        function SegmentManager(engine) {
            console.log("init segmeng manager!");
            this.engine = engine;
            this.sections = data;
            this.count = 0;
            this.currentSegment = data[0];
            //console.log(this.currentSegment);
            this.startSegment = { length: 1135 * 2, floor: [0, 1135], blocks: [], coins: [], platform: [] },
                this.chillMode = true;
            this.last = 0;
            this.position = 0;
        }
        SegmentManager.prototype.reset = function (dontReset) {
            if (dontReset)
                this.count = 0;
            this.currentSegment = this.startSegment;
            this.currentSegment.start = -200;
            for (var i = 0; i < this.currentSegment.floor.length; i++) {
                this.engine.floorManager.addFloor(this.currentSegment.start + this.currentSegment.floor[i]);
            }
        };
        SegmentManager.prototype.update = function () {
            this.position = ECS.GameConfig.camera.x + ECS.GameConfig.width * 2;
            var relativePosition = this.position - this.currentSegment.start;
            if (relativePosition > this.currentSegment.length) {
                //var nextSegment = this.startSegment;//this.sections[this.count % this.sections.length];
                var nextSegment = this.sections[this.count % this.sections.length];
                // section finished!
                nextSegment.start = this.currentSegment.start + this.currentSegment.length;
                this.currentSegment = nextSegment;
                // add the elements!
                //console.log(this.currentSegment.floor.length);
                var floors = this.currentSegment.floor;
                var length = floors.length / 1.0;
                for (var i = 0; i < length; i++) {
                    //console.log(this.currentSegment.start + this.currentSegment.floor[i]);
                    this.engine.floorManager.addFloor(this.currentSegment.start + this.currentSegment.floor[i]);
                }
                var blocks = this.currentSegment.blocks;
                var length = blocks.length / 2;
                for (var i = 0; i < length; i++) {
                    this.engine.enemyManager.addEnemy(this.currentSegment.start + blocks[i * 2], blocks[(i * 2) + 1]);
                }
                var pickups = this.currentSegment.coins;
                var length = pickups.length / 2;
                for (var i = 0; i < length; i++) {
                    //random distribute
                    var seed = Math.random() * 10;
                    var curType = ECS.FOODMODE.INDON;
                    if (seed > 5) {
                        curType = ECS.FOODMODE.JAPAN;
                    }
                    this.engine.pickupManager.addPickup(this.currentSegment.start + pickups[i * 2], pickups[(i * 2) + 1], curType);
                }
                var platforms = this.currentSegment.platform;
                var length = platforms.length / 2;
                for (var i = 0; i < length; i++) {
                    this.engine.platManager.addPlatform(this.currentSegment.start + platforms[i * 2], platforms[(i * 2) + 1]);
                }
                this.count++;
            }
        };
        return SegmentManager;
    }());
    ECS.SegmentManager = SegmentManager;
    var Platform = /** @class */ (function () {
        function Platform() {
            this.position = new PIXI.Point();
            this.numberOfBlock = -3 + Math.random() * (8 - 5) + 5;
            this.views = [];
            for (var i = 0; i < this.numberOfBlock * 2; i++) {
                var view = new PIXI.Sprite(PIXI.Texture.fromFrame("img/floatingGround.png"));
                view.anchor.x = 0.5;
                view.anchor.y = 0.5;
                view.width = 50;
                view.height = 50;
                this.views.push(view);
            }
            this.width = 50 * this.numberOfBlock * 2;
            this.height = 50;
        }
        Platform.prototype.update = function () {
            for (var i = -this.numberOfBlock; i < this.numberOfBlock; i++) {
                this.views[i + this.numberOfBlock].position.x = this.position.x + 50 * i - ECS.GameConfig.camera.x;
                ;
                this.views[i + this.numberOfBlock].position.y = this.position.y;
            }
        };
        return Platform;
    }());
    ECS.Platform = Platform;
    var PlatformManager = /** @class */ (function () {
        function PlatformManager(engine) {
            console.log("init platform manager!");
            this.engine = engine;
            this.platforms = [];
            this.platformPool = new GameObjectPool(Platform);
        }
        PlatformManager.prototype.update = function () {
            for (var i = 0; i < this.platforms.length; i++) {
                var platform = this.platforms[i];
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
        };
        PlatformManager.prototype.destroyAll = function () {
            for (var i = 0; i < this.platforms.length; i++) {
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
        };
        PlatformManager.prototype.addPlatform = function (x, y) {
            var platform = this.platformPool.getObject();
            platform.position.x = x;
            platform.position.y = y;
            for (var i = -platform.numberOfBlock; i < platform.numberOfBlock; i++) {
                platform.views[i + platform.numberOfBlock].position.x = platform.position.x + 50 * i - ECS.GameConfig.camera.x;
                ;
                platform.views[i + platform.numberOfBlock].position.y = platform.position.y;
                this.platforms.push(platform);
                this.engine.view.gameFront.addChild(platform.views[i + platform.numberOfBlock]);
            }
        };
        return PlatformManager;
    }());
    ECS.PlatformManager = PlatformManager;
    var EnemyManager = /** @class */ (function () {
        function EnemyManager(engine) {
            console.log("init enemy manager!");
            this.engine = engine;
            this.enemies = [];
            this.enemyPool = new GameObjectPool(ECS.GameEnemy);
            this.spawnCount = 0;
        }
        EnemyManager.prototype.update = function () {
            for (var i = 0; i < this.enemies.length; i++) {
                var enemy = this.enemies[i];
                enemy.update();
                if (enemy.view.position.x < -100 - ECS.GameConfig.xOffset && !this.engine.player.isDead) {
                    ////this.enemyPool.returnObject(enemy);
                    this.enemies.splice(i, 1);
                    this.engine.view.gameFront.removeChild(enemy.view);
                    i--;
                }
                else if (enemy.isHit) {
                    this.enemies.splice(i, 1);
                    this.engine.view.gameFront.removeChild(enemy.view);
                    i--;
                }
            }
        };
        EnemyManager.prototype.addEnemy = function (x, y) {
            var enemy = this.enemyPool.getObject();
            enemy.position.x = x;
            enemy.position.y = y;
            enemy.view.textures = enemy.moveingFrames;
            enemy.view.play();
            this.enemies.push(enemy);
            this.engine.view.gameFront.addChild(enemy.view);
        };
        EnemyManager.prototype.destroyAll = function () {
            for (var i = 0; i < this.enemies.length; i++) {
                var enemy = this.enemies[i];
                enemy.reset();
                //this.enemyPool.returnObject(enemy);
                this.engine.view.gameFront.removeChild(enemy.view);
            }
            this.enemies = [];
        };
        EnemyManager.prototype.destroyAllOffScreen = function () {
            for (var i = 0; i < this.enemies.length; i++) {
                var enemy = this.enemies[i];
                if (enemy.x > ECS.GameConfig.camera.x + ECS.GameConfig.width) {
                    this.engine.view.game.removeChild(enemy.view);
                    this.enemies.splice(i, 1);
                    i--;
                }
            }
        };
        return EnemyManager;
    }());
    ECS.EnemyManager = EnemyManager;
    var PickupManager = /** @class */ (function () {
        function PickupManager(engine) {
            this.canPickOrNot = true;
            this.MAX_PICKUP_NUM = 4;
            console.log("init pick up manager!");
            this.engine = engine;
            this.pickups = [];
            this.pickupPool = new GameObjectPool(ECS.PickUp);
            this.spawnCount = 0;
            this.pos = 0;
            this.pickedUpPool = [];
        }
        PickupManager.prototype.update = function () {
            for (var i = 0; i < this.pickups.length; i++) {
                var pickup = this.pickups[i];
                pickup.update();
                if (pickup.isPickedUp) {
                    pickup.ratio += (1 - pickup.ratio) * 0.3 * ECS.GameConfig.time.DELTA_TIME;
                    if (pickup.ratio > 0.99) {
                        //this.pickupPool.returnObject(pickup);
                        this.pickups.splice(i, 1);
                        this.engine.view.game.removeChild(pickup.view);
                        i--;
                    }
                }
                else {
                    if (pickup.view.position.x < -100 - ECS.GameConfig.xOffset) {
                        // remove!
                        this.engine.view.game.removeChild(pickup.view);
                        this.pickups.splice(i, 1);
                        i--;
                    }
                }
            }
        };
        PickupManager.prototype.addPickup = function (x, y, type) {
            var pickup = this.pickupPool.getObject();
            pickup.position.x = x;
            pickup.position.y = y;
            pickup.foodType = type;
            this.pickups.push(pickup);
            this.engine.view.game.addChild(pickup.view);
        };
        PickupManager.prototype.removePickup = function (index, isPlayer, enemyEntity) {
            if (isPlayer === void 0) { isPlayer = true; }
            if (enemyEntity === void 0) { enemyEntity = undefined; }
            //collect food
            var pickup = this.pickups[index];
            pickup.isPickedUp = true;
            if (isPlayer) {
                pickup.player = this.engine.player;
                pickup.pickupPosition = { x: pickup.position.x, y: pickup.position.y }; //.clone();
                pickup.ratio = 0;
                //judge food pool, 0 jap 1 indo
                if (this.pickedUpPool.length < this.MAX_PICKUP_NUM - 1) {
                    //console.log("collect food, type:"+pickup.foodType);
                    this.pickedUpPool.push(pickup.foodType);
                    this.engine.view.specialFood.digits[this.pickedUpPool.length - 1].texture = this.engine.view.specialFood.activeFoods[this.pickedUpPool.length - 1];
                }
                else if (this.pickedUpPool.length == this.MAX_PICKUP_NUM - 1 && this.canPickOrNot) {
                    //console.log("collect food, type:"+pickup.foodType);
                    this.pickedUpPool.push(pickup.foodType);
                    this.engine.view.specialFood.digits[this.pickedUpPool.length - 1].texture = this.engine.view.specialFood.activeFoods[this.pickedUpPool.length - 1];
                    //count for jan food
                    var cnt = 0;
                    for (var i = 0; i < this.pickedUpPool.length; i++) {
                        if (this.pickedUpPool[i] == 0) {
                            cnt++;
                        }
                    }
                    ECS.GameConfig.audio.play("pickUpFood");
                    var otherCnt = 4 - cnt;
                    var specialMode = ECS.SPECIALMODE.NINJAMODE;
                    if (cnt > otherCnt) {
                        specialMode = ECS.SPECIALMODE.JAPANMODE;
                        ECS.GameConfig.game.player.view.addChild(ECS.GameConfig.game.player.shinobiEffect1);
                        ECS.GameConfig.game.player.view.addChild(ECS.GameConfig.game.player.shinobiEffect2);
                        ECS.GameConfig.game.player.view.addChild(ECS.GameConfig.game.player.shinobiEffect3);
                        ECS.GameConfig.game.player.view.addChild(ECS.GameConfig.game.player.backEffect);
                        ECS.GameConfig.audio.play("ninjiaMode");
                        //console.log("change special mode:japan");
                    }
                    else if (cnt < otherCnt) {
                        specialMode = ECS.SPECIALMODE.INDONMODE;
                        ECS.GameConfig.tmpTimeClockStart = ECS.GameConfig.time.currentTime;
                        ECS.GameConfig.game.player.view.addChild(ECS.GameConfig.game.player.indoEffect);
                        ECS.GameConfig.audio.play("indoMode");
                        //console.log("change special mode:indo");
                    }
                    else {
                        specialMode = ECS.SPECIALMODE.NINJAMODE;
                        ECS.GameConfig.tmpTimeClockStart = ECS.GameConfig.time.currentTime;
                        ECS.GameConfig.game.player.view.addChild(ECS.GameConfig.game.player.marioEffect);
                        ECS.GameConfig.game.player.speed.x *= 2;
                        //console.log("change special mode:ninja");
                        ECS.GameConfig.audio.stop("GameMusic");
                        ECS.GameConfig.audio.play("superMarioMode");
                    }
                    ECS.GameConfig.specialMode = specialMode;
                    this.canPickOrNot = false;
                }
            }
            else {
                //eat by cat
                pickup.player = enemyEntity;
                pickup.pickupPosition = { x: pickup.position.x, y: pickup.position.y }; //.clone();
                pickup.ratio = 0;
            }
        };
        PickupManager.prototype.destroyAll = function () {
            for (var i = 0; i < this.pickups.length; i++) {
                var pickup = this.pickups[i];
                // remove!
                //this.pickupPool.returnObject(pickup);
                this.engine.view.game.removeChild(pickup.view);
            }
            this.pickups = [];
        };
        PickupManager.prototype.destroyAllOffScreen = function () {
            for (var i = 0; i < this.pickups.length; i++) {
                var pickup = this.pickups[i];
                if (pickup.x > ECS.GameConfig.camera.x + ECS.GameConfig.width) {
                    //this.pickupPool.returnObject(pickup);
                    this.engine.view.game.removeChild(pickup.view);
                    this.pickups.splice(i, 1);
                    i--;
                }
            }
        };
        return PickupManager;
    }());
    ECS.PickupManager = PickupManager;
    var Floor = /** @class */ (function () {
        function Floor() {
            this.position = new PIXI.Point();
            var view = new PIXI.Sprite(PIXI.Texture.fromFrame("img/bg_down.png"));
            this.view = view;
        }
        return Floor;
    }());
    ECS.Floor = Floor;
    var FloorManager = /** @class */ (function () {
        function FloorManager(engine) {
            console.log("init floor manager!");
            this.engine = engine;
            this.count = 0;
            this.floors = [];
            this.floorPool = new GameObjectPool(Floor);
        }
        FloorManager.prototype.update = function () {
            for (var i = 0; i < this.floors.length; i++) {
                var floor = this.floors[i];
                floor.view.position.x = floor.position.x - ECS.GameConfig.camera.x - 16;
                if (floor.position.x < -1135 - ECS.GameConfig.xOffset - 16) {
                    this.floors.splice(i, 1);
                    i--;
                    this.engine.view.gameFront.removeChild(floor);
                }
            }
        };
        FloorManager.prototype.addFloor = function (floorData) {
            var floor = this.floorPool.getObject();
            floor.position.x = floorData;
            floor.position.y = (ECS.GameConfig.allSystem.get("background")).bgTex.spriteHeight - 1;
            floor.view.height = ECS.GameConfig.height - floor.position.y + 1;
            floor.view.position.y = floor.position.y;
            this.engine.view.gameFront.addChild(floor.view);
            this.floors.push(floor);
        };
        FloorManager.prototype.destroyAll = function () {
            for (var i = 0; i < this.floors.length; i++) {
                var floor = this.floors[i];
                this.engine.view.gameFront.removeChild(floor);
            }
            this.floors = [];
        };
        return FloorManager;
    }());
    ECS.FloorManager = FloorManager;
    var CollisionManager = /** @class */ (function () {
        function CollisionManager(engine) {
            this.isOnPlat = false;
            console.log("init collision manager!");
            this.engine = engine;
        }
        CollisionManager.prototype.update = function () {
            this.playerVsBlock();
            this.playerVsPickup();
            this.playerVsFloor();
            this.playerVsPlat();
            this.catVsPickup();
        };
        CollisionManager.prototype.playerVsBlock = function () {
            var enemies = this.engine.enemyManager.enemies;
            var player = this.engine.player;
            var floatRange = 0;
            for (var i = 0; i < enemies.length; i++) {
                var enemy = enemies[i];
                if (player.isSlide) {
                    floatRange = 10;
                }
                else if (ECS.GameConfig.specialMode == ECS.SPECIALMODE.INDONMODE && ECS.GameConfig.game.player.isPlayingInoEffect) {
                    floatRange = -2000;
                }
                else {
                    floatRange = 0;
                }
                var xdist = enemy.position.x - player.position.x;
                var ydist = enemy.position.y - player.position.y;
                //detect japan mode and ninjia mode
                if (xdist > -enemy.width / 2 + floatRange && xdist < enemy.width / 2 - floatRange) {
                    var ydist = enemy.position.y - player.position.y;
                    if (ydist > -enemy.height / 2 - 20 + floatRange && ydist < enemy.height / 2 - floatRange) {
                        //attack cat and get point
                        ECS.GameConfig.game.score += 10;
                        switch (ECS.GameConfig.specialMode) {
                            case ECS.SPECIALMODE.NONE:
                                player.die();
                                this.engine.gameover();
                                enemy.hit();
                                break;
                            case ECS.SPECIALMODE.INDONMODE:
                                if (floatRange == -2000) {
                                    enemy.hit();
                                }
                                else {
                                    player.die();
                                    this.engine.gameover();
                                    enemy.hit();
                                }
                                break;
                            case ECS.SPECIALMODE.JAPANMODE:
                                if (ECS.GameConfig.game.player.isPlayingNinjiaEffect) {
                                    enemy.hit();
                                }
                                else {
                                    player.die();
                                    this.engine.gameover();
                                    enemy.hit();
                                }
                                break;
                            case ECS.SPECIALMODE.NINJAMODE:
                                enemy.hit();
                                break;
                        }
                    }
                }
            }
        };
        CollisionManager.prototype.catVsPickup = function () {
            var pickups = this.engine.pickupManager.pickups;
            var enemies = this.engine.enemyManager.enemies;
            for (var i = 0; i < enemies.length; i++) {
                var enemy = enemies[i];
                if (enemy.isHit)
                    continue;
                //console.log("cat eat!");
                for (var j = 0; j < pickups.length; j++) {
                    var pickup = pickups[j];
                    if (pickup.isPickedUp)
                        continue;
                    //console.log("chk cat eat!");
                    var xdist = pickup.position.x - enemy.position.x;
                    if (xdist > -pickup.width / 2 && xdist < pickup.width / 2) {
                        var ydist = pickup.position.y - enemy.position.y;
                        //console.log("cat eat food1!");
                        if (ydist > -pickup.height / 2 - 20 && ydist < pickup.height / 2) {
                            //console.log("cat eat food!");
                            enemy.view.textures = enemy.stealFrames;
                            ECS.GameConfig.audio.play("catCome");
                            enemy.view.play();
                            enemy.isEatNow = true;
                            this.engine.pickupManager.removePickup(j, false, enemy);
                            //this.engine.pickup(i);
                        }
                    }
                }
            }
        };
        CollisionManager.prototype.playerVsPickup = function () {
            var pickups = this.engine.pickupManager.pickups;
            var player = this.engine.player;
            for (var i = 0; i < pickups.length; i++) {
                var pickup = pickups[i];
                if (pickup.isPickedUp)
                    continue;
                var xdist = pickup.position.x - player.position.x;
                if (xdist > -pickup.width / 2 && xdist < pickup.width / 2) {
                    var ydist = pickup.position.y - player.position.y;
                    if (ydist > -pickup.height / 2 - 20 && ydist < pickup.height / 2) {
                        this.engine.pickupManager.removePickup(i);
                        this.engine.pickup(i);
                    }
                }
            }
        };
        CollisionManager.prototype.playerVsPlat = function () {
            var player = this.engine.player;
            var platforms = this.engine.platManager.platforms;
            for (var i = 0; i < platforms.length; i++) {
                var plat = platforms[i];
                var xdist = plat.position.x - player.position.x;
                //check jump to the plat or not
                if (xdist > -plat.width / 2 && xdist < plat.width / 2) {
                    var ydist = plat.position.y - player.position.y;
                    if (ydist > -plat.height / 2 - 20 && ydist < plat.height / 2) {
                        if (player.position.y < plat.position.y - 10) {
                            //player jump to the plat
                            player.position.y = plat.position.y - plat.height / 2 - player.height / 2;
                            player.ground = player.position.y;
                            ECS.GameConfig.isOnPlat = true;
                            player.onGround = true;
                        }
                    }
                }
            }
            //check leave the plat
            if (ECS.GameConfig.isOnPlat) {
                var flag = true;
                for (var i = 0; i < platforms.length; i++) {
                    var plat = platforms[i];
                    var xdist = plat.position.x - player.position.x;
                    if (xdist > -plat.width / 2 && xdist < plat.width / 2) {
                        var ydist = plat.position.y - plat.height / 2 - player.height / 2 - player.position.y;
                        if (ydist <= 0) {
                            //console.log("noy");
                            flag = false;
                        }
                    }
                }
                if (flag) {
                    ECS.GameConfig.isOnPlat = false;
                    ;
                    player.ground = this.engine.player.floorHeight;
                    ECS.GameConfig.playerMode = ECS.PLAYMODE.FALL;
                    //console.log("leave plat");
                }
            }
        };
        CollisionManager.prototype.playerVsFloor = function () {
            var floors = this.engine.floorManager.floors;
            var player = this.engine.player;
            var max = floors.length;
            player.onGround = false;
            if (player.position.y > ECS.GameConfig.height) {
                if (this.engine.isPlaying) {
                    player.boil();
                    //this.engine.view.doSplash();
                    this.engine.gameover();
                }
                else {
                    player.speed.x *= 0.95;
                    if (!ECS.GameConfig.interactive) {
                        //game end
                        //showGameover();
                        ECS.GameConfig.interactive = true;
                    }
                    if (player.bounce === 0) {
                        player.bounce++;
                        player.boil();
                        //this.engine.view.doSplash();
                    }
                    return;
                }
            }
            for (var i = 0; i < max; i++) {
                var floor = floors[i];
                var xdist = floor.position.x - player.position.x + 1135;
                //console.log(player.position.y + "/" + this.engine.player.floorHeight);
                if (player.position.y >= this.engine.player.floorHeight) {
                    if (xdist > 0 && xdist < 1135) {
                        if (player.isDead) {
                            player.bounce++;
                            if (player.bounce > 2) {
                                return;
                            }
                            player.speed.y *= -0.7;
                            player.speed.x *= 0.8;
                            if (player.rotationSpeed > 0) {
                                player.rotationSpeed = Math.random() * -0.3;
                            }
                            else if (player.rotationSpeed === 0) {
                                player.rotationSpeed = Math.random() * 0.3;
                            }
                            else {
                                player.rotationSpeed = 0;
                            }
                        }
                        else {
                            player.speed.y = -0.3;
                        }
                        if (!player.isFlying) {
                            player.position.y = this.engine.player.floorHeight;
                            player.onGround = true;
                        }
                    }
                }
            }
        };
        return CollisionManager;
    }());
    ECS.CollisionManager = CollisionManager;
})(ECS || (ECS = {}));
/* =========================================================================
 *
 *  GameCharacter.ts
 *  character controller
 *
 * ========================================================================= */
/// <reference path="./GameConfig.ts" />
var ECS;
(function (ECS) {
    var GameCharacter = /** @class */ (function () {
        function GameCharacter() {
            this.isSlide = false;
            this.ninjiaEffectNumber = 0;
            this.isPlayingNinjiaEffect = false;
            this.isPlayingInoEffect = false;
            console.log("init character!");
            this.position = new PIXI.Point();
            this.speedUpList = [];
            this.runningFrames = [
                PIXI.Texture.fromFrame("CHARACTER/RUN/Character-01.png"),
                PIXI.Texture.fromFrame("CHARACTER/RUN/Character-02.png"),
                PIXI.Texture.fromFrame("CHARACTER/RUN/Character-03.png"),
                PIXI.Texture.fromFrame("CHARACTER/RUN/Character-04.png"),
                PIXI.Texture.fromFrame("CHARACTER/RUN/Character-05.png"),
                PIXI.Texture.fromFrame("CHARACTER/RUN/Character-06.png"),
            ];
            this.indoTightFrame = [
                PIXI.Texture.fromFrame("CHARACTER/POWER EFFECTS/INDONTIGHT/boom0001.png"),
                PIXI.Texture.fromFrame("CHARACTER/POWER EFFECTS/INDONTIGHT/boom0002.png"),
                PIXI.Texture.fromFrame("CHARACTER/POWER EFFECTS/INDONTIGHT/boom0003.png"),
                PIXI.Texture.fromFrame("CHARACTER/POWER EFFECTS/INDONTIGHT/boom0004.png")
            ];
            this.jumpFrames = [
                PIXI.Texture.fromFrame("CHARACTER/JUMP/Jump.png"),
            ];
            this.slideFrame = [
                PIXI.Texture.fromFrame("CHARACTER/SLIDE/Slide.png"),
            ];
            this.dashFrames = [
                PIXI.Texture.fromFrame("CHARACTER/POWER/DASH/dash0002.png")
            ];
            this.shootFrame = [
                PIXI.Texture.fromFrame("CHARACTER/POWER/SHOOT/shoot0001.png"),
                PIXI.Texture.fromFrame("CHARACTER/POWER/SHOOT/shoot0002.png")
            ];
            this.view = new PIXI.extras.AnimatedSprite(this.runningFrames);
            this.view.animationSpeed = 0.23;
            this.view.anchor.x = 0.5;
            this.view.anchor.y = 0.5;
            this.view.height = 135;
            this.view.width = 75;
            this.position.x = (ECS.GameConfig.allSystem.get("background")).bgTex.spriteWidth + 100;
            if (!ECS.GameConfig.device.desktop)
                this.position.x = 2 * (ECS.GameConfig.allSystem.get("background")).bgTex.spriteWidth + 100;
            this.floorSpriteHeight = (ECS.GameConfig.allSystem.get("background")).bgTex.spriteHeight;
            //refresh floor position
            this.refreshFloorHeight();
            this.gravity = 9.8;
            this.baseSpeed = 8;
            this.speed = new PIXI.Point(this.baseSpeed, 0);
            this.activeCount = 0;
            this.isJumped = false;
            this.accel = 0;
            this.width = 26;
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
            this.angle = Math.PI * 45 / 360;
            this.startJump = false;
            this.b_jumpTwo = false;
            this.smooth = 0.05;
            this.cnt = 0;
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
            this.indonTight = new PIXI.extras.AnimatedSprite(this.indoTightFrame);
            this.indonTight.animationSpeed = 0.1;
            this.indonTight.anchor.x = 0.5;
            this.indonTight.anchor.y = 0.5;
            this.indonTight.height = ECS.GameConfig.height / 2;
            this.indonTight.width = ECS.GameConfig.width / 2;
            this.view.play();
            //GameConfig.app.start();
        }
        GameCharacter.prototype.update = function () {
            if (this.isDead) {
                this.updateDieing();
            }
            else {
                this.updateRunning();
            }
        };
        GameCharacter.prototype.normalMode = function () {
            this.joyRiding = false;
            TweenLite.to(this.speed, 0.6, {
                x: this.baseSpeed,
                ease: Cubic.easeOut
            });
            this.realAnimationSpeed = 0.23;
        };
        GameCharacter.prototype.chkOnGround = function () {
            if (this.position.y - this.ground >= 0) {
                return true;
            }
            return false;
        };
        GameCharacter.prototype.resetSpecialFoods = function () {
            for (var i = 0; i < 4; i++) {
                ECS.GameConfig.game.view.specialFood.digits[i].texture = ECS.GameConfig.game.view.specialFood.foods[i];
            }
        };
        GameCharacter.prototype.ninjiaOperate = function () {
            if (this.ninjiaEffectNumber < 3 && !this.isPlayingNinjiaEffect) {
                //console.log("dash");
                this.isPlayingNinjiaEffect = true;
                ECS.GameConfig.tmpTimeClockStart = ECS.GameConfig.time.currentTime;
                this.view.addChild(this.specialEffectView);
                switch (this.ninjiaEffectNumber) {
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
                this.speed.x *= 10;
                this.ninjiaEffectNumber++;
            }
        };
        GameCharacter.prototype.indoOperate = function () {
            if (!this.isPlayingInoEffect) {
                //chara animation
                this.view.textures = this.shootFrame;
                this.view.play();
                ECS.GameConfig.tmpTimeClockStart = ECS.GameConfig.time.currentTime;
                this.view.addChild(this.indoEffect);
                //effect play
                (ECS.GameConfig.allSystem.get("view")).game.addChild(this.indonTight);
                this.indonTight.textures = this.indoTightFrame;
                this.indonTight.play();
                this.isPlayingInoEffect = true;
            }
        };
        GameCharacter.prototype.ninjaMode = function () {
            if (this.isPlayingNinjiaEffect) {
                ECS.GameConfig.tmpTimeClockEnd = ECS.GameConfig.time.currentTime;
                var DuringTime = ECS.GameConfig.timeClock();
                //console.log(DuringTime);
                if (DuringTime > 200) {
                    this.view.textures = this.runningFrames;
                    this.view.play();
                    this.speed.x /= 10;
                    this.view.removeChild(this.specialEffectView);
                    this.isPlayingNinjiaEffect = false;
                    if (this.ninjiaEffectNumber == 3) {
                        this.ninjiaEffectNumber = 0;
                        ECS.GameConfig.specialMode = ECS.SPECIALMODE.NONE;
                        ECS.GameConfig.game.pickupManager.pickedUpPool = [];
                        ECS.GameConfig.game.pickupManager.canPickOrNot = true;
                        this.resetSpecialFoods();
                        this.view.removeChild(this.backEffect);
                        //console.log("ninja finished!");
                    }
                }
            }
        };
        GameCharacter.prototype.marioMode = function () {
            ECS.GameConfig.tmpTimeClockEnd = ECS.GameConfig.time.currentTime;
            var DuringTime = ECS.GameConfig.timeClock();
            //console.log(DuringTime);
            if (DuringTime > 10000) {
                //console.log("mario finished!");
                ECS.GameConfig.specialMode = ECS.SPECIALMODE.NONE;
                ECS.GameConfig.game.pickupManager.pickedUpPool = [];
                ECS.GameConfig.game.pickupManager.canPickOrNot = true;
                this.speed.x /= 2;
                this.view.removeChild(this.marioEffect);
                this.resetSpecialFoods();
                ECS.GameConfig.audio.stop("superMarioMode");
                ECS.GameConfig.audio.play("GameMusic");
            }
        };
        GameCharacter.prototype.indoMode = function () {
            if (this.isPlayingInoEffect) {
                this.indonTight.position.x = this.position.x - ECS.GameConfig.camera.x;
                this.indonTight.position.y = this.position.y - ECS.GameConfig.camera.y;
                ECS.GameConfig.tmpTimeClockEnd = ECS.GameConfig.time.currentTime;
                var DuringTime = ECS.GameConfig.timeClock();
                if (DuringTime > 1000) {
                    //console.log("indo finished!");
                    this.isPlayingInoEffect = false;
                    ECS.GameConfig.specialMode = ECS.SPECIALMODE.NONE;
                    ECS.GameConfig.game.pickupManager.pickedUpPool = [];
                    ECS.GameConfig.game.pickupManager.canPickOrNot = true;
                    (ECS.GameConfig.allSystem.get("view")).game.removeChild(this.indonTight);
                    this.view.removeChild(this.indoEffect);
                    this.resetSpecialFoods();
                }
            }
        };
        GameCharacter.prototype.refreshFloorHeight = function () {
            this.floorHeight = this.floorSpriteHeight - this.view.height * 0.5;
            this.view.position.y = this.floorHeight;
            this.position.y = this.floorHeight;
            this.ground = this.floorHeight;
        };
        GameCharacter.prototype.updateRunning = function () {
            this.view.animationSpeed = this.realAnimationSpeed * ECS.GameConfig.time.DELTA_TIME * this.level;
            this.indonTight.animationSpeed = this.realAnimationSpeed * ECS.GameConfig.time.DELTA_TIME * this.level;
            //speed up when user reach some points
            var judgeImPoints = Math.floor(ECS.GameConfig.game.distanceScore / 2);
            if (judgeImPoints != 0 && !this.speedUpList.includes(judgeImPoints) && ECS.GameConfig.game.distanceScore < 20) {
                //console.log("speed up!");
                this.speedUpList.push(judgeImPoints);
                this.speed.x *= 1.1;
            }
            switch (ECS.GameConfig.playerMode) {
                case ECS.PLAYMODE.JUMPING1:
                    this.speed.y = -this.vStart * Math.sin(this.angle);
                    break;
                case ECS.PLAYMODE.JUMPING2:
                    this.speed.y = -this.vStart * Math.sin(this.angle);
                    break;
                case ECS.PLAYMODE.FALL:
                    //should have gravity
                    this.speed.y += this.gravity * ECS.GameConfig.time.DELTA_TIME * this.smooth;
                    break;
                case ECS.PLAYMODE.RUNNING:
                    this.speed.y = 0;
                    break;
                case ECS.PLAYMODE.SLIDE:
                    this.speed.y = 0;
                    break;
            }
            if (!this.chkOnGround() && (ECS.GameConfig.playerMode == ECS.PLAYMODE.JUMPING1 || ECS.GameConfig.playerMode == ECS.PLAYMODE.JUMPING2))
                ECS.GameConfig.playerMode = ECS.PLAYMODE.FALL;
            else if (ECS.GameConfig.playerMode == ECS.PLAYMODE.FALL && this.chkOnGround())
                ECS.GameConfig.playerMode = ECS.PLAYMODE.RUNNING;
            this.position.x += this.speed.x * ECS.GameConfig.time.DELTA_TIME * this.level;
            this.position.y += this.speed.y * ECS.GameConfig.time.DELTA_TIME;
            if (this.onGround && ECS.GameConfig.playerMode == ECS.PLAYMODE.RUNNING && this.view.textures != this.runningFrames && !this.isPlayingInoEffect) {
                this.view.anchor.y = 0.5;
                this.view.textures = this.runningFrames;
                this.view.play();
            }
            else if (ECS.GameConfig.playerMode == ECS.PLAYMODE.SLIDE && this.view.textures != this.slideFrame) {
                this.view.anchor.y = 0.1;
                this.view.textures = this.slideFrame;
                this.view.play();
            }
            else if ((ECS.GameConfig.playerMode == ECS.PLAYMODE.JUMPING1 || ECS.GameConfig.playerMode == ECS.PLAYMODE.JUMPING2) && this.view.textures != this.jumpFrames) {
                this.view.textures = this.jumpFrames;
                this.view.play();
            }
            switch (ECS.GameConfig.specialMode) {
                case ECS.SPECIALMODE.NONE:
                    break;
                case ECS.SPECIALMODE.NINJAMODE:
                    this.marioMode();
                    break;
                case ECS.SPECIALMODE.JAPANMODE:
                    if (this.ninjiaEffectNumber <= 3) {
                        this.ninjaMode();
                    }
                    break;
                case ECS.SPECIALMODE.INDONMODE:
                    this.indoMode();
                    break;
            }
            ECS.GameConfig.camera.x = this.position.x - 100;
            ECS.GameConfig.game.distanceScore = Math.floor(this.position.x / 10000);
            this.view.position.x = this.position.x - ECS.GameConfig.camera.x;
            this.view.position.y = this.position.y - ECS.GameConfig.camera.y;
            this.view.rotation += (this.speed.y * 0.05 - this.view.rotation) * 0.1;
        };
        GameCharacter.prototype.updateDieing = function () {
            this.speed.x *= 0.999;
            if (this.onGround)
                this.speed.y *= 0.99;
            this.speed.y += 0.1;
            this.accel += (0 - this.accel) * 0.1 * ECS.GameConfig.time.DELTA_TIME;
            this.speed.y += this.gravity * ECS.GameConfig.time.DELTA_TIME;
            ;
            this.position.x += this.speed.x * ECS.GameConfig.time.DELTA_TIME;
            ;
            this.position.y += this.speed.y * ECS.GameConfig.time.DELTA_TIME;
            ;
            ECS.GameConfig.camera.x = this.position.x - 100;
            this.view.position.x = this.position.x - ECS.GameConfig.camera.x;
            this.view.position.y = this.position.y - ECS.GameConfig.camera.y;
            if (this.speed.x < 5) {
                this.view.rotation += this.rotationSpeed * (this.speed.x / 5) * ECS.GameConfig.time.DELTA_TIME;
            }
            else {
                this.view.rotation += this.rotationSpeed * ECS.GameConfig.time.DELTA_TIME;
            }
        };
        GameCharacter.prototype.jumpTwo = function () {
            //console.log("jump two");
            if (this.isDead) {
                if (this.speed.x < 5) {
                    this.isDead = false;
                    this.speed.x = 10;
                }
            }
            if (Math.abs(this.position.y - this.ground) > 1) {
                ECS.GameConfig.playerMode = ECS.PLAYMODE.JUMPING2;
            }
        };
        GameCharacter.prototype.slide = function (isSlide) {
            if (this.isDead) {
                if (this.speed.x < 5) {
                    this.isDead = false;
                    this.speed.x = 10;
                }
            }
            // console.log(isSlide);
            if (ECS.GameConfig.playerMode != ECS.PLAYMODE.SLIDE && this.position.y == this.ground) {
                this.isSlide = isSlide;
                if (isSlide)
                    ECS.GameConfig.playerMode = ECS.PLAYMODE.SLIDE;
            }
            else if (!isSlide) {
                //console.log("slide finish");
                this.onGround = true;
                this.position.y = this.ground;
                this.isSlide = isSlide;
                ECS.GameConfig.playerMode = ECS.PLAYMODE.RUNNING;
            }
        };
        GameCharacter.prototype.jump = function () {
            //console.log("click jump");
            if (this.isDead) {
                if (this.speed.x < 5) {
                    this.isDead = false;
                    this.speed.x = 10;
                }
            }
            ECS.GameConfig.playerMode = ECS.PLAYMODE.JUMPING1;
        };
        GameCharacter.prototype.die = function () {
            if (this.isDead)
                return;
            ECS.GameConfig.audio.play("playerDead");
            TweenLite.to(ECS.GameConfig.time, 0.5, {
                speed: 0.1,
                ease: Cubic.easeOut,
                onComplete: function () {
                    TweenLite.to(ECS.GameConfig.time, 2, {
                        speed: 1,
                        delay: 1
                    });
                }
            });
            this.isDead = true;
            this.bounce = 0;
            this.speed.x = 15;
            this.speed.y = -15;
            this.rotationSpeed = 0.3;
            this.view.stop();
        };
        GameCharacter.prototype.boil = function () {
            if (this.isDead)
                return;
            this.isDead = true;
        };
        GameCharacter.prototype.fall = function () {
            this.startJump = false;
            //this.b_jumpTwo = false;
            this.isJumped = true;
        };
        GameCharacter.prototype.isAirbourne = function () { };
        GameCharacter.prototype.stop = function () {
            this.view.stop();
        };
        GameCharacter.prototype.resume = function () {
            this.view.play();
        };
        return GameCharacter;
    }());
    ECS.GameCharacter = GameCharacter;
    var GameEnemy = /** @class */ (function () {
        function GameEnemy() {
            this.isEatNow = false;
            this.position = new PIXI.Point();
            this.isHit = false;
            this.width = 150;
            this.height = 150;
            this.speed = -10 + Math.random() * 20;
            ;
            this.moveingFrames = [
                PIXI.Texture.fromFrame("CHARACTER/NEKO/WALK/neko0001.png"),
                PIXI.Texture.fromFrame("CHARACTER/NEKO/WALK/neko0002.png"),
                PIXI.Texture.fromFrame("CHARACTER/NEKO/WALK/neko0003.png"),
                PIXI.Texture.fromFrame("CHARACTER/NEKO/WALK/neko0004.png"),
            ];
            this.stealFrames = [
                PIXI.Texture.fromFrame("CHARACTER/NEKO/STEAL/steal0001.png"),
                PIXI.Texture.fromFrame("CHARACTER/NEKO/STEAL/steal0002.png"),
                PIXI.Texture.fromFrame("CHARACTER/NEKO/STEAL/steal0003.png"),
                PIXI.Texture.fromFrame("CHARACTER/NEKO/STEAL/steal0004.png")
            ];
            this.view = new PIXI.extras.AnimatedSprite(this.moveingFrames);
            this.view.animationSpeed = 0.23;
            this.view.anchor.x = 0.5;
            this.view.anchor.y = 0.5;
            this.view.height = 150;
            this.view.width = 150;
            this.view.play();
        }
        GameEnemy.prototype.reset = function () {
            // if(this.explosion)
            // {
            //     this.view.removeChild(this.explosion);
            //     this.explosion.reset();
            // }
            this.isHit = false;
            this.view.width = 157;
        };
        GameEnemy.prototype.hit = function () {
            if (this.isHit)
                return;
            this.isHit = true;
            //if(!this.explosion) this.explosion = new Explosion();
            //this.explosion.explode();
            //this.view.addChild(this.explosion);
            ECS.GameConfig.audio.play("catDead");
            this.view.setTexture(PIXI.Texture.fromImage("img/empty.png"));
        };
        GameEnemy.prototype.update = function () {
            this.view.animationSpeed = 0.23 * ECS.GameConfig.time.DELTA_TIME;
            this.view.position.x = this.position.x - ECS.GameConfig.camera.x;
            if (!this.isEatNow) {
                this.position.x += this.speed * Math.sin(ECS.GameConfig.time.DELTA_TIME);
                ECS.GameConfig.tmpTimeClockStart1 = ECS.GameConfig.time.currentTime;
            }
            else {
                ECS.GameConfig.tmpTimeClockEnd1 = ECS.GameConfig.time.currentTime;
                if (ECS.GameConfig.timeClock1() > 2000) {
                    this.isEatNow = false;
                    this.view.textures = this.moveingFrames;
                    this.view.play();
                    ECS.GameConfig.audio.play("catCome");
                }
            }
            this.view.position.y = this.position.y;
        };
        return GameEnemy;
    }());
    ECS.GameEnemy = GameEnemy;
    var Partical = /** @class */ (function () {
        function Partical() {
            PIXI.Sprite.call(this, PIXI.Texture.fromFrame("starPops0004.png"));
            this.anchor.x = 0.5;
            this.anchor.y = 0.5;
            this.speed = new PIXI.Point();
        }
        return Partical;
    }());
    ECS.Partical = Partical;
    Partical.prototype = Object.create(PIXI.Sprite.prototype);
    var GameCharacterTrail = /** @class */ (function () {
        function GameCharacterTrail(stage) {
            this.stage = stage;
            this.target = new PIXI.Point();
            this.particals = [];
            this.particalPool = new ECS.GameObjectPool(Partical);
            this.max = 100;
            this.count = 0;
        }
        GameCharacterTrail.prototype.update = function () {
            if (this.target.isFlying && !this.target.isDead) {
                this.count++;
                if (this.count % 3) {
                    var partical = this.particalPool.getObject();
                    this.stage.addChild(partical);
                    partical.position.x = this.target.view.position.x + (Math.random() * 10) - 5 - 20;
                    partical.position.y = this.target.view.position.y + 50;
                    partical.direction = 0;
                    partical.dirSpeed = Math.random() > 0.5 ? -0.1 : 0.1;
                    partical.sign = this.particals.length % 2 ? -1 : 1;
                    partical.scaly = Math.random() * 2 - 1; // - this.target.speed.x * 0.3;
                    partical.speed.y = this.target.accel * 3;
                    partical.alphay = 2;
                    partical.rotation = Math.random() * Math.PI * 2;
                    partical.scale.x = partical.scale.y = 0.2 + Math.random() * 0.5;
                    this.particals.push(partical);
                }
            }
            for (var i = 0; i < this.particals.length; i++) {
                var partical = this.particals[i];
                partical.dirSpeed += 0.003 * partical.sign;
                if (partical.dirSpeed > 2)
                    partical.dirSpeed = 2;
                partical.direction += partical.dirSpeed;
                partical.speed.x = Math.sin(partical.direction); // *= 1.1;
                partical.speed.y = Math.cos(partical.direction);
                partical.position.x += partical.speed.x * 5 * partical.scaly;
                partical.position.y += partical.speed.y * 3;
                partical.alphay *= 0.85;
                partical.rotation += partical.speed.x * 0.1;
                partical.alpha = partical.alphay > 1 ? 1 : partical.alphay;
                if (partical.alpha < 0.01) {
                    this.stage.removeChild(partical);
                    this.particals.splice(i, 1);
                    //this.particalPool.returnObject(partical);
                    i--;
                }
            }
        };
        return GameCharacterTrail;
    }());
    ECS.GameCharacterTrail = GameCharacterTrail;
    var ParticalFire = /** @class */ (function () {
        function ParticalFire() {
            PIXI.Sprite.call(this, PIXI.Texture.fromFrame("fireCloud.png"));
            this.anchor.x = 0.5;
            this.anchor.y = 0.5;
            this.speed = new PIXI.Point();
        }
        return ParticalFire;
    }());
    ECS.ParticalFire = ParticalFire;
    ParticalFire.prototype = Object.create(PIXI.Sprite.prototype);
    var GameCharacterTrailFire = /** @class */ (function () {
        function GameCharacterTrailFire(stage) {
            this.stage = stage;
            this.target = new PIXI.Point();
            this.particals = [];
            this.particalPool = new ECS.GameObjectPool(ParticalFire);
            this.max = 100;
            this.count = 0;
            this.mOffset = PIXI.mat3.create(); //PIXI.mat3.identity(PIXI.mat3.create());
            this.mOffset[2] = -30; //this.position.x;
            this.mOffset[5] = 30; //this.position.y;
            this.spare = PIXI.mat3.create(); //PIXI.mat3.identity();
        }
        GameCharacterTrailFire.prototype.update = function () {
            //PIXI.Rope.prototype.updateTransform.call(this);
            if (this.target.isDead) {
                this.mOffset;
                PIXI.mat3.multiply(this.mOffset, this.target.view.localTransform, this.spare);
                this.count++;
                if (this.count % 3) {
                    var partical = this.particalPool.getObject();
                    this.stage.addChild(partical);
                    partical.position.x = this.spare[2];
                    partical.position.y = this.spare[5];
                    partical.speed.x = 1 + Math.random() * 2;
                    partical.speed.y = 1 + Math.random() * 2;
                    partical.speed.x *= -1;
                    partical.speed.y *= 1;
                    partical.alphay = 2;
                    partical.rotation = Math.random() * Math.PI * 2;
                    partical.scale.x = partical.scale.y = 0.2 + Math.random() * 0.5;
                    this.particals.push(partical);
                }
            } // add partical!
            for (var i = 0; i < this.particals.length; i++) {
                var partical = this.particals[i];
                partical.scale.x = partical.scale.y *= 1.02;
                partical.alphay *= 0.85;
                partical.alpha = partical.alphay > 1 ? 1 : partical.alphay;
                partical.position.x += partical.speed.x * 2;
                partical.position.y += partical.speed.y * 2;
                if (partical.alpha < 0.01) {
                    this.stage.removeChild(partical);
                    this.particals.splice(i, 1);
                    //this.particalPool.returnObject(partical);
                    i--;
                }
            }
            ;
        };
        return GameCharacterTrailFire;
    }());
    ECS.GameCharacterTrailFire = GameCharacterTrailFire;
})(ECS || (ECS = {}));
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
var ECS;
(function (ECS) {
    var GameKernelSystem = /** @class */ (function (_super) {
        __extends(GameKernelSystem, _super);
        function GameKernelSystem() {
            var _this = _super.call(this, "game kernel") || this;
            _this.view = (ECS.GameConfig.allSystem.get("view"));
            _this.player = new ECS.GameCharacter();
            _this.segmentManager = new ECS.SegmentManager(_this);
            _this.enemyManager = new ECS.EnemyManager(_this);
            _this.platManager = new ECS.PlatformManager(_this);
            _this.pickupManager = new ECS.PickupManager(_this);
            _this.floorManager = new ECS.FloorManager(_this);
            _this.collisionManager = new ECS.CollisionManager(_this);
            _this.LocalData = new ECS.GameLocalData(ECS.GameConfig.localID);
            _this.player.view.visible = false;
            _this.bulletMult = 1;
            _this.pickupCount = 0;
            _this.score = 0;
            _this.distanceScore = 0;
            _this.isPlaying = false;
            _this.levelCount = 0;
            _this.gameReallyOver = false;
            _this.isDying = false;
            _this.view.game.addChild(_this.player.view);
            return _this;
        }
        GameKernelSystem.prototype.start = function () {
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
            this.player.view.play();
            this.player.view.visible = true;
            this.segmentManager.chillMode = false;
            this.bulletMult = 1;
            ECS.GameConfig.audio.stop("StartMusic");
            ECS.GameConfig.audio.setVolume('GameMusic', 0.5);
            ECS.GameConfig.audio.play("GameMusic");
        };
        GameKernelSystem.prototype.update = function () {
            //console.log("game update!!");
            ECS.GameConfig.time.update();
            var targetCamY = 0;
            if (targetCamY > 0)
                targetCamY = 0;
            if (targetCamY < -70)
                targetCamY = -70;
            ECS.GameConfig.camera.y = targetCamY;
            if (ECS.GameConfig.gameMode !== ECS.GAMEMODE.PAUSED) {
                this.player.update();
                this.collisionManager.update();
                this.platManager.update();
                this.segmentManager.update();
                this.floorManager.update();
                this.enemyManager.update();
                this.pickupManager.update();
                this.levelCount += ECS.GameConfig.time.DELTA_TIME;
                if (this.levelCount > (60 * 60)) {
                    this.levelCount = 0;
                    this.player.level += 0.05;
                    ECS.GameConfig.time.speed += 0.05;
                }
            }
            this.view.update();
        };
        GameKernelSystem.prototype.gameover = function () {
            this.isPlaying = false;
            this.isDying = true;
            this.segmentManager.chillMode = true;
            var nHighscore = this.LocalData.get('highscore');
            if (!nHighscore || this.score > nHighscore) {
                this.LocalData.store('highscore', this.score);
                ECS.GameConfig.newHighscore = true;
            }
            //this.onGameover();
            this.view.game.addChild(this.player.view);
            TweenLite.to(this.view, 0.5, {
                zoom: 2,
                ease: Cubic.easeOut
            });
        };
        GameKernelSystem.prototype.pickup = function (idx) {
            if (this.player.isDead)
                return;
            this.pickupCount++;
        };
        return GameKernelSystem;
    }(ECS.System));
    ECS.GameKernelSystem = GameKernelSystem;
})(ECS || (ECS = {}));
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
var ECS;
(function (ECS) {
    function update() {
        ECS.GameConfig.game.update();
        requestAnimationFrame(update);
    }
    ECS.update = update;
    var MainSystem = /** @class */ (function (_super) {
        __extends(MainSystem, _super);
        function MainSystem(othSystems) {
            var _this = _super.call(this, "main") || this;
            _this.OtherSystems = othSystems;
            return _this;
        }
        MainSystem.prototype.Execute = function () {
            _super.prototype.Execute.call(this);
            this.OtherSystems.forEach(function (key, val) {
                val.Execute();
            });
        };
        return MainSystem;
    }(ECS.System));
    ECS.MainSystem = MainSystem;
    var LoadingSystem = /** @class */ (function (_super) {
        __extends(LoadingSystem, _super);
        function LoadingSystem() {
            var _this = _super.call(this, "loading") || this;
            //device info detect
            _this.device = new Utils.DeviceDetect();
            //console.log(this.device.PrintInfo());
            ECS.GameConfig.audio = new ECS.GameAudio();
            Howler.mobileAutoEnable = true;
            //game resources list
            _this.resourceList =
                [
                    "img/doroCat.png",
                    "img/dash_stock.png",
                    "img/blade.png",
                    "img/platform.png",
                    "img/bg_up.png",
                    "img/bg_up_ios.png",
                    "img/bg_down.png",
                    "img/floatingGround.png",
                    "assets/background/BackgroundAssets.json",
                    "assets/food/food.json",
                    "assets/playUI/playPanel.json",
                    "assets/playUI/number.json",
                    "assets/character/chara1.json",
                    "assets/specialEffect/WorldAssets-hd.json"
                ];
            return _this;
        }
        LoadingSystem.prototype.playStartScreenMusic = function () {
            ECS.GameConfig.audio.setVolume('StartMusic', 0.1);
            ECS.GameConfig.audio.play("StartMusic");
        };
        LoadingSystem.prototype.loadingAnime = function () {
            var loadingTextures = [];
            for (var i = 0; i < 3; i++) {
                var texture = PIXI.loader.resources['img/Loading' + (i + 1) + '.png'].texture;
                loadingTextures.push(texture);
            }
            var loading = new PIXI.extras.AnimatedSprite(loadingTextures);
            loading.x = this.width * 0.5;
            loading.y = this.height * 0.7;
            loading.anchor.set(0.5);
            loading.animationSpeed = 0.1;
            loading.play();
            this.loadingStage.addChild(loading);
        };
        LoadingSystem.prototype.Init = function () {
            var _this = this;
            _super.prototype.Init.call(this);
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            //init app for game(add some fundmental options)
            this.app = new PIXI.Application({
                width: this.width,
                height: this.height,
                antialias: true,
                transparent: false,
                resolution: 1 // default: 1
            });
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
                .load(function () {
                console.log("show loading panel!");
                //show bg image
                _this.loadingStage = new PIXI.Container();
                var load_bg = new PIXI.Sprite(PIXI.loader.resources[_this.bgImage].texture);
                load_bg.anchor.x = 0;
                load_bg.anchor.y = 0;
                load_bg.height = _this.height;
                load_bg.width = _this.width;
                _this.loadingStage.addChild(load_bg);
                //show logo
                var logo = new PIXI.Sprite(PIXI.loader.resources[_this.logoImage].texture);
                logo.anchor.set(0.5);
                logo.position.x = _this.width * 0.5;
                logo.position.y = _this.height * 0.4;
                var logoRatio = logo.width / logo.height;
                logo.height = _this.height / 2;
                logo.width = logo.height * logoRatio;
                _this.loadingStage.addChild(logo);
                _this.loadingAnime();
                //TODO! progress bar animation
                _this.app.stage.addChild(_this.loadingStage);
                //read game resources
                _this.LoadGameResources();
            });
        };
        LoadingSystem.prototype.LoadGameResources = function () {
            var _this = this;
            PIXI.loader
                .add(this.resourceList)
                .load(function () {
                console.log("data assets loaded!");
                //remove loading panel
                _this.app.stage.removeChild(_this.loadingStage);
                //setup game main system 
                ECS.GameConfig.app = _this.app;
                ECS.GameConfig.width = _this.width;
                ECS.GameConfig.height = _this.height;
                ECS.GameConfig.device = _this.device;
                ECS.GameConfig.allSystem = new Utils.HashSet();
                var allSystem = ECS.GameConfig.allSystem;
                allSystem.set("background", new ECS.GameBackGroundSystem());
                allSystem.set("view", new ECS.GameViewSystem());
                allSystem.set("kernel", new ECS.GameKernelSystem());
                var mainSystem = new MainSystem(allSystem);
                //game start
                ECS.GameConfig.game = allSystem.get("kernel");
                //bind event 
                var evtSys = new EventListenerSystem();
                evtSys.bindEvent();
                var game = ECS.GameConfig.game;
                //show hud
                game.view.showHud();
                update();
                game.start();
                ECS.GameConfig.gameMode = ECS.GAMEMODE.PLAYING;
                ECS.GameConfig.playerMode = ECS.PLAYMODE.RUNNING;
            });
        };
        LoadingSystem.prototype.Execute = function () {
            _super.prototype.Execute.call(this);
        };
        return LoadingSystem;
    }(ECS.System));
    ECS.LoadingSystem = LoadingSystem;
    var EventListenerSystem = /** @class */ (function (_super) {
        __extends(EventListenerSystem, _super);
        function EventListenerSystem() {
            return _super.call(this, "eventlistener") || this;
        }
        EventListenerSystem.prototype.bindEvent = function () {
            //for pc version
            window.addEventListener("keydown", this.onKeyDown, true);
            window.addEventListener("keyup", this.onKeyUp, true);
            window.addEventListener("touchstart", this.onTouchStart, true);
        };
        EventListenerSystem.prototype.onKeyDown = function (event) {
            if (event.keyCode == 32 || event.keyCode == 38) {
                ECS.GameConfig.audio.play("jump");
                if (ECS.GameConfig.game.isPlaying && !ECS.GameConfig.game.player.startJump && !ECS.GameConfig.game.player.isPlayingNinjiaEffect)
                    ECS.GameConfig.game.player.jump();
                if (ECS.GameConfig.game.isPlaying && ECS.GameConfig.game.player.isJumped && !ECS.GameConfig.game.player.isPlayingNinjiaEffect)
                    ECS.GameConfig.game.player.jumpTwo();
            }
            else if (event.keyCode == 40) {
                //console.log(GameConfig.game.player.onGround);
                if (ECS.GameConfig.game.isPlaying && !ECS.GameConfig.game.player.isJumped && ECS.GameConfig.game.player.onGround) {
                    ECS.GameConfig.game.player.slide(true);
                }
            }
            else if (event.keyCode == 39) {
                if (ECS.GameConfig.game.isPlaying && ECS.GameConfig.specialMode == ECS.SPECIALMODE.JAPANMODE) {
                    ECS.GameConfig.audio.play("ninjiaModeAttack");
                    ECS.GameConfig.game.player.view.textures = ECS.GameConfig.game.player.dashFrames;
                    ECS.GameConfig.game.player.view.play();
                    ECS.GameConfig.game.player.ninjiaOperate();
                }
                else if (ECS.GameConfig.game.isPlaying && ECS.GameConfig.specialMode == ECS.SPECIALMODE.INDONMODE) {
                    ECS.GameConfig.audio.play("indoMode");
                    ECS.GameConfig.game.player.view.textures = ECS.GameConfig.game.player.runningFrames;
                    ECS.GameConfig.game.player.view.play();
                    ECS.GameConfig.game.player.indoOperate();
                }
            }
        };
        EventListenerSystem.prototype.onKeyUp = function (event) {
            if (event.keyCode == 40) {
                if (ECS.GameConfig.game.isPlaying && ECS.GameConfig.game.player.isSlide) {
                    ECS.GameConfig.game.player.slide(false);
                }
            }
        };
        EventListenerSystem.prototype.onTouchStart = function (event) {
            if (event.target.type !== 'button') {
                if (ECS.GameConfig.game.isPlaying && !(ECS.GameConfig.playerMode == ECS.PLAYMODE.JUMPING1))
                    ECS.GameConfig.game.player.jump();
                if (ECS.GameConfig.game.isPlaying && (ECS.GameConfig.playerMode == ECS.PLAYMODE.JUMPING1))
                    ECS.GameConfig.game.player.jumpTwo();
            }
        };
        return EventListenerSystem;
    }(ECS.System));
    ECS.EventListenerSystem = EventListenerSystem;
})(ECS || (ECS = {}));
/// <reference path="./core/Component.ts" />
/// <reference path="./core/System.ts" />
/// <reference path="./core/Entity.ts" />
/// <reference path="./core/HashSet.ts" />
/// <reference path="./core/GameLoad.ts" />
var load_system = new ECS.LoadingSystem();
if (load_system.device.desktop) {
    $('#modal_movie').modal('show');
    load_system.playStartScreenMusic();
}
else {
    $('#modal_setting').modal('show');
}
var startGame = function () {
    load_system.Init();
};
document.getElementById("btn_play").onclick = function () {
    document.getElementById("global").style.display = "none";
    startGame();
};
document.getElementById("openMusic").onclick = function () {
    load_system.playStartScreenMusic();
    $('#modal_setting').modal('hide');
    $('#modal_movie').modal('show');
};
document.getElementById("btn_close").onclick = function () {
    $('#modal_movie').modal('show');
};
/* =========================================================================
 *
 *  GamePartical.ts
 *  partical effect
 *
 * ========================================================================= */
var ECS;
(function (ECS) {
    var ExplosionPartical = /** @class */ (function () {
        function ExplosionPartical(id) {
            PIXI.Sprite.call(this, PIXI.Texture.fromFrame(id));
            this.anchor.x = 0.5;
            this.anchor.y = 0.5;
            this.speed = new PIXI.Point();
        }
        return ExplosionPartical;
    }());
    ECS.ExplosionPartical = ExplosionPartical;
    ExplosionPartical.prototype = Object.create(PIXI.Sprite.prototype);
    var Explosion = /** @class */ (function () {
        function Explosion() {
            PIXI.DisplayObjectContainer.call(this);
            this.particals = [];
            this.top = new ExplosionPartical("asplodeInner02.png");
            this.bottom = new ExplosionPartical("asplodeInner01.png");
            this.top.position.y = -20;
            this.bottom.position.y = 20;
            this.top.position.x = 20;
            this.bottom.position.x = 20;
            this.anchor = new PIXI.Point();
            this.addChild(this.top);
            this.addChild(this.bottom);
            this.particals = [this.top, this.bottom];
            for (var i = 0; i < 5; i++) {
                this.particals.push(new ExplosionPartical("asplodeSpike_01.png"));
                this.particals.push(new ExplosionPartical("asplodeSpike_02.png"));
            }
            this.clouds = [];
            for (var i = 0; i < 5; i++) {
                var cloud = new PIXI.Sprite.fromFrame("dustSwirl.png");
                this.clouds.push(cloud);
                this.addChild(cloud);
            }
            this.reset();
        }
        return Explosion;
    }());
    ECS.Explosion = Explosion;
    Explosion.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
    Explosion.prototype.explode = function () {
        this.exploding = true;
    };
    Explosion.prototype.reset = function () {
        for (var i = 0; i < 5; i++) {
            var cloud = this.clouds[i];
            cloud.anchor.x = 0.5;
            cloud.anchor.y = 0.5;
            cloud.scaleTarget = 2 + Math.random() * 2;
            cloud.scale.x = cloud.scale.x = 0.5;
            cloud.alpha = 0.75;
            cloud.position.x = (Math.random() - 0.5) * 150;
            cloud.position.y = (Math.random() - 0.5) * 150;
            cloud.speed = new PIXI.Point(Math.random() * 20 - 10, Math.random() * 20 - 10);
            cloud.state = 0;
            cloud.rotSpeed = Math.random() * 0.05;
        }
        for (var i = 0; i < this.particals.length; i++) {
            var partical = this.particals[i];
            this.addChild(partical);
            var angle = (i / this.particals.length) * Math.PI * 2;
            var speed = 7 + Math.random();
            partical.directionX = Math.cos(angle) * speed;
            partical.directionY = Math.sin(angle) * speed;
            partical.rotation = -angle;
            partical.rotationSpeed = Math.random() * 0.02;
        }
    };
    Explosion.prototype.updateTransform = function () {
        if (this.exploding) {
            for (var i = 0; i < this.clouds.length; i++) {
                var cloud = this.clouds[i];
                cloud.rotation += cloud.rotSpeed;
                if (cloud.state === 0) {
                    cloud.scale.x += (cloud.scaleTarget - cloud.scale.x) * 5;
                    cloud.scale.y = cloud.scale.x;
                    if (cloud.scale.x > cloud.scaleTarget - 0.1)
                        cloud.state = 1;
                }
                else {
                    cloud.position.x += cloud.speed.x * 0.05;
                    cloud.position.y += cloud.speed.y * 0.05;
                }
            }
            for (var i = 0; i < this.particals.length; i++) {
                var partical = this.particals[i];
                partical.directionY += 0.1;
                partical.directionX *= 0.99;
                partical.position.x += partical.directionX;
                partical.position.y += partical.directionY;
                partical.rotation += partical.rotationSpeed;
            }
        }
        PIXI.DisplayObjectContainer.prototype.updateTransform.call(this);
    };
})(ECS || (ECS = {}));
