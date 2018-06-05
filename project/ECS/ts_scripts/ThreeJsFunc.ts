/* =========================================================================
 *
 *  ThreeJsFunc.ts
 *  using three.js library to init 3D scene
 *
 * ========================================================================= */
module ThreeJS {
    declare var THREE: any;
    declare var THREEx: any;

    var camera, scene, renderer;
    var camera2d, scene2d;
    var sphere;
    var rotating;
    var visualizationMesh;
    var selectableTests = [];
    var glContainer = document.getElementById('glContainer');
    var dpr = window.devicePixelRatio ? window.devicePixelRatio : 1;
    var outcomeLookup = {
        'success': 'Success',
        'failure': 'Failure',
        'unknown': 'Unknown'
    };
    var Selection = function(selectedYear, selectedTest) {
        this.selectedYear = selectedYear;
        this.selectedTest = selectedTest;
    
        this.outcomeCategories = new Object();
        for (var i in outcomeLookup) {
            this.outcomeCategories[i] = true;
        }
        this.missileCategories = new Object();
        for (var i in missileLookup) {
            this.missileCategories[i] = true;
        }
    
        this.getOutcomeCategories = function() {
            var list = [];
            for (var i in this.outcomeCategories) {
                if (this.outcomeCategories[i]) {
                    list.push(i);
                }
            }
            return list;
        }
    
        this.getMissileCategories = function() {
            var list = [];
            for (var i in this.missileCategories) {
                if (this.missileCategories[i]) {
                    list.push(i);
                }
            }
            return list;
        }
    };
    export function initThreeJs(mapImage:any,timeBins:any,missileLookup:any,latlonData:any) {

        scene = new THREE.Scene();
        scene.matrixAutoUpdate = false;

        scene2d = new THREE.Scene();
        scene.add(new THREE.AmbientLight(0x505050));

        var light1 = new THREE.SpotLight(0xeeeeee, 3);
        light1.position.x = 730;
        light1.position.y = 520;
        light1.position.z = 626;
        light1.castShadow = true;
        scene.add(light1);

        var light2 = new THREE.PointLight(0x222222, 14.8);
        light2.position.x = -640;
        light2.position.y = -500;
        light2.position.z = -1000;
        scene.add(light2);

        rotating = new THREE.Object3D();
        scene.add(rotating);

        var MapTexture = new THREE.Texture(mapImage);
        MapTexture.needsUpdate = true;

        var mapMaterial = new THREE.MeshBasicMaterial({
            map: MapTexture,
            polygonOffset: true,
            polygonOffsetFactor: 1,
            polygonOffsetUnits: 1
        });


        sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(100, 40, 40), mapMaterial);
        sphere.doubleSided = false;
        sphere.rotation.x = Math.PI;
        sphere.rotation.y = -Math.PI / 2;
        sphere.rotation.z = Math.PI;
        sphere.id = "base";
        rotating.add(sphere);


        //load history data
        for( var i in timeBins ){
            var bin = timeBins[i].data;
            for( var s in bin ){
                var set = bin[s];
    
                var seriesPostfix = set.series ? ' [' + set.series + ']' : '';
                var testName = (set.date + ' ' + missileLookup[set.missile].name + seriesPostfix).toUpperCase();
    
                selectableTests.push( testName );
            }
        }


        var wireframeGeo = new THREE.EdgesGeometry(sphere.geometry, 0.3);
        var wireframeMaterial = new THREE.LineBasicMaterial({
            color: Math.random() * 0xffffff,
            linewidth: 0.5
        });
        var wireframe = new THREE.LineSegments(wireframeGeo, wireframeMaterial);
        sphere.add(wireframe);

        var atmosphereMaterial = new THREE.ShaderMaterial({
            vertexShader: document.getElementById('vertexShaderAtmosphere').textContent,
            fragmentShader: document.getElementById('fragmentShaderAtmosphere').textContent,
            // atmosphere should provide light from behind the sphere, so only render the back side
            side: THREE.BackSide
        });

        var atmosphere = new THREE.Mesh(sphere.geometry.clone(), atmosphereMaterial);
        atmosphere.scale.x = atmosphere.scale.y = atmosphere.scale.z = 1.8;
        rotating.add(atmosphere);


        //country coordinates
        Utils.loadGeoData(latlonData);
        
        //data visual
        var vizilines = Utils.buildDataVizGeometries(timeBins);
    
        visualizationMesh = new THREE.Object3D();
        rotating.add(visualizationMesh);
    
        var latestBin = timeBins[timeBins.length - 1];
        var selectedYear = latestBin.year;
    
        var latestTest = latestBin.data[latestBin.data.length - 1];
        var selectedTestName = latestTest.testName;
    
        selectionData = new Selection(selectedYear, selectedTestName);
    
        Utils.selectVisualization(vizilines,timeBins, selectedYear, [selectedTestName], Object.keys(outcomeLookup), Object.keys(missileLookup));
    



        //	-----------------------------------------------------------------------------
        //	Setup our renderer
        renderer = new THREE.WebGLRenderer({ antialias: false });
        renderer.setPixelRatio(dpr);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.autoClear = false;

        renderer.sortObjects = false;
        renderer.generateMipmaps = false;

        glContainer.appendChild(renderer.domElement);


        // Detect passive event support
        var passive = false;
        var options = Object.defineProperty({}, 'passive', {
            get: function () {
                passive = true;
            }
        });



        //	-----------------------------------------------------------------------------
        //	Setup our camera
        var aspect = window.innerWidth / window.innerHeight;
        camera = new THREE.PerspectiveCamera(12 / Math.min(aspect, 1), aspect, 1, 20000);
        camera.position.z = 400;
        camera.position.y = 0;
        camera.lookAt(scene.position);
        camera.zoom = 0.5;
        scene.add(camera);

        camera2d = new THREE.OrthographicCamera(0, window.innerWidth, 0, window.innerHeight, 1, 20000);
        camera2d.position.z = 400;
        camera2d.position.y = 0;
        camera.lookAt(scene2d.position);

        var windowResize = THREEx.WindowResize(renderer, camera, camera2d);
    }

    function render() {
        renderer.clear();
        renderer.render(scene, camera);
    }
    
    function render2d() {
        renderer.render(scene2d, camera2d);
    }
    
    export function animate() {
        render();
    
        requestAnimationFrame(animate);
    
        render2d();
    }
}