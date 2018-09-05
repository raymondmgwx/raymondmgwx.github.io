/* =========================================================================
 *
 *  System.ts
 *  game execute logical
 *
 * ========================================================================= */
/// <reference path="./Entity.ts" />
/// <reference path="./HashSet.ts" />
/// <reference path="./Utils.ts" />
module ECS {

    export class System {
        name: string;
        GlobalDatas: ECS.Entity;
        MainSystem: ECS.System;
        constructor(name: string) {
            this.name = name;
        }
        Execute() {
            console.log("[" + this.name + "]System Execute!");
        }
    }

    export class LoadingSystem extends System {

        constructor() {
            super("loading");
        }

        Execute() {
            super.Execute();
        }
    }


    export class MainSystem extends System {
        OtherSystems: Utils.HashSet<System>;
        constructor(GlobalDatas: ECS.Entity, othSystems: Utils.HashSet<System>) {
            super("main");
            this.GlobalDatas = GlobalDatas;
            this.OtherSystems = othSystems;
            this.MainSystem = this;
        }
        Execute() {
            super.Execute();
            var g = this.GlobalDatas;
            var m = this.MainSystem;
            this.OtherSystems.forEach(function (key, val) {
                (<System>val).GlobalDatas = g;
                (<System>val).MainSystem = m;
                (<System>val).Execute();
            });
        }
    }

    declare var Hammer: any;
    declare var THREE: any;
    declare var THREEx: any;
    declare var $: any;
    declare var Math: any;
    declare var Stats: any;
    declare var dat: any;

    export class ThreeJsSystem extends System {
        GlobalParams: Utils.HashSet<any>;
        constructor() {
            super("threejs");
            this.GlobalParams = new Utils.HashSet<any>();
        }

        Execute() {
            super.Execute();
      
        }
    }

    export class EventListenerSystem extends System {
        GlobalParams: Utils.HashSet<any>;
        constructor() {
            super("eventlistener");
        
        }

        Execute() {
            super.Execute();
        }
    }


}