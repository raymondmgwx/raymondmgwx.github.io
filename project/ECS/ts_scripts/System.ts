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

            var mapImage = new Image();
            mapImage.src = './images/map_outline.png';
            mapImage.onload = () => {
                console.log("load image data finished!");
                Utils.loadData('./data/tip.json', <JsonDataComponent>this.entities.get("tip_entity").components.get("jsondata"), function () {
                    console.log("load tip data finished!");
                    Utils.loadData('./data/country.json', <JsonDataComponent>this.entities.get("country_entity").components.get("jsondata"), function () {
                        console.log("load country data finished!");
                        Utils.loadData('./data/missile.json', <JsonDataComponent>this.entities.get("missile_entity").components.get("jsondata"), function () {
                            console.log("load missile data finished!");
                            Utils.loadData('./data/history.json', <JsonDataComponent>this.entities.get("history_entity").components.get("jsondata"), function () {
                                console.log("load history data finished!");
                                //print json
                                //console.log((<JsonDataComponent>this.entities.get("tip_entity").components.get("jsondata")).data);
                                //console.log((<JsonDataComponent>this.entities.get("country_entity").components.get("jsondata")).data);
                                var timeBins = JSON.parse((<JsonDataComponent>this.entities.get("history_entity").components.get("jsondata")).data).timeBins;
                                var missileLookup = JSON.parse((<JsonDataComponent>this.entities.get("missile_entity").components.get("jsondata")).data);
                                var latlonData = JSON.parse((<JsonDataComponent>this.entities.get("country_entity").components.get("jsondata")).data);
                                ThreeJS.initThreeJs(mapImage);
                                ThreeJS.animate();
                            });
                        });
                    });
                });
            };

        }
    }


}