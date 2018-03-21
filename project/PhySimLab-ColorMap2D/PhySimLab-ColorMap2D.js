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
var gaussianColorMap = new ColorMap_2D(gaussian_canvas, gaussian_track, gaussian_scene, gaussian_camera, gaussian_renderer, "gaussian_worker");
var gaussian_lattice = gaussianColorMap.lattice;

var currentStep = 0;
var Period = 100;
var omega = 2 * Math.PI / Period;
var R = 20;
var sigma = 300;
var z0 = 50;
var N = 100;
var l = 1;

var stopFlag = true;
var changePeriodFlag = true;


var workerNum = 12;
var calculateReadyFlag = false;

var pngData;
var pngName;
$("#colormap_anime_slider").slider({ tooltip: 'always' });
var f = new Array(Period);
for (var step = 0; step < Period; step++) {
    f[step] = new Array(N + 1);
    for (var i = 0; i <= N; i++) {
        f[step][i] = new Array(N + 1);
    }
}

//webworker cal gaussian colormap
var lattice;
var wwstep = 0;

function initWebWorkerObject() {
    var endWorkerNum = 0;
    var workerNumber = 12;
    var workers = [];
    var currentLattice = new THREE.Mesh();
    for (var wn = 0; wn < workerNumber; wn++) {
        wwstep = wn;
        workers[wn] = new Worker("./project/PhySimLab-ColorMap2D/webworker_Gaussian.js");
        var parameter = { currentStep: wwstep, period: Period, sigma: sigma, z0: z0, N: N, R: R, l: l };
        workers[wn].postMessage(parameter);
        //current worker calculate finished
        workers[wn].onmessage = function(event) {
            var result = event.data;
            var tn = result.currentStep;
            var data = result.data;
            f[tn] = data;

            //calculate the next step
            wwstep++;

            if (wwstep <= Period) {
                //show progress ui
                var percentValue = wwstep / Period * 100;
                $('#colormap_progress_bar').css('width', percentValue + '%').attr('aria-valuenow', percentValue);
                $('#colormap_progress_bar').find('span').html(percentValue);
                var parameter = { currentStep: wwstep, period: Period, sigma: sigma, z0: z0, N: N, R: R, l: l };
                this.postMessage(parameter);
            } else {
                this.terminate();
                endWorkerNum++;
                if (endWorkerNum == workerNum) {
                    var geometry = new THREE.Geometry();
                    var colors = new Array();
                    for (var j = 0; j <= N; j++) {
                        for (var i = 0; i <= N; i++) {
                            var x = (-N / 2 + i) * l;
                            var y = (-N / 2 + j) * l;
                            var vertex = new THREE.Vector3(x, y, 0);
                            geometry.vertices.push(vertex);
                            colors.push(new THREE.Color().setRGB(f[0][i][j] / z0, 0, 0));
                        }
                    }

                    for (var j = 0; j < N; j++) {
                        for (var i = 0; i < N; i++) {
                            var color1 = [];
                            var color2 = [];
                            color1[0] = colors[(N + 1) * j + i];
                            color1[1] = colors[(N + 1) * j + i + 1];
                            color1[2] = colors[(N + 1) * (j + 1) + i];

                            color2[0] = colors[(N + 1) * (j + 1) + i];
                            color2[1] = colors[(N + 1) * j + i + 1];
                            color2[2] = colors[(N + 1) * (j + 1) + i + 1];

                            geometry.faces.push(new THREE.Face3((N + 1) * j + i, (N + 1) * j + i + 1, (N + 1) * (j + 1) + i, null, color1));
                            geometry.faces.push(new THREE.Face3((N + 1) * (j + 1) + i, (N + 1) * j + i + 1, (N + 1) * (j + 1) + i + 1, null, color2));
                        }
                    }
                    var material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, vertexColors: THREE.VertexColors });
                    lattice = new THREE.Mesh(geometry, material);
                    gaussian_scene.add(lattice);

                    calculateReadyFlag = true;
                    changePeriodFlag = true;
                }
            }
        }
    }
}







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

    if (calculateReadyFlag) {
        if (stopFlag == false || changePeriodFlag) {
            if (!stopFlag) currentStep++;
            var colors = new Array();
            for (var j = 0; j <= N; j++) {
                for (var i = 0; i <= N; i++) {
                    var x = (-N / 2 + i) * l;
                    var y = (-N / 2 + j) * l;
                    colors.push(new THREE.Color().setRGB(f[currentStep % Period][i][j] / z0, 0, 0));
                }
            }
            var n = 0;
            for (var j = 0; j < N; j++) {
                for (var i = 0; i < N; i++) {
                    lattice.geometry.faces[n].vertexColors[0].copy(colors[(N + 1) * j + i]);
                    lattice.geometry.faces[n].vertexColors[1].copy(colors[(N + 1) * j + i + 1]);
                    lattice.geometry.faces[n].vertexColors[2].copy(colors[(N + 1) * (j + 1) + i]);

                    lattice.geometry.faces[n + 1].vertexColors[0].copy(colors[(N + 1) * (j + 1) + i]);
                    lattice.geometry.faces[n + 1].vertexColors[1].copy(colors[(N + 1) * j + i + 1]);
                    lattice.geometry.faces[n + 1].vertexColors[2].copy(colors[(N + 1) * (j + 1) + i + 1]);

                    n += 2;
                }
            }
            lattice.geometry.colorsNeedUpdate = true;
            $("#colormap_anime_slider").slider('setValue', currentStep % Period);
            changePeriodFlag = false;
        } else {
            lattice.geometry.colorsNeedUpdate = false;
        }
    }


    gaussian_renderer.clear();
    gaussian_renderer.render(gaussian_scene, gaussian_camera);


    if (stopFlag) {
        document.getElementById("colormap_gaussian_anime").innerText = "Start";

        pngData = gaussian_renderer.domElement.toDataURL("image/png");
        pngName = "png_" + currentStep % Period + ".png";
    } else {
        document.getElementById("colormap_gaussian_anime").innerText = "Stop";
    }

    requestAnimationFrame(loop2);
}

function addScript() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "./project/PhySimLab-2d/PhySimLab-theme.js";
    document.getElementsByTagName("head")[0].appendChild(script);
}

function initEvent() {
    document.getElementById("colormap_gaussian_anime").addEventListener("click", function() {
        if (stopFlag) {
            stopFlag = false;
        } else {
            stopFlag = true;
        }
    });

    document.getElementById("colormap_gaussian_anime_webworker_calculate").addEventListener("click", function() {
        if (!calculateReadyFlag) {
            initWebWorkerObject();
        }
    });

    document.getElementById("colormap_gaussian_anime_export").addEventListener("click", function() {
        document.getElementById("colormap_gaussian_anime_export").href = pngData;
        document.getElementById("colormap_gaussian_anime_export").download = pngName;
    });

    $("#colormap_anime_slider").on("slide", function(slideEvt) {
        currentStep = slideEvt.value;
        stopFlag = true;
        changePeriodFlag = true;
    });

}


loop();
loop1();
loop2();
addScript();
initEvent();