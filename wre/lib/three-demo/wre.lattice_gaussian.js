//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////                                                                      //
////  Image-Process-Lab      //////////   v0.0                                                              //
//////////////////////////////////////                                                                      //
//////////////////////////////////////  Copyright 2017-2018,                                                //
//////////////////////////////////////  Last vist: 01, 08, 2018  by Raymond Wang                            //
//////////////////////////////////////                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////WANG  XU///-->




var Lattice_Gaussian = function(canvasElement, trackball, scene, camera, renderer) {
    this.canvasElement = canvasElement;
    this.initScene(renderer);
    this.initCamera(trackball, camera);
    this.initLight(scene);
    this.initObject(scene);
};

Lattice_Gaussian.prototype = {
    initScene: function(renderer) {
        var canvasFrame = this.canvasElement;

        if (!renderer) alert('Three.js init failed!');
        renderer.setSize(canvasFrame.clientWidth, canvasFrame.clientHeight);

        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;
        this.canvas = renderer.domElement;
        canvasFrame.appendChild(this.canvas);
        renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
    },
    initCamera: function(trackball, camera) {

        var canvasFrame = this.canvasElement;
        camera.position.set(60, 60, 80);
        camera.up.set(0, 0, 1);
        camera.lookAt({ x: 0, y: 0, z: 0 });

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
    initObject: function(scene) {

        var axis = new THREE.AxisHelper(100);
        scene.add(axis);
        axis.position.set(0, 0, 0);

        var x_ = document.getElementById("center_x").value;
        var y_ = document.getElementById("center_y").value;
        var sigma2 = document.getElementById("sigma2").value;
        var z0 = document.getElementById("z0").value;

        var geometry = new THREE.Geometry();

        var N = parseInt(document.getElementById("lattice_number").value);
        var l = parseInt(document.getElementById("lattice_length").value);

        for (j = 0; j <= N; j++) {
            for (i = 0; i <= N; i++) {

                var x = (-N / 2 + i) * l;
                var y = (-N / 2 + j) * l;

                var z = z0 * Math.exp(-((x - x_) * (x - x_) + (y - y_) * (y - y_)) / (2 * sigma2));
                var vertex = new THREE.Vector3(x, y, z);
                geometry.vertices.push(vertex);
            }
        }
        for (j = 0; j < N; j++) {
            for (i = 0; i < N; i++) {
                var face_part1 = new THREE.Face3((N + 1) * j + i,
                    (N + 1) * j + i + 1,
                    (N + 1) * (j + 1) + i + 1);
                var face_part2 = new THREE.Face3((N + 1) * j + i,
                    (N + 1) * (j + 1) + i + 1,
                    (N + 1) * (j + 1) + i);
                geometry.faces.push(face_part1);
                geometry.faces.push(face_part2);
            }
        }

        geometry.computeFaceNormals();
        geometry.computeVertexNormals();
        var material = new THREE.MeshPhongMaterial({ color: 0xFF0000, side: THREE.DoubleSide, specular: 0xffffff, shininess: 250 });
        this.lattice = new THREE.Mesh(geometry, material);
        scene.add(this.lattice);
    }
};