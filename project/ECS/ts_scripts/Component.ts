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

    export class JsonDataComponent extends Component {
        data:string
        constructor(value: string = "") {
            super("jsondata");
            this.data = value;
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
}
