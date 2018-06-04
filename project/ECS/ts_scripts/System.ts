/* =========================================================================
 *
 *  System.js
 *  game execute logical
 *
 * ========================================================================= */
/// <reference path="./Entity.ts" />
module ECS {
    export class System {
        name: string;
        constructor(name: string) {
            this.name = name;
        }
        Execute() {
            console.log("[" + this.name + "]System Execute!");
        }
    }

    export class CollisionSystem extends System {

        entities: Array<Entity>;
        constructor(entities: Array<Entity>) {
            super("collision");
            this.entities = entities;
        }
        Execute() {
            super.Execute();
        }
    }


}