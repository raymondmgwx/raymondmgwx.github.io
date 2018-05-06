//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////                                                                      //
////  Image-Process-Lab      //////////   v0.0                                                              //
//////////////////////////////////////                                                                      //
//////////////////////////////////////  Copyright 2018-2019,                                                //
//////////////////////////////////////  Last vist: 05, 05, 2018  by Raymond Wang                            //
//////////////////////////////////////                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////WANG  XU///-->

//2d grid param
var N = 100;
var L = 100;
var l = L / N;
var step = 0;

var dt = 0.1;
var dx = 0.01;
var skip = 100;


var Tmax = 100;
var Tmin = 0;

var d_Ca = 112E-6;
var d_H2O = 0.14E-6;

var y0 = 0;
var x0 = N / 4 * dx;
var w = 0.1;

var tn = 2;

var DiffusionEquation = function(canvasElement, trackball, scene, camera, renderer, hts_tmp, env_tmp, hts_px, hts_py, p_N, p_L, simType) {
    this.hts_tmp = hts_tmp;
    this.env_tmp = env_tmp;
    this.hts_px = hts_px;
    this.hts_py = hts_py;
    this.simType = simType;

    this.step = step;


    N = p_N;
    L = p_L;
    l = L / N;
    this.N = N;
    this.L = L;

    this.dt = dt;
    this.dx = dx;
    this.skip = skip;

    this.Tmax = Tmax;
    this.Tmin = Tmin;
    this.d_Ca = d_Ca;
    this.d_H2O = d_H2O;
    this.y0 = y0;
    this.x0 = x0;
    this.w = w;
    this.tn = tn;

    this.stopFlag = true;
    this.calculateReadyFlag = false;
    this.calculateFlag = false;
    this.changeFlag = false;
    this.BC = "Neumann";
    this.D = [];
    this.cubes = []
    this.T = new Array(tn);

    if (simType == "WaterAndCopper") {
        this.initDiffCoeff();
    } else if (simType == "PointHeatSource" || "LineHeatSource") {
        this.initDiffCoeffCopper();
    }


    this.canvasElement = canvasElement;
    this.initScene(renderer);
    this.initCamera(trackball, camera);
    this.initLight(scene);
    this.initObject(scene, camera);
};

DiffusionEquation.prototype = {
    initScene: function(renderer) {
        var canvasFrame = this.canvasElement;

        if (!renderer) alert('Three.js init failed!');
        renderer.setSize(canvasFrame.clientWidth, canvasFrame.clientHeight);


        this.canvas = renderer.domElement;
        canvasFrame.appendChild(this.canvas);
    },
    initCamera: function(trackball, camera) {

        var canvasFrame = this.canvasElement;
        camera.position.set(0, 0, 50);
        camera.up.set(0, 1, 0);
        camera.lookAt({ x: 0, y: 0, z: 0 });

        //dont use trackball
        trackball.enabled = false;
        trackball.screen.width = canvasFrame.clientWidth;
        trackball.screen.height = canvasFrame.clientHeight;
        trackball.screen.offsetLeft = canvasFrame.getBoundingClientRect().left;
        trackball.screen.offsetTop = canvasFrame.getBoundingClientRect().top;

        trackball.noRotate = false;
        trackball.rotateSpeed = 2.0;

        trackball.noZoom = false;
        trackball.zoomSpeed = 1.0;

        trackball.noPan = false;
        trackball.panSpeed = 1.0;
        trackball.target = new THREE.Vector3(0, 0, 10);

        trackball.staticMoving = true;
        trackball.dynamicDampingFactor = 0.3;
    },
    initLight: function(scene) {

        var directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1.0, 0);
        directionalLight.position.set(30, 30, 100);

        var ambientLight = new THREE.AmbientLight(0x222222);
        scene.add(ambientLight);
        scene.add(directionalLight);
    },
    initObject: function(scene, camera) {

        //camera reset
        camera.left = -L / 2;
        camera.right = L / 2;
        camera.top = L / 2;
        camera.bottom = -L / 2;
        camera.updateProjectionMatrix();

        l = L / N;
        this.step = 0;
        this.initCondition();

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
        this.lattice = new THREE.Mesh(geometry, material);
        scene.add(this.lattice);

        if (this.simType == "WaterAndCopper") {
            var geometry = new THREE.CubeGeometry(100 * l, 20 * l, 1);

            var material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.2 });
            for (var i = 0; i < 3; i++) {
                this.cubes[i] = new THREE.Mesh(geometry, material);
                scene.add(this.cubes[i]);
            }
            this.cubes[0].position.set(0, 0, 0);
            this.cubes[1].position.set(25 * l, 60 * l, 0);
            this.cubes[1].rotation.set(0, 0, Math.PI / 2);
            this.cubes[2].position.set(25 * l, -60 * l, 0);
            this.cubes[2].rotation.set(0, 0, Math.PI / 2);
        } else if (this.simType == "Copper") {

        }


        this.calculateReadyFlag = true;
    },
    initDiffCoeff: function() {
        //fermi data init
        for (var i = 0; i <= N; i++) {
            var x = (i - N / 2) * dx;
            this.D[i] = [];
            for (var j = 0; j <= N; j++) {
                var y = (j - N / 2) * dx;
                var g = (y > y0) ? (y - (y0 + w / 2)) / 0.01 : -(y - (y0 - w / 2)) / 0.01;
                this.D[i][j] = d_Ca / (1 + Math.exp(g)) + d_H2O;
            }
            for (var j = 0; j <= N; j++) {
                var y = (j - N / 2) * dx;
                var g = (x > x0) ? (x - (x0 + w / 2)) / 0.01 : -(x - (x0 - w / 2)) / 0.01;
                this.D[i][j] += d_Ca / (1 + Math.exp(g)) + d_H2O;
                if (this.D[i][j] > d_Ca) this.D[i][j] = d_Ca;
            }
        }
    },
    initDiffCoeffCopper: function() {
        for (var i = 0; i <= N; i++) {
            this.D[i] = [];
            for (var j = 0; j <= N; j++) {
                this.D[i][j] = d_Ca;
            }
        }
    },
    heatSource: function() {
        if (this.simType != "LineHeatSource") {
            this.T[0][this.hts_px][this.hts_py] = this.hts_tmp;
            //console.log(this.hts_px);
        } else {
            for (var i = 0; i <= N; i++) {
                this.T[0][i][N / 2] = this.hts_tmp;
            }
        }
    },
    initCondition: function() {
        for (var t = 0; t < tn; t++) {
            this.T[t] = new Array(N);
            for (i = 0; i <= N; i++) {
                this.T[t][i] = new Array(N);
                for (j = 0; j <= N; j++) {
                    this.T[t][i][j] = this.env_tmp;
                }
            }
        }
        //heat source
        this.heatSource();
    }
};