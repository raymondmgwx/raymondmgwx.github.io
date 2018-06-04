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
 *  System.ts
 *  game execute logical
 *
 * ========================================================================= */
/// <reference path="./Entity.ts" />
/// <reference path="./LoadData.ts" />
/// <reference path="./HashSet.ts" />
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
            _super.prototype.Execute.call(this);
            Utils.loadData('./data/tip.json', this.entities.get("tip_entity").components.get("jsondata"), function () {
                console.log("load tip data finished!");
                Utils.loadData('./data/country.json', this.entities.get("country_entity").components.get("jsondata"), function () {
                    console.log("load country data finished!");
                    //print json
                    console.log(this.entities.get("tip_entity").components.get("jsondata").data);
                    console.log(this.entities.get("country_entity").components.get("jsondata").data);
                });
            });
        };
        return LoadingSystem;
    }(System));
    ECS.LoadingSystem = LoadingSystem;
})(ECS || (ECS = {}));
/// <reference path="./Component.ts" />
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
        var mapImage = new Image();
        mapImage.src = './images/map_outline.png';
        mapImage.onload = function () {
            console.log("load image data finished!");
            load_system.Execute();
        };
    }
    ;
};
