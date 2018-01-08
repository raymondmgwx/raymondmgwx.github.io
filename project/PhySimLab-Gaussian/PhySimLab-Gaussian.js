//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////                                                                      //
////  Image-Visual-Lab      //////////   v0.0                                                              //
//////////////////////////////////////                                                                      //
//////////////////////////////////////  Copyright 2018-2019,                                                //
//////////////////////////////////////  Last vist: 01, 08, 2018  by Raymond Wang                             //
//////////////////////////////////////                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////WANG  XU///-->

var gaussian_scene = new THREE.Scene();
var gaussian_canvas = document.getElementById('canvas-gaussian');
var gaussian_camera = new THREE.PerspectiveCamera(45, gaussian_canvas.clientWidth / gaussian_canvas.clientHeight, 1, 10000);
var gaussian_track = new THREE.TrackballControls(gaussian_camera);
var gaussian_renderer = new THREE.WebGLRenderer({ antialias: true });


var lg1 = new Lattice_Gaussian(gaussian_canvas, gaussian_track, gaussian_scene, gaussian_camera, gaussian_renderer);


function loop() {

    gaussian_track.update();
    gaussian_renderer.clear();
    gaussian_renderer.render(gaussian_scene, gaussian_camera);
    requestAnimationFrame(loop);
}

var step = 0;
var omega = Math.PI / 50;
var sigma2 = 100;
var N = 100;
var l = 1;
var z0 = 50;
var R = 20;
var gaussian_scene1 = new THREE.Scene();
var gaussian_canvas1 = document.getElementById('canvas-gaussian-anime');
var gaussian_camera1 = new THREE.PerspectiveCamera(45, gaussian_canvas1.clientWidth / gaussian_canvas1.clientHeight, 1, 10000);
var gaussian_track1 = new THREE.TrackballControls(gaussian_camera1);
var gaussian_renderer1 = new THREE.WebGLRenderer({ antialias: true });


var lg2 = new Lattice_Gaussian(gaussian_canvas1, gaussian_track1, gaussian_scene1, gaussian_camera1, gaussian_renderer1);

function loop_anime() {

    gaussian_track1.update();

    step++;

    var x_ = R * Math.cos(omega * step);
    var y_ = R * Math.sin(omega * step);
    var n = 0;
    for (j = 0; j <= N; j++) {
        for (i = 0; i <= N; i++) {
            var x = (-N / 2 + i) * l;
            var y = (-N / 2 + j) * l;
            var z = z0 * Math.exp(-((x - x_) * (x - x_) + (y - y_) * (y - y_)) / (2 * sigma2));
            lg2.lattice.geometry.vertices[n].set(x, y, z);
            n++;
        }
    }



    lg2.lattice.geometry.verticesNeedUpdate = true;
    lg2.lattice.geometry.normalsNeedUpdate = true;
    lg2.lattice.geometry.computeFaceNormals();
    lg2.lattice.geometry.computeVertexNormals();

    gaussian_renderer1.clear();
    gaussian_renderer1.render(gaussian_scene1, gaussian_camera1);
    requestAnimationFrame(loop_anime);
}

function addScript() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "./project/PhySimLab-2d/PhySimLab-theme.js";
    document.getElementsByTagName("head")[0].appendChild(script);
}

function initEvent() {
    document.onmousemove = function(e) {
        e = e || window.event;
        x = e.clientX;
        y = e.clientY;

        if (x - lg1.canvas.getBoundingClientRect().left > 0 && x - lg1.canvas.getBoundingClientRect().left - lg1.canvas.width < 0 && y - lg1.canvas.getBoundingClientRect().top > 0 && y - lg1.canvas.getBoundingClientRect().top - lg1.canvas.height < 0) {
            gaussian_track.enabled = true;
        } else {
            gaussian_track.enabled = false;
        }

        if (x - lg2.canvas.getBoundingClientRect().left > 0 && x - lg2.canvas.getBoundingClientRect().left - lg2.canvas.width < 0 && y - lg2.canvas.getBoundingClientRect().top > 0 && y - lg2.canvas.getBoundingClientRect().top - lg2.canvas.height < 0) {
            gaussian_track1.enabled = true;
        } else {
            gaussian_track1.enabled = false;
        }
    };

    document.ontouchstart = function(e) {
        e = e || window.event;
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;

        if (x - lg1.canvas.getBoundingClientRect().left > 0 && x - lg1.canvas.getBoundingClientRect().left - lg1.canvas.width < 0 && y - lg1.canvas.getBoundingClientRect().top > 0 && y - lg1.canvas.getBoundingClientRect().top - lg1.canvas.height < 0) {
            gaussian_track.enabled = true;
        } else {
            gaussian_track.enabled = false;
        }

        if (x - lg2.canvas.getBoundingClientRect().left > 0 && x - lg2.canvas.getBoundingClientRect().left - lg2.canvas.width < 0 && y - lg2.canvas.getBoundingClientRect().top > 0 && y - lg2.canvas.getBoundingClientRect().top - lg2.canvas.height < 0) {
            gaussian_track1.enabled = true;
        } else {
            gaussian_track1.enabled = false;
        }
    };


    document.getElementById("generate_lattice_gaussian").addEventListener("click", function() {
        gaussian_scene.remove(lg1.lattice);
        lg1.initObject(gaussian_scene);
    });

}


loop();
loop_anime();
addScript();
initEvent();