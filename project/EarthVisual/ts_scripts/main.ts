/// <reference path="./Component.ts" />
/// <reference path="./System.ts" />
/// <reference path="./Entity.ts" />
/// <reference path="./LoadData.ts" />
/// <reference path="./HashSet.ts" />

declare var Detector: any;



let entity_citycode = new ECS.Entity("citycode_entity");
entity_citycode.addComponent(new ECS.JsonDataComponent());
let entity_2008data = new ECS.Entity("2008data_entity");
entity_2008data.addComponent(new ECS.JsonDataComponent());

let entities = new Utils.HashSet<ECS.Entity>();
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