/// <reference path="./Component.ts" />
/// <reference path="./System.ts" />
/// <reference path="./Entity.ts" />
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
let entities = new Utils.HashSet<ECS.Entity>();
entities.add(entity_tip.name, entity_tip);
entities.add(entity_country.name, entity_country);
entities.add(entity_missile.name, entity_missile);
entities.add(entity_history.name, entity_history);

let load_system = new ECS.LoadingSystem(entities);

var load = function () {
    if (!Detector.webgl) {
        Detector.addGetWebGLMessage();
    } else {
        load_system.Execute();
    };
}