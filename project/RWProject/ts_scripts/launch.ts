/// <reference path="./core/Component.ts" />
/// <reference path="./core/System.ts" />
/// <reference path="./core/Entity.ts" />
/// <reference path="./core/HashSet.ts" />

declare var Detector: any;

var load = function () {
    if (!Detector.webgl) {
        Detector.addGetWebGLMessage();
    } else {
        let load_system = new ECS.LoadingSystem();
        load_system.Execute();
    };
}

load();