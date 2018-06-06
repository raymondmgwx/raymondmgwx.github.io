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
module ECS {

    export class System {
        name: string;
        GlobalDatas: ECS.Entity;
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

            // var mapImage = new Image();
            // mapImage.src = './images/2_no_clouds_4k.jpg';
            //console.log("load image data finished!");
            Utils.loadData('./data/tip.json', <JsonDataComponent>this.entities.get("tip_entity").components.get("jsondata"), function () {
                console.log("load tip data finished!");
                Utils.loadData('./data/country.json', <JsonDataComponent>this.entities.get("country_entity").components.get("jsondata"), function () {
                    console.log("load country data finished!");
                    Utils.loadData('./data/missile.json', <JsonDataComponent>this.entities.get("missile_entity").components.get("jsondata"), function () {
                        console.log("load missile data finished!");
                        Utils.loadData('./data/history.json', <JsonDataComponent>this.entities.get("history_entity").components.get("jsondata"), function () {
                            console.log("load history data finished!");
                            var timeBins = JSON.parse((<JsonDataComponent>this.entities.get("history_entity").components.get("jsondata")).data).timeBins;
                            var missileLookup = JSON.parse((<JsonDataComponent>this.entities.get("missile_entity").components.get("jsondata")).data);
                            var latlonData = JSON.parse((<JsonDataComponent>this.entities.get("country_entity").components.get("jsondata")).data);

                            let entity_GlobalData = new ECS.Entity("global_entity");
                            let global_data = new Utils.HashSet<any>();
                            global_data.add("timeBins", timeBins);
                            global_data.add("missileLookup", missileLookup);
                            global_data.add("latlonData", latlonData);
                            entity_GlobalData.addComponent(new ECS.GlobalComponent(global_data));

                            let other_systems = new Utils.HashSet<System>();
                            let main_system = new ECS.MainSystem(entity_GlobalData, other_systems);

                            ThreeJS.initThreeJs(timeBins, missileLookup, latlonData);
                            ThreeJS.animate();
                        });
                    });
                });
            });
        }
    }


    export class MainSystem extends System {
        OtherSystems: Utils.HashSet<System>;
        constructor(GlobalDatas: ECS.Entity, othSystems: Utils.HashSet<System>) {
            super("main");
            this.GlobalDatas = GlobalDatas;
            this.OtherSystems = othSystems;
        }
        Execute() {
            super.Execute();
            this.OtherSystems.forEach(function (key, val) {
                (<System>val).GlobalDatas = this.GlobalDatas;
                (<System>val).Execute();
            });
        }
    }


}