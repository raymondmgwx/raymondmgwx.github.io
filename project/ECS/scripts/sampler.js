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
    var AppearanceComponent = /** @class */ (function (_super) {
        __extends(AppearanceComponent, _super);
        function AppearanceComponent(rgb, size) {
            if (rgb === void 0) { rgb = [0, 100, 150]; }
            if (size === void 0) { size = (1 + (Math.random() * 30 | 0)); }
            var _this = _super.call(this, "appearance") || this;
            _this.rgb = rgb;
            _this.size = size;
            return _this;
        }
        return AppearanceComponent;
    }(Component));
    ECS.AppearanceComponent = AppearanceComponent;
    var HealthComponent = /** @class */ (function (_super) {
        __extends(HealthComponent, _super);
        function HealthComponent(value) {
            if (value === void 0) { value = 20; }
            var _this = _super.call(this, "health") || this;
            _this.value = value;
            return _this;
        }
        return HealthComponent;
    }(Component));
    ECS.HealthComponent = HealthComponent;
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
    var PlayerControllerComponent = /** @class */ (function (_super) {
        __extends(PlayerControllerComponent, _super);
        function PlayerControllerComponent(enable) {
            if (enable === void 0) { enable = true; }
            var _this = _super.call(this, "playercontroller") || this;
            _this.enable = enable;
            return _this;
        }
        return PlayerControllerComponent;
    }(Component));
    ECS.PlayerControllerComponent = PlayerControllerComponent;
    var CollisionComponent = /** @class */ (function (_super) {
        __extends(CollisionComponent, _super);
        function CollisionComponent(enable) {
            if (enable === void 0) { enable = true; }
            var _this = _super.call(this, "collision") || this;
            _this.enable = enable;
            return _this;
        }
        return CollisionComponent;
    }(Component));
    ECS.CollisionComponent = CollisionComponent;
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
        function Entity() {
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
/// <reference path="./Component.ts" />
/// <reference path="./Entity.ts" />
/// <reference path="./HashSet.ts" />
var human = new ECS.Entity();
var hair = new ECS.AppearanceComponent();
var hand = new ECS.PositionComponent();
human.addComponent(hair);
human.addComponent(hand);
human.removeComponent(hand);
