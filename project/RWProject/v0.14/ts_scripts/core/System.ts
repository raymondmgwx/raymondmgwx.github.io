/* =========================================================================
 *
 *  System.ts
 *  system using for controlling the game
 *
 * ========================================================================= */
/// <reference path="./HashSet.ts" />
/// <reference path="./Utils.ts" />
/// <reference path="./GameConfig.ts" />
module ECS {

    export class System {
        name: string;
        constructor(name: string) {
            this.name = name;
        }
        Init(){
            console.log("[" + this.name + "]System initialization!");
        }
        Execute() {
            console.log("[" + this.name + "]System Execute!");
        }
    }
}