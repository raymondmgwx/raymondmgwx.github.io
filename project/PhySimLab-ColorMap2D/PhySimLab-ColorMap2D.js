//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////                                                                      //
////  Image-Visual-Lab      //////////   v0.0                                                              //
//////////////////////////////////////                                                                      //
//////////////////////////////////////  Copyright 2018-2019,                                                //
//////////////////////////////////////  Last vist: 03, 16, 2018  by Raymond Wang                             //
//////////////////////////////////////                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////WANG  XU///-->

var gaussian_scene = new THREE.Scene();
var gaussian_canvas = document.getElementById('canvas-gaussian');
var gaussian_camera = new THREE.OrthographicCamera(-50, 50, 50, -50, 1, 100);
var gaussian_track = new THREE.TrackballControls(gaussian_camera);
var gaussian_renderer = new THREE.WebGLRenderer({ antialias: true });


var lg1 = new ColorMap_2D(gaussian_canvas, gaussian_track, gaussian_scene, gaussian_camera, gaussian_renderer);


function loop() {

    gaussian_track.update();
    gaussian_renderer.clear();
    gaussian_renderer.render(gaussian_scene, gaussian_camera);
    requestAnimationFrame(loop);
}

function addScript() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "./project/PhySimLab-2d/PhySimLab-theme.js";
    document.getElementsByTagName("head")[0].appendChild(script);
}


loop();
addScript();