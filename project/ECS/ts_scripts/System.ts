/* =========================================================================
 *
 *  System.ts
 *  game execute logical
 *
 * ========================================================================= */
/// <reference path="./Entity.ts" />
/// <reference path="./LoadData.ts" />
/// <reference path="./HashSet.ts" />
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

    export class LoadingSystem extends System {

        entities: Utils.HashSet<Entity>;
        constructor(entities: Utils.HashSet<Entity>) {
            super("loading");
            this.entities = entities;
        }
        Execute() {
            super.Execute();
            Utils.loadData('./data/tip.json',<JsonDataComponent>this.entities.get("tip_entity").components.get("jsondata"),function(){
                console.log("load tip data finished!");
                Utils.loadData('./data/country.json',<JsonDataComponent>this.entities.get("country_entity").components.get("jsondata"),function(){
                    console.log("load country data finished!");
                    //print json
                    console.log((<JsonDataComponent>this.entities.get("tip_entity").components.get("jsondata")).data);
                    console.log((<JsonDataComponent>this.entities.get("country_entity").components.get("jsondata")).data);
                });
            });
        }
    }


}