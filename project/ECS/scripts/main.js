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
/* =========================================================================
 *
 *  Config.js
 *  ECS System Config
 *
 * ========================================================================= */
var ECS;
(function (ECS) {
    ECS.canvasWidth = 600;
    ECS.canvasHeight = 400;
})(ECS || (ECS = {}));
/* =========================================================================
 *
 *  Component.js
 *  Each entity can obtain many components
 *
 * ========================================================================= */
/// <reference path="./Config.ts" />
var ECS;
(function (ECS) {
    var Component = /** @class */ (function () {
        function Component(name) {
            this.name = name;
        }
        return Component;
    }());
    ECS.Component = Component;
    var JsonDataComponent = /** @class */ (function (_super) {
        __extends(JsonDataComponent, _super);
        function JsonDataComponent(value) {
            if (value === void 0) { value = ""; }
            var _this = _super.call(this, "jsondata") || this;
            _this.data = value;
            return _this;
        }
        return JsonDataComponent;
    }(Component));
    ECS.JsonDataComponent = JsonDataComponent;
    var PositionComponent = /** @class */ (function (_super) {
        __extends(PositionComponent, _super);
        function PositionComponent(x, y) {
            if (x === void 0) { x = 20 + (Math.random() * (ECS.canvasWidth - 20) | 0); }
            if (y === void 0) { y = 20 + (Math.random() * (ECS.canvasHeight - 20) | 0); }
            var _this = _super.call(this, "position") || this;
            _this.x = x;
            _this.y = y;
            return _this;
        }
        return PositionComponent;
    }(Component));
    ECS.PositionComponent = PositionComponent;
})(ECS || (ECS = {}));
var Utils;
(function (Utils) {
    ;
    var HashSet = /** @class */ (function () {
        function HashSet() {
            this.items = {};
        }
        HashSet.prototype.add = function (key, value) {
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
            this.components.add(component.name, component);
            console.log("add [" + component.name + "] component");
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
 *  LoadData.ts
 *  load data from json file
 *
 * ========================================================================= */
/// <reference path="./System.ts" />
var Utils;
(function (Utils) {
    function loadData(path, jsondata, callback) {
        var cxhr = new XMLHttpRequest();
        cxhr.open('GET', path, true);
        cxhr.onreadystatechange = function () {
            if (cxhr.readyState === 4 && cxhr.status === 200) {
                jsondata.data = cxhr.responseText;
                if (callback)
                    callback();
            }
        };
        cxhr.send(null);
    }
    Utils.loadData = loadData;
})(Utils || (Utils = {}));
/* =========================================================================
 *
 *  ThreeJsFunc.ts
 *  using three.js library to init 3D scene
 *
 * ========================================================================= */
var ThreeJS;
(function (ThreeJS) {
    var camera, scene, renderer;
    var camera2d, scene2d;
    var sphere;
    var rotating;
    var visualizationMesh;
    var glContainer = document.getElementById('glContainer');
    var dpr = window.devicePixelRatio ? window.devicePixelRatio : 1;
    function initThreeJs(mapImage) {
        scene = new THREE.Scene();
        scene.matrixAutoUpdate = false;
        scene2d = new THREE.Scene();
        scene.add(new THREE.AmbientLight(0x505050));
        var light1 = new THREE.SpotLight(0xeeeeee, 3);
        light1.position.x = 730;
        light1.position.y = 520;
        light1.position.z = 626;
        light1.castShadow = true;
        scene.add(light1);
        var light2 = new THREE.PointLight(0x222222, 14.8);
        light2.position.x = -640;
        light2.position.y = -500;
        light2.position.z = -1000;
        scene.add(light2);
        rotating = new THREE.Object3D();
        scene.add(rotating);
        var MapTexture = new THREE.Texture(mapImage);
        MapTexture.needsUpdate = true;
        var mapMaterial = new THREE.MeshBasicMaterial({
            map: MapTexture,
            polygonOffset: true,
            polygonOffsetFactor: 1,
            polygonOffsetUnits: 1
        });
        sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(100, 40, 40), mapMaterial);
        sphere.doubleSided = false;
        sphere.rotation.x = Math.PI;
        sphere.rotation.y = -Math.PI / 2;
        sphere.rotation.z = Math.PI;
        sphere.id = "base";
        rotating.add(sphere);
        var wireframeGeo = new THREE.EdgesGeometry(sphere.geometry, 0.3);
        var wireframeMaterial = new THREE.LineBasicMaterial({
            color: Math.random() * 0xffffff,
            linewidth: 0.5
        });
        var wireframe = new THREE.LineSegments(wireframeGeo, wireframeMaterial);
        sphere.add(wireframe);
        var atmosphereMaterial = new THREE.ShaderMaterial({
            vertexShader: document.getElementById('vertexShaderAtmosphere').textContent,
            fragmentShader: document.getElementById('fragmentShaderAtmosphere').textContent,
            // atmosphere should provide light from behind the sphere, so only render the back side
            side: THREE.BackSide
        });
        var atmosphere = new THREE.Mesh(sphere.geometry.clone(), atmosphereMaterial);
        atmosphere.scale.x = atmosphere.scale.y = atmosphere.scale.z = 1.8;
        rotating.add(atmosphere);
        // load geo data (facility lat lons in this case)
        //console.time('loadGeoData');
        //loadGeoData(latlonData);
        //console.timeEnd('loadGeoData');
        //	-----------------------------------------------------------------------------
        //	Setup our renderer
        renderer = new THREE.WebGLRenderer({ antialias: false });
        renderer.setPixelRatio(dpr);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.autoClear = false;
        renderer.sortObjects = false;
        renderer.generateMipmaps = false;
        glContainer.appendChild(renderer.domElement);
        // Detect passive event support
        var passive = false;
        var options = Object.defineProperty({}, 'passive', {
            get: function () {
                passive = true;
            }
        });
        //	-----------------------------------------------------------------------------
        //	Setup our camera
        var aspect = window.innerWidth / window.innerHeight;
        camera = new THREE.PerspectiveCamera(12 / Math.min(aspect, 1), aspect, 1, 20000);
        camera.position.z = 400;
        camera.position.y = 0;
        camera.lookAt(scene.position);
        camera.zoom = 0.5;
        scene.add(camera);
        camera2d = new THREE.OrthographicCamera(0, window.innerWidth, 0, window.innerHeight, 1, 20000);
        camera2d.position.z = 400;
        camera2d.position.y = 0;
        camera.lookAt(scene2d.position);
        var windowResize = THREEx.WindowResize(renderer, camera, camera2d);
    }
    ThreeJS.initThreeJs = initThreeJs;
    function render() {
        renderer.clear();
        renderer.render(scene, camera);
    }
    function render2d() {
        renderer.render(scene2d, camera2d);
    }
    function animate() {
        render();
        console.log("request me!");
        requestAnimationFrame(animate);
        render2d();
    }
    ThreeJS.animate = animate;
})(ThreeJS || (ThreeJS = {}));
/* =========================================================================
 *
 *  System.ts
 *  game execute logical
 *
 * ========================================================================= */
/// <reference path="./Entity.ts" />
/// <reference path="./LoadData.ts" />
/// <reference path="./HashSet.ts" />
/// <reference path="./ThreeJsFunc.ts" />
var ECS;
(function (ECS) {
    var System = /** @class */ (function () {
        function System(name) {
            this.name = name;
        }
        System.prototype.Execute = function () {
            console.log("[" + this.name + "]System Execute!");
        };
        return System;
    }());
    ECS.System = System;
    var LoadingSystem = /** @class */ (function (_super) {
        __extends(LoadingSystem, _super);
        function LoadingSystem(entities) {
            var _this = _super.call(this, "loading") || this;
            _this.entities = entities;
            return _this;
        }
        LoadingSystem.prototype.Execute = function () {
            var _this = this;
            _super.prototype.Execute.call(this);
            var mapImage = new Image();
            mapImage.src = './images/map_outline.png';
            mapImage.onload = function () {
                console.log("load image data finished!");
                Utils.loadData('./data/tip.json', _this.entities.get("tip_entity").components.get("jsondata"), function () {
                    console.log("load tip data finished!");
                    Utils.loadData('./data/country.json', this.entities.get("country_entity").components.get("jsondata"), function () {
                        console.log("load country data finished!");
                        //print json
                        //console.log((<JsonDataComponent>this.entities.get("tip_entity").components.get("jsondata")).data);
                        //console.log((<JsonDataComponent>this.entities.get("country_entity").components.get("jsondata")).data);
                        ThreeJS.initThreeJs(mapImage);
                        ThreeJS.animate();
                    });
                });
            };
        };
        return LoadingSystem;
    }(System));
    ECS.LoadingSystem = LoadingSystem;
})(ECS || (ECS = {}));
/// <reference path="./Component.ts" />
/// <reference path="./System.ts" />
/// <reference path="./Entity.ts" />
/// <reference path="./HashSet.ts" />
var entity_tip = new ECS.Entity("tip_entity");
entity_tip.addComponent(new ECS.JsonDataComponent());
var entity_country = new ECS.Entity("country_entity");
entity_country.addComponent(new ECS.JsonDataComponent());
var entities = new Utils.HashSet();
entities.add(entity_tip.name, entity_tip);
entities.add(entity_country.name, entity_country);
var load_system = new ECS.LoadingSystem(entities);
var load = function () {
    if (!Detector.webgl) {
        Detector.addGetWebGLMessage();
    }
    else {
        load_system.Execute();
    }
    ;
};
