/// <reference path="./core/Component.ts" />
/// <reference path="./core/System.ts" />
/// <reference path="./core/Entity.ts" />
/// <reference path="./core/HashSet.ts" />
declare var PIXI;

var load = function () {
        let load_system = new ECS.LoadingSystem();
        load_system.Execute();
}


document.getElementById("btn_play").onclick= function(){
        document.getElementById("global").style.display = "none";
        load();
}
