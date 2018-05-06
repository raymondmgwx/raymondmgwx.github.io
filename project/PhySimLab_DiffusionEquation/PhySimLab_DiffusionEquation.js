//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////                                                                      //
////  Image-Visual-Lab      //////////   v0.0                                                              //
//////////////////////////////////////                                                                      //
//////////////////////////////////////  Copyright 2018-2019,                                                //
//////////////////////////////////////  Last vist: 05, 05, 2018  by Raymond Wang                             //
//////////////////////////////////////                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////WANG  XU///-->
var L = 100;
var N = 100;
var simType = "WaterAndCopper";
var hts_x = 75;
var hts_y = N / 2;

var cde_scene = new THREE.Scene();
var cde_canvas = document.getElementById('canvas-cde');
var cde_camera = camera = new THREE.OrthographicCamera(-L / 2, L / 2, L / 2, -L / 2, 1, 100);
var cde_track = new THREE.TrackballControls(cde_camera);
var cde_renderer = new THREE.WebGLRenderer({ antialias: true });

var env_tmp = parseFloat(document.getElementById("env_tmp").value);
var hts_tmp = parseFloat(document.getElementById("hts_tmp").value);
var diffusion_equation_1 = new DiffusionEquation(cde_canvas, cde_track, cde_scene, cde_camera, cde_renderer, hts_tmp, env_tmp, hts_x, hts_y, N, L, simType);




function addScript() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "./project/PhySimLab-2d/PhySimLab-theme.js";
    document.getElementsByTagName("head")[0].appendChild(script);
}

function initEvent() {

    document.getElementById("copper_diffusion_anime").addEventListener("click", function() {
        if (diffusion_equation_1.stopFlag) {
            document.getElementById("copper_diffusion_anime").innerText = "Stop";
            diffusion_equation_1.stopFlag = false;
        } else {
            document.getElementById("copper_diffusion_anime").innerText = "Start";
            diffusion_equation_1.stopFlag = true;
        }
    });

    document.getElementById("copper_diffusion_anime_re").addEventListener("click", function() {
        diffusion_equation_1.calculateReadyFlag = false;
        diffusion_equation_1.stopFlag = true;
        diffusion_equation_1.calculateFlag = true;
    });


    document.getElementById("copper_diffusion_point").addEventListener("click", function() {
        document.getElementById("copper_diffusion_anime").innerText = "Start";
        diffusion_equation_1.simType = "PointHeatSource";
        diffusion_equation_1.hts_px = N / 2;
        diffusion_equation_1.initDiffCoeffCopper();
        diffusion_equation_1.calculateReadyFlag = false;
        diffusion_equation_1.stopFlag = true;
        diffusion_equation_1.calculateFlag = true;
    });

    document.getElementById("copper_diffusion_line").addEventListener("click", function() {
        document.getElementById("copper_diffusion_anime").innerText = "Start";
        diffusion_equation_1.simType = "LineHeatSource";
        diffusion_equation_1.initDiffCoeffCopper();
        diffusion_equation_1.calculateReadyFlag = false;
        diffusion_equation_1.stopFlag = true;
        diffusion_equation_1.calculateFlag = true;
    });

    document.getElementById("copper_diffusion_point_water").addEventListener("click", function() {
        document.getElementById("copper_diffusion_anime").innerText = "Start";
        diffusion_equation_1.simType = "WaterAndCopper";
        diffusion_equation_1.hts_px = 75;
        diffusion_equation_1.initDiffCoeff();
        diffusion_equation_1.calculateReadyFlag = false;
        diffusion_equation_1.stopFlag = true;
        diffusion_equation_1.calculateFlag = true;
    });



    loop();
}

function loop() {
    if (diffusion_equation_1.calculateReadyFlag) {
        if (diffusion_equation_1.stopFlag == false || diffusion_equation_1.step == 0 || diffusion_equation_1.changeFlag == true) {
            if (!diffusion_equation_1.stopFlag) {
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

                    //heat source
                    diffusion_equation_1.heatSource();
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
        //console.log("remove");
        cde_scene.remove(diffusion_equation_1.lattice);
        for (var i = 0; i < diffusion_equation_1.cubes.length; i++) {
            cde_scene.remove(diffusion_equation_1.cubes[i]);
        }
        //init Object
        cde_camera.left = -L / 2;
        cde_camera.right = L / 2;
        cde_camera.top = L / 2;
        cde_camera.bottom = -L / 2;
        cde_camera.updateProjectionMatrix();

        var l = L / N;
        diffusion_equation_1.step = 0;

        //reset param
        diffusion_equation_1.env_tmp = parseFloat(document.getElementById("env_tmp").value);
        diffusion_equation_1.hts_tmp = parseFloat(document.getElementById("hts_tmp").value);
        diffusion_equation_1.initCondition();

        var geometry = new THREE.Geometry();
        var colors = new Array();

        for (j = 0; j <= N; j++) {
            for (i = 0; i <= N; i++) {
                var x = (-N / 2 + i) * l;
                var y = (-N / 2 + j) * l;
                var vertex = new THREE.Vector3(x, y, 0);
                geometry.vertices.push(vertex);
                colors.push(new THREE.Color().setRGB(0, 0, 0));
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
        diffusion_equation_1.lattice = new THREE.Mesh(geometry, material);
        cde_scene.add(diffusion_equation_1.lattice);

        if (diffusion_equation_1.simType == "WaterAndCopper") {
            var geometry = new THREE.CubeGeometry(100 * l, 20 * l, 1);

            var material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.2 });
            for (var i = 0; i < 3; i++) {
                diffusion_equation_1.cubes[i] = new THREE.Mesh(geometry, material);
                cde_scene.add(diffusion_equation_1.cubes[i]);
            }
            diffusion_equation_1.cubes[0].position.set(0, 0, 0);
            diffusion_equation_1.cubes[1].position.set(25 * l, 60 * l, 0);
            diffusion_equation_1.cubes[1].rotation.set(0, 0, Math.PI / 2);
            diffusion_equation_1.cubes[2].position.set(25 * l, -60 * l, 0);
            diffusion_equation_1.cubes[2].rotation.set(0, 0, Math.PI / 2);
        }


        diffusion_equation_1.calculateReadyFlag = true;

        diffusion_equation_1.calculateFlag = false;
    }

    cde_renderer.clear();
    cde_renderer.render(cde_scene, cde_camera);
    requestAnimationFrame(loop);
}



addScript();
initEvent();