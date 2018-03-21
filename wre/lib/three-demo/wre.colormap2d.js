//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////                                                                      //
////  Image-Process-Lab      //////////   v0.0                                                              //
//////////////////////////////////////                                                                      //
//////////////////////////////////////  Copyright 2017-2018,                                                //
//////////////////////////////////////  Last vist: 03, 16, 2018  by Raymond Wang                            //
//////////////////////////////////////                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////WANG  XU///-->




var ColorMap_2D = function(canvasElement, trackball, scene, camera, renderer, color_type) {
    this.canvasElement = canvasElement;
    this.step = 0;
    this.initScene(renderer);
    this.initCamera(trackball, camera);
    this.initLight(scene);
    this.initObject(scene, color_type);
};

ColorMap_2D.prototype = {
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
        directionalLight.position.set(-30, -30, 100);

        var ambientLight = new THREE.AmbientLight(0x222222);
        scene.add(ambientLight);
        scene.add(directionalLight);
    },
    initObject: function(scene, type) {


        switch (type) {
            case "rgb":
                var geometry = new THREE.Geometry();
                geometry.vertices[0] = new THREE.Vector3(-50, -50, 0);
                geometry.vertices[1] = new THREE.Vector3(50, -50, 0);
                geometry.vertices[2] = new THREE.Vector3(50, 50, 0);
                geometry.vertices[3] = new THREE.Vector3(-50, 50, 0);

                var colors1 = new Array();
                colors1[0] = new THREE.Color(0xffffff);
                colors1[1] = new THREE.Color(0xff0000);
                colors1[2] = new THREE.Color(0x0000ff);

                var colors2 = new Array();
                colors2[0] = new THREE.Color(0x0000ff);
                colors2[1] = new THREE.Color(0xff0000);
                colors2[2] = new THREE.Color(0x00ff00);

                geometry.faces.push(new THREE.Face3(0, 1, 3, null, colors1));
                geometry.faces.push(new THREE.Face3(3, 1, 2, null, colors2));

                var material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, vertexColors: THREE.VertexColors });
                this.lattice = new THREE.Mesh(geometry, material);
                scene.add(this.lattice);
                break;
            case "hsl":
                var geometry = new THREE.Geometry();
                var colors = new Array();
                var N = 100;
                var l = 1;
                for (var j = 0; j <= N; j++) {
                    for (var i = 0; i <= N; i++) {
                        var x = (-N / 2 + i) * l;
                        var y = (-N / 2 + j) * l;
                        var vertex = new THREE.Vector3(x, y, 0);
                        geometry.vertices.push(vertex);
                        var H = i / N;
                        var S = 1;
                        var L = j / N;
                        colors.push(new THREE.Color().setHSL(H, S, L));
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
                break;
            case "gaussian":
                var geometry = new THREE.Geometry();
                var colors = new Array();
                var x_ = 0;
                var y_ = 0;
                var sigma = 300;
                var z_ = 50;
                var N = 100;
                var l = 1;
                for (var j = 0; j <= N; j++) {
                    for (var i = 0; i <= N; i++) {
                        var x = (-N / 2 + i) * l;
                        var y = (-N / 2 + j) * l;
                        var vertex = new THREE.Vector3(x, y, 0);
                        geometry.vertices.push(vertex);
                        var z = z_ * Math.exp(-((x - x_) * (x - x_) + (y - y_) * (y - y_)) / (2 * sigma));
                        colors.push(new THREE.Color().setRGB(z / z_, 0, 0));
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
                break;
            case "gaussian_worker":
                console.log("webworker-external init object!");
                break;
        }
    }
};