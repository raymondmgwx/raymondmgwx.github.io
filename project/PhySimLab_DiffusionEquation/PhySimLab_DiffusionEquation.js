//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////                                                                      //
////  Image-Visual-Lab      //////////   v0.0                                                              //
//////////////////////////////////////                                                                      //
//////////////////////////////////////  Copyright 2018-2019,                                                //
//////////////////////////////////////  Last vist: 05, 05, 2018  by Raymond Wang                             //
//////////////////////////////////////                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////WANG  XU///-->
var L = 100;
var cde_scene = new THREE.Scene();
var cde_canvas = document.getElementById('canvas-cde');
var cde_camera = camera = new THREE.OrthographicCamera(-L / 2, L / 2, L / 2, -L / 2, 1, 100);
var cde_track = new THREE.TrackballControls(cde_camera);
var cde_renderer = new THREE.WebGLRenderer({ antialias: true });


var diffusion_equation_1 = new DiffusionEquation(cde_canvas, cde_track, cde_scene, cde_camera, cde_renderer);




function addScript() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "./project/PhySimLab-2d/PhySimLab-theme.js";
    document.getElementsByTagName("head")[0].appendChild(script);
}

function initEvent() {

    document.getElementById("copper_diffusion_anime").addEventListener("click", function() {
        //console.log(diffusion_equation_1.stopFlag);
        if (diffusion_equation_1.stopFlag) {
            diffusion_equation_1.stopFlag = false;
        } else {
            diffusion_equation_1.stopFlag = true;
        }
    });


    loop();
}

