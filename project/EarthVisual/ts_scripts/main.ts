/// <reference path="./Component.ts" />
/// <reference path="./System.ts" />
/// <reference path="./Entity.ts" />
/// <reference path="./LoadData.ts" />
/// <reference path="./HashSet.ts" />

declare var Detector: any;


let entity_tip = new ECS.Entity("tip_entity");
entity_tip.addComponent(new ECS.JsonDataComponent());
let entity_country = new ECS.Entity("country_entity");
entity_country.addComponent(new ECS.JsonDataComponent());
let entity_missile = new ECS.Entity("missile_entity");
entity_missile.addComponent(new ECS.JsonDataComponent());
let entity_history = new ECS.Entity("history_entity");
entity_history.addComponent(new ECS.JsonDataComponent());


let entity_citycode = new ECS.Entity("citycode_entity");
entity_citycode.addComponent(new ECS.JsonDataComponent());
let entity_2008data = new ECS.Entity("2008data_entity");
entity_2008data.addComponent(new ECS.JsonDataComponent());

let entities = new Utils.HashSet<ECS.Entity>();
entities.set(entity_tip.name, entity_tip);
entities.set(entity_country.name, entity_country);
entities.set(entity_missile.name, entity_missile);
entities.set(entity_history.name, entity_history);

entities.set(entity_citycode.name, entity_citycode);
entities.set(entity_2008data.name, entity_2008data);

let load_system = new ECS.LoadingSystem(entities);

var load = function () {
    if (!Detector.webgl) {
        Detector.addGetWebGLMessage();
    } else {
        load_system.Execute();
    };
}