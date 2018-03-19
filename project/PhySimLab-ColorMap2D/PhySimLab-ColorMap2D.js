//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////                                                                      //
////  Image-Visual-Lab      //////////   v0.0                                                              //
//////////////////////////////////////                                                                      //
//////////////////////////////////////  Copyright 2018-2019,                                                //
//////////////////////////////////////  Last vist: 03, 16, 2018  by Raymond Wang                             //
//////////////////////////////////////                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////WANG  XU///-->
var rgb_scene = new THREE.Scene();
var rgb_canvas = document.getElementById('canvas-rgb');
var rgb_camera = new THREE.OrthographicCamera(-50, 50, 50, -50, 1, 100);
var rgb_track = new THREE.TrackballControls(rgb_camera);
var rgb_renderer = new THREE.WebGLRenderer({ antialias: true });

var hsl_scene = new THREE.Scene();
var hsl_canvas = document.getElementById('canvas-hsl');
var hsl_camera = new THREE.OrthographicCamera(-50, 50, 50, -50, 1, 100);
var hsl_track = new THREE.TrackballControls(hsl_camera);
var hsl_renderer = new THREE.WebGLRenderer({ antialias: true });

var gaussian_scene = new THREE.Scene();
var gaussian_canvas = document.getElementById('canvas-gaussian');
var gaussian_camera = new THREE.OrthographicCamera(-50, 50, 50, -50, 1, 100);
var gaussian_track = new THREE.TrackballControls(gaussian_camera);
var gaussian_renderer = new THREE.WebGLRenderer({ antialias: true });

var rgbColorMap = new ColorMap_2D(rgb_canvas, rgb_track, rgb_scene, rgb_camera, rgb_renderer, "rgb");
var hslColorMap = new ColorMap_2D(hsl_canvas, hsl_track, hsl_scene, hsl_camera, hsl_renderer, "hsl");
var gaussianColorMap = new ColorMap_2D(gaussian_canvas, gaussian_track, gaussian_scene, gaussian_camera, gaussian_renderer, "gaussian");
var gaussian_lattice = gaussianColorMap.lattice;


var step = 0;
var omega = Math.PI / 50;
var R = 20;
var sigma = 300;
var z_ = 50;
var N = 100;
var l = 1;

function loop() {

    rgb_track.update();
    rgb_renderer.clear();
    rgb_renderer.render(rgb_scene, rgb_camera);
}

function loop1() {
    hsl_track.update();

    hsl_renderer.clear();
    hsl_renderer.render(hsl_scene, hsl_camera);

}




function loop2() {
    step++;
    var colors = new Array();
    var x_ = R * Math.cos(omega * step);
    var y_ = R * Math.sin(omega * step);

    for (var j = 0; j <= N; j++) {
        for (var i = 0; i <= N; i++) {
            var x = (-N / 2 + i) * l;
            var y = (-N / 2 + j) * l;
            var z = z_ * Math.exp(-((x - x_) * (x - x_) + (y - y_) * (y - y_)) / (2 * sigma));
            colors.push(new THREE.Color().setRGB(z / z_, 0, 0));
        }
    }
    var n = 0;
    for (var j = 0; j < N; j++) {
        for (var i = 0; i < N; i++) {
            gaussian_lattice.geometry.faces[n].vertexColors[0].copy(colors[(N + 1) * j + i]);
            gaussian_lattice.geometry.faces[n].vertexColors[1].copy(colors[(N + 1) * j + i + 1]);
            gaussian_lattice.geometry.faces[n].vertexColors[2].copy(colors[(N + 1) * (j + 1) + i]);

            gaussian_lattice.geometry.faces[n + 1].vertexColors[0].copy(colors[(N + 1) * (j + 1) + i]);
            gaussian_lattice.geometry.faces[n + 1].vertexColors[1].copy(colors[(N + 1) * j + i + 1]);
            gaussian_lattice.geometry.faces[n + 1].vertexColors[2].copy(colors[(N + 1) * (j + 1) + i + 1]);

            n += 2;
        }
    }
    gaussian_lattice.geometry.colorsNeedUpdate = true;
    gaussian_renderer.clear();
    gaussian_renderer.render(gaussian_scene, gaussian_camera);
    requestAnimationFrame(loop2);
}

function addScript() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "./project/PhySimLab-2d/PhySimLab-theme.js";
    document.getElementsByTagName("head")[0].appendChild(script);
}


loop();
loop1();
loop2();
addScript();