function loop() {
    //console.log("run");
    if (diffusion_equation_1.calculateReadyFlag) {
        //console.log("run");
        if (diffusion_equation_1.stopFlag == false || diffusion_equation_1.step == 0 || diffusion_equation_1.changeFlag == true) {
            if (!diffusion_equation_1.stopFlag) {
                //console.log("run");
                for (var k = 0; k < diffusion_equation_1.skip; k++) {
                    diffusion_equation_1.step++;
                    for (var i = 1; i <= diffusion_equation_1.N - 1; i++) {
                        for (var j = 1; j <= diffusion_equation_1.N - 1; j++) {
                            diffusion_equation_1.T[1][i][j] = diffusion_equation_1.T[0][i][j] + 2 * diffusion_equation_1.dt / (diffusion_equation_1.dx * diffusion_equation_1.dx) * (
                                (diffusion_equation_1.D[i + 1][j] - diffusion_equation_1.D[i - 1][j]) * (diffusion_equation_1.T[0][i + 1][j] - diffusion_equation_1.T[0][i - 1][j]) / 4 +
                                (diffusion_equation_1.D[i][j + 1] - diffusion_equation_1.D[i][j - 1]) * (diffusion_equation_1.T[0][i][j + 1] - diffusion_equation_1.T[0][i][j - 1]) / 4 +
                                diffusion_equation_1.D[i][j] * (diffusion_equation_1.T[0][i + 1][j] + diffusion_equation_1.T[0][i - 1][j] - 2 * diffusion_equation_1.T[0][i][j] + diffusion_equation_1.T[0][i][j + 1] + diffusion_equation_1.T[0][i][j - 1] - 2 * diffusion_equation_1.T[0][i][j]));

                        }
                    }
                    if (diffusion_equation_1.BC == "Dirichlet") {


                        for (var i = 0; i <= diffusion_equation_1.N; i++) {
                            diffusion_equation_1.T[1][i][0] = 0;
                            diffusion_equation_1.T[1][i][diffusion_equation_1.N] = 0;
                            diffusion_equation_1.T[1][0][i] = 0;
                            diffusion_equation_1.T[1][diffusion_equation_1.N][i] = 0;
                        }

                    } else if (diffusion_equation_1.BC == "Neumann") {
                        for (var i = 0; i <= diffusion_equation_1.N; i++) {
                            diffusion_equation_1.T[1][i][0] = diffusion_equation_1.T[1][i][1];
                            diffusion_equation_1.T[1][i][diffusion_equation_1.N] = diffusion_equation_1.T[1][i][diffusion_equation_1.N - 1];
                            diffusion_equation_1.T[1][0][i] = diffusion_equation_1.T[1][1][i];
                            diffusion_equation_1.T[1][diffusion_equation_1.N][i] = diffusion_equation_1.T[1][diffusion_equation_1.N - 1][i];
                        }
                    } else if (diffusion_equation_1.BC == "Periodic") {

                        for (var i = 0; i <= diffusion_equation_1.N; i++) {

                            diffusion_equation_1.T[1][i][0] = diffusion_equation_1.T[0][i][0] + diffusion_equation_1.dt / (diffusion_equation_1.dx * diffusion_equation_1.dx) * ((diffusion_equation_1.D[i][1] - diffusion_equation_1.D[i][diffusion_equation_1.N]) * (diffusion_equation_1.T[0][i][1] - diffusion_equation_1.T[0][i][diffusion_equation_1.N]) / 4 + diffusion_equation_1.D[i][0] * (diffusion_equation_1.T[0][i][1] + diffusion_equation_1.T[0][i][diffusion_equation_1.N] - 2 * diffusion_equation_1.T[0][i][0]));
                            diffusion_equation_1.T[1][i][diffusion_equation_1.N] = diffusion_equation_1.T[0][i][diffusion_equation_1.N] + diffusion_equation_1.dt / (diffusion_equation_1.dx * diffusion_equation_1.dx) * ((diffusion_equation_1.D[i][0] - diffusion_equation_1.D[i][diffusion_equation_1.N - 1]) * (diffusion_equation_1.T[0][i][0] - diffusion_equation_1.T[0][i][diffusion_equation_1.N - 1]) / 4 + diffusion_equation_1.D[i][diffusion_equation_1.N] * (diffusion_equation_1.T[0][i][0] + diffusion_equation_1.T[0][i][diffusion_equation_1.N - 1] - 2 * diffusion_equation_1.T[0][i][diffusion_equation_1.N]));
                            diffusion_equation_1.T[1][0][i] = diffusion_equation_1.T[0][0][i] + diffusion_equation_1.dt / (diffusion_equation_1.dx * diffusion_equation_1.dx) * ((diffusion_equation_1.D[1][i] - diffusion_equation_1.D[diffusion_equation_1.N][i]) * (diffusion_equation_1.T[0][1][i] - diffusion_equation_1.T[0][diffusion_equation_1.N][i]) / 4 + diffusion_equation_1.D[0][i] * (diffusion_equation_1.T[0][1][i] + diffusion_equation_1.T[0][diffusion_equation_1.N][i] - 2 * diffusion_equation_1.T[0][0][i]));
                            diffusion_equation_1.T[1][diffusion_equation_1.N][i] = diffusion_equation_1.T[0][diffusion_equation_1.N][i] + diffusion_equation_1.dt / (diffusion_equation_1.dx * diffusion_equation_1.dx) * ((diffusion_equation_1.D[0][i] - diffusion_equation_1.D[diffusion_equation_1.N - 1][i]) * (diffusion_equation_1.T[0][0][i] - diffusion_equation_1.T[0][diffusion_equation_1.N - 1][i]) / 4 + diffusion_equation_1.D[diffusion_equation_1.N][i] * (diffusion_equation_1.T[0][0][i] + diffusion_equation_1.T[0][diffusion_equation_1.N - 1][i] - 2 * diffusion_equation_1.T[0][diffusion_equation_1.N][i]));
                        }
                    }

                    for (var i = 0; i <= diffusion_equation_1.N; i++) {
                        for (var j = 0; j <= diffusion_equation_1.N; j++) {
                            diffusion_equation_1.T[0][i][j] = diffusion_equation_1.T[1][i][j];
                        }
                    }
                    //console.log(diffusion_equation_1.T[0][diffusion_equation_1.N / 5][diffusion_equation_1.N / 2]);
                    //heat source
                    diffusion_equation_1.T[0][diffusion_equation_1.N / 5][diffusion_equation_1.N / 2] = 100;
                }
            }
            var a = 0;
            for (j = 0; j < diffusion_equation_1.N; j++) {
                for (i = 0; i < diffusion_equation_1.N; i++) {
                    var x = (-diffusion_equation_1.N / 2 + i) * diffusion_equation_1.l;
                    var y = (-diffusion_equation_1.N / 2 + j) * diffusion_equation_1.l;

                    var TT;
                    if (diffusion_equation_1.T[0][i][j] < diffusion_equation_1.Tmin) TT = 0;
                    else if (diffusion_equation_1.T[0][i][j] > diffusion_equation_1.Tmax) TT = diffusion_equation_1.Tmax - diffusion_equation_1.Tmin;
                    else TT = diffusion_equation_1.T[0][i][j] - diffusion_equation_1.Tmin;
                    var H = (0.92 - TT / (diffusion_equation_1.Tmax - diffusion_equation_1.Tmin)) / 1.4;
                    diffusion_equation_1.lattice.geometry.faces[a].vertexColors[0].copy(new THREE.Color().setHSL(H, 1, 0.5));

                    if (diffusion_equation_1.T[0][i + 1][j] < diffusion_equation_1.Tmin) TT = 0;
                    else if (diffusion_equation_1.T[0][i + 1][j] > diffusion_equation_1.Tmax) TT = diffusion_equation_1.Tmax - diffusion_equation_1.Tmin;
                    else TT = diffusion_equation_1.T[0][i + 1][j] - diffusion_equation_1.Tmin;
                    var H = (0.92 - TT / (diffusion_equation_1.Tmax - diffusion_equation_1.Tmin)) / 1.4;
                    diffusion_equation_1.lattice.geometry.faces[a].vertexColors[1].copy(new THREE.Color().setHSL(H, 1, 0.5));
                    diffusion_equation_1.lattice.geometry.faces[a + 1].vertexColors[1].copy(new THREE.Color().setHSL(H, 1, 0.5));

                    if (diffusion_equation_1.T[0][i + 1][j + 1] < diffusion_equation_1.Tmin) TT = 0;
                    else if (diffusion_equation_1.T[0][i + 1][j + 1] > diffusion_equation_1.Tmax) TT = diffusion_equation_1.Tmax - diffusion_equation_1.Tmin;
                    else TT = diffusion_equation_1.T[0][i + 1][j + 1] - diffusion_equation_1.Tmin;
                    var H = (0.92 - TT / (diffusion_equation_1.Tmax - diffusion_equation_1.Tmin)) / 1.4;
                    diffusion_equation_1.lattice.geometry.faces[a + 1].vertexColors[2].copy(new THREE.Color().setHSL(H, 1, 0.5));

                    if (diffusion_equation_1.T[0][i][j + 1] < diffusion_equation_1.Tmin) TT = 0;
                    else if (diffusion_equation_1.T[0][i][j + 1] > diffusion_equation_1.Tmax) TT = diffusion_equation_1.Tmax - diffusion_equation_1.Tmin;
                    else TT = diffusion_equation_1.T[0][i][j + 1] - diffusion_equation_1.Tmin;
                    var H = (0.92 - TT / (diffusion_equation_1.Tmax - diffusion_equation_1.Tmin)) / 1.4;
                    diffusion_equation_1.lattice.geometry.faces[a].vertexColors[2].copy(new THREE.Color().setHSL(H, 1, 0.5));
                    diffusion_equation_1.lattice.geometry.faces[a + 1].vertexColors[0].copy(new THREE.Color().setHSL(H, 1, 0.5));

                    a += 2;
                }
            }
            diffusion_equation_1.lattice.geometry.colorsNeedUpdate = true;
            diffusion_equation_1.changeFlag = false;
        } else {

            diffusion_equation_1.lattice.geometry.verticesNeedUpdate = false;
            diffusion_equation_1.lattice.geometry.normalsNeedUpdate = false;
        }
    } else if (diffusion_equation_1.calculateFlag) {
        console.log("remove");
        cde_scene.remove(diffusion_equation_1.lattice);
        for (var i = 0; i < diffusion_equation_1.cubes.length; i++) {
            cde_scene.remove(diffusion_equation_1.diffusion_equation_1.cubes[i]);
        }
        diffusion_equation_1.initObject();
        diffusion_equation_1.calculateFlag = false;
    }

    cde_renderer.clear();
    cde_renderer.render(cde_scene, cde_camera);
    requestAnimationFrame(loop);
}



addScript();
initEvent();