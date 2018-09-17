/// <reference path="./core/Component.ts" />
/// <reference path="./core/System.ts" />
/// <reference path="./core/Entity.ts" />
/// <reference path="./core/HashSet.ts" />
/// <reference path="./core/GameLoad.ts" />
declare var PIXI;
declare var $;

let load_system = new ECS.LoadingSystem();

if(load_system.device.desktop){
        $('#modal_movie').modal('show');
        load_system.playStartScreenMusic();
}else{
        $('#modal_setting').modal('show'); 
}


var startGame = function () {
        load_system.Init();
}


document.getElementById("btn_play").onclick= function(){
        document.getElementById("global").style.display = "none";
        startGame();
}

document.getElementById("openMusic").onclick= function(){
        load_system.playStartScreenMusic();
        $('#modal_setting').modal('hide'); 
}
