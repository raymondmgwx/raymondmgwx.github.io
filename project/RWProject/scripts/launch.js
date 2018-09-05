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
    var ThreeJsMoveEntity = /** @class */ (function () {
        function ThreeJsMoveEntity(startPos, endPos) {
            this.startPos = startPos;
            this.endPos = endPos;
        }
        return ThreeJsMoveEntity;
    }());
    ECS.ThreeJsMoveEntity = ThreeJsMoveEntity;
})(ECS || (ECS = {}));
/* =========================================================================
 *
 *  System.ts
 *  game execute logical
 *
 * ========================================================================= */
/// <reference path="./Entity.ts" />
/// <reference path="./HashSet.ts" />
/// <reference path="./Utils.ts" />
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
        function LoadingSystem() {
            return _super.call(this, "loading") || this;
        }
        LoadingSystem.prototype.Execute = function () {
            _super.prototype.Execute.call(this);
        };
        return LoadingSystem;
    }(System));
    ECS.LoadingSystem = LoadingSystem;
    var MainSystem = /** @class */ (function (_super) {
        __extends(MainSystem, _super);
        function MainSystem(GlobalDatas, othSystems) {
            var _this = _super.call(this, "main") || this;
            _this.GlobalDatas = GlobalDatas;
            _this.OtherSystems = othSystems;
            _this.MainSystem = _this;
            return _this;
        }
        MainSystem.prototype.Execute = function () {
            _super.prototype.Execute.call(this);
            var g = this.GlobalDatas;
            var m = this.MainSystem;
            this.OtherSystems.forEach(function (key, val) {
                val.GlobalDatas = g;
                val.MainSystem = m;
                val.Execute();
            });
        };
        return MainSystem;
    }(System));
    ECS.MainSystem = MainSystem;
    var ThreeJsSystem = /** @class */ (function (_super) {
        __extends(ThreeJsSystem, _super);
        function ThreeJsSystem() {
            var _this = _super.call(this, "threejs") || this;
            _this.GlobalParams = new Utils.HashSet();
            return _this;
        }
        ThreeJsSystem.prototype.Execute = function () {
            _super.prototype.Execute.call(this);
        };
        return ThreeJsSystem;
    }(System));
    ECS.ThreeJsSystem = ThreeJsSystem;
    var EventListenerSystem = /** @class */ (function (_super) {
        __extends(EventListenerSystem, _super);
        function EventListenerSystem() {
            return _super.call(this, "eventlistener") || this;
        }
        EventListenerSystem.prototype.Execute = function () {
            _super.prototype.Execute.call(this);
        };
        return EventListenerSystem;
    }(System));
    ECS.EventListenerSystem = EventListenerSystem;
})(ECS || (ECS = {}));
/// <reference path="./core/Component.ts" />
/// <reference path="./core/System.ts" />
/// <reference path="./core/Entity.ts" />
/// <reference path="./core/HashSet.ts" />
var load = function () {
    if (!Detector.webgl) {
        Detector.addGetWebGLMessage();
    }
    else {
        var load_system = new ECS.LoadingSystem();
        load_system.Execute();
    }
    ;
};
load();
