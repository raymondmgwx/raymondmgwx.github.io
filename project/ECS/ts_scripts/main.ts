/// <reference path="./Component.ts" />
/// <reference path="./Entity.ts" />
/// <reference path="./HashSet.ts" />

declare var Detector: any;

let entity_tip = new ECS.Entity("tip_entity");
entity_tip.addComponent(new ECS.JsonDataComponent());
let entity_country = new ECS.Entity("country_entity");
entity_country.addComponent(new ECS.JsonDataComponent());
let entities = new Utils.HashSet<ECS.Entity>();
entities.add(entity_tip.name,entity_tip);
entities.add(entity_country.name,entity_country);

let load_system = new ECS.LoadingSystem(entities);

var load = function() {
	if (!Detector.webgl) {
		Detector.addGetWebGLMessage();
	} else {
        let mapImage = new Image();
        mapImage.src = './images/map_outline.png';
        mapImage.onload= () => {
            console.log("load image data finished!");
			load_system.Execute();
        };
	};
}