/* =========================================================================
 *
 *  Component.js
 *  Each entity can obtain many components
 *
 * ========================================================================= */
/// <reference path="./Config.ts" />
module ECS {
    export class Component {
        name: string;
        constructor(name: string) {
            this.name = name;
        }
    }
    export class AppearanceComponent extends Component {
        rgb: [number, number, number];
        size: number;
        constructor(rgb: [number, number, number] = [0, 100, 150], size: number = (1 + (Math.random() * 30 | 0))) {
            super("appearance");
            this.rgb = rgb;
            this.size = size;
        }
    }
    export class HealthComponent extends Component {
        value: number;
        constructor(value: number = 20) {
            super("health");
            this.value = value;
        }
    }
    export class PositionComponent extends Component {
        x: number;
        y: number;
        constructor(x: number = 20 + (Math.random() * (ECS.canvasWidth - 20) | 0), y: number = 20 + (Math.random() * (ECS.canvasHeight - 20) | 0)) {
            super("position");
            this.x = x;
            this.y = y;
        }
    }

    export class PlayerControllerComponent extends Component {
        enable: boolean;
        constructor(enable: boolean = true) {
            super("playercontroller");
            this.enable = enable;
        }
    }

    export class CollisionComponent extends Component {
        enable: boolean;
        constructor(enable: boolean = true) {
            super("collision");
            this.enable = enable;
        }
    }
}
