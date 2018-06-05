/* =========================================================================
 *
 *  ThreeJsFunc.ts
 *  using three.js library to init 3D scene
 *
 * ========================================================================= */
/// <reference path="./EventListener.ts" />
/// <reference path="./LoadData.ts" />
module ThreeJS {
    declare var THREE: any;
    declare var THREEx: any;
    declare var $: any;

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
    var selectionData;
    var Selection = function (selectedYear: any, selectedTest: any, missileLookup: any) {
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

        this.getOutcomeCategories = function () {
            var list = [];
            for (var i in this.outcomeCategories) {
                if (this.outcomeCategories[i]) {
                    list.push(i);
                }
            }
            return list;
        }

        this.getMissileCategories = function () {
            var list = [];
            for (var i in this.missileCategories) {
                if (this.missileCategories[i]) {
                    list.push(i);
                }
            }
            return list;
        }
    };


    export function getCamera() {
        return camera;
    }

    var missileColors = {
        'er-scud': 0x1A62A5,
        'hwasong-12': 0x6C6C6C,
        'hwasong-14': 0xAEB21A,
        'hwasong-15': 0x1DB2C4,
        'kn-02': 0xB68982,
        'musudan': 0x9FBAE3,
        'nodong': 0xFD690F,
        'polaris-1': 0xFEAE65,
        'polaris-2': 0xDA5CB6,
        'scud-b': 0x279221,
        'scud-b-marv': 0xD2D479,
        'scud-c': 0x89DC78,
        'scud-c-marv': 0xBBBBBB,
        'taepodong-1': 0xCA0F1E,
        'unha': 0x814EAF,
        'unha-3': 0xB89FCB,
        'unknown': 0x78433B
    };
    var summary;
    function getVisualizedMesh(linearData, year, outcomeCategories, missileCategories) {
        //	pick out the year first from the data
        var indexFromYear = Utils.getYearIndexlookUp()[year];

        var affectedTest = [];

        var bin = linearData[indexFromYear].data;

        var linesGeo = new THREE.Geometry();
        var lineColors = [];

        var particlesGeo = new THREE.BufferGeometry();
        var particlePositions = [];
        var particleSizes = [];
        var particleColors = [];

        particlesGeo.vertices = [];

        //	go through the data from year, and find all relevant geometries
        for (let i of bin) {
            var set = i;
            
            var relevantOutcomeCategory = $.inArray(set.outcome, outcomeCategories) >= 0;
            var relevantMissileCategory = $.inArray(set.missile, missileCategories) >= 0;

            if (relevantOutcomeCategory && relevantMissileCategory) {
                //	we may not have line geometry... (?)
                if (set.lineGeometry === undefined)
                    continue;

                var lineColor = new THREE.Color(missileColors[set.missile]);

                var lastColor;
                //	grab the colors from the vertices
                for (let s of set.lineGeometry.vertices) {
                    var v = set.lineGeometry.vertices[s];
                    lineColors.push(lineColor);
                    lastColor = lineColor;
                }

                //	merge it all together
                linesGeo.merge(set.lineGeometry);

                var particleColor = lastColor.clone();
                var points = set.lineGeometry.vertices;
                var particleCount = 1;
                var particleSize = set.lineGeometry.size * dpr;
                if (set === selectedTest) {
                    particleCount *= 4;
                    particleSize *= 2;
                }
                for (var rIndex = 0; rIndex < points.length - 1; rIndex++) {
                    for (var s = 0; s < particleCount; s++) {
                        var point = points[rIndex];
                        var particle = point.clone();
                        particle.moveIndex = rIndex;
                        particle.nextIndex = rIndex + 1;
                        if (particle.nextIndex >= points.length)
                            particle.nextIndex = 0;
                        particle.lerpN = 0;
                        particle.path = points;
                        particlesGeo.vertices.push(particle);
                        particle.size = particleSize;

                        particlePositions.push(particle.x, particle.y, particle.z);
                        particleSizes.push(particleSize);
                        particleColors.push(particleColor.r, particleColor.g, particleColor.b);
                    }
                }

                affectedTest.push(set.testName);

                if (set.outcome === 'success') {
                    summary.success[set.missile]++;
                    summary.success.total++;
                }
                else if (set.outcome === 'failure') {
                    summary.failure[set.missile]++;
                    summary.failure.total++;
                }
                else {
                    summary.unknown[set.missile]++;
                    summary.unknown.total++;
                }

                summary.total++;

            }
        }

        // console.log(selectedTest);

        linesGeo.colors = lineColors;

        //	make a final mesh out of this composite
        var splineOutline = new THREE.Line(linesGeo, new THREE.LineBasicMaterial(
            {
                color: 0xffffff, opacity: 1.0, blending:
                    THREE.AdditiveBlending, transparent: true,
                depthWrite: false, vertexColors: true,
                linewidth: 1
            })
        );


        particlesGeo.addAttribute('position', new THREE.BufferAttribute(new Float32Array(particlePositions), 3));
        particlesGeo.addAttribute('size', new THREE.BufferAttribute(new Float32Array(particleSizes), 1));
        particlesGeo.addAttribute('customColor', new THREE.BufferAttribute(new Float32Array(particleColors), 3));

        var uniforms = {
            amplitude: { type: "f", value: 1.0 },
            color: { type: "c", value: new THREE.Color(0xffffff) },
            texture: { type: "t", value: new THREE.TextureLoader().load("./images/particleA.png") },
        };

        var shaderMaterial = new THREE.ShaderMaterial({

            uniforms: uniforms,
            vertexShader: document.getElementById('vertexshader').textContent,
            fragmentShader: document.getElementById('fragmentshader').textContent,

            blending: THREE.AdditiveBlending,
            depthTest: true,
            depthWrite: false,
            transparent: true,
            // sizeAttenuation: true,
        });



        var pSystem = new THREE.Points(particlesGeo, shaderMaterial);
        pSystem.dynamic = true;
        splineOutline.add(pSystem);

        pSystem.update = function () {
            // var time = Date.now();
            var positionArray = this.geometry.attributes.position.array;
            var index = 0;
            for (var i in this.geometry.vertices) {
                var particle = this.geometry.vertices[i];
                var path = particle.path;
                var moveLength = path.length;

                particle.lerpN += 0.05;
                if (particle.lerpN > 1) {
                    particle.lerpN = 0;
                    particle.moveIndex = particle.nextIndex;
                    particle.nextIndex++;
                    if (particle.nextIndex >= path.length) {
                        particle.moveIndex = 0;
                        particle.nextIndex = 1;
                    }
                }

                var currentPoint = path[particle.moveIndex];
                var nextPoint = path[particle.nextIndex];


                particle.copy(currentPoint);
                particle.lerp(nextPoint, particle.lerpN);

                positionArray[index++] = particle.x;
                positionArray[index++] = particle.y;
                positionArray[index++] = particle.z;
            }
            this.geometry.attributes.position.needsUpdate = true;
        };

        //	return this info as part of the mesh package, we'll use this in selectvisualization
        splineOutline.affectedTests = affectedTest;


        return splineOutline;
    }

    function wrap(value, min, rangeSize) {
        rangeSize-=min;
        while (value < min) {
            value += rangeSize;
        }
        return value % rangeSize;
    }

    var selectedTest = null;
    var previouslySelectedTest = null;
    var selectableTests = [];
    var testData = new Object();
    export function selectVisualization(missileLookup:any,facilityData:any,testData: any, linearData: any, year: any, tests: any, outcomeCategories: any, missileCategories: any) {
        //	we're only doing one test for now so...
        var cName = tests[0].toUpperCase();

        $("#hudButtons .testTextInput").val(cName);
        previouslySelectedTest = selectedTest;
        selectedTest = testData[tests[0].toUpperCase()];

        summary = {
            success: {
                total: 0
            },
            failure: {
                total: 0
            },
            unknown: {
                total: 0
            },
            total: 0,
            max: 0,
            historical: getHistoricalData(linearData)
        };
        for (var i in missileLookup) {
            summary.success[i] = 0;
            summary.failure[i] = 0;
            summary.unknown[i] = 0;
        }


        //	clear children
        while (visualizationMesh.children.length > 0) {
            var c = visualizationMesh.children[0];
            visualizationMesh.remove(c);
        }

        //	build the mesh
        console.time('getVisualizedMesh');
        var mesh = getVisualizedMesh(linearData, year, outcomeCategories, missileCategories);
        console.timeEnd('getVisualizedMesh');

        //	add it to scene graph
        visualizationMesh.add(mesh);

        if (previouslySelectedTest !== selectedTest) {
            if (selectedTest) {
                var facility = facilityData[selectedTest.facility];
                var landing = selectedTest.landingLocation;

                Utils.setRotateTargetX((facility.lat + landing.lat) / 2 * Math.PI / 180);
                var targetY0 = -((facility.lon + landing.lon) / 2 - 9.9) * Math.PI / 180;
                var piCounter = 0;
                while (true) {
                    var targetY0Neg = targetY0 - Math.PI * 2 * piCounter;
                    var targetY0Pos = targetY0 + Math.PI * 2 * piCounter;
                    if (Math.abs(targetY0Neg - rotating.rotation.y) < Math.PI) {
                        Utils.setRotateTargetY(targetY0Neg);
                        break;
                    } else if (Math.abs(targetY0Pos - rotating.rotation.y) < Math.PI) {
                        Utils.setRotateTargetY(targetY0Pos);
                        break;
                    }
                    piCounter++;
                    Utils.setRotateTargetY(wrap(targetY0, -Math.PI, Math.PI));
                }

                Utils.setRotateVX(Utils.getRotateVX() * 0.6);
                Utils.setRotateVY(Utils.getRotateVY() * 0.6);

                Utils.setScaleTarget(90 / (landing.center.clone().sub(facility.center).length() + 30));
            }
        }

        //d3Graphs.initGraphs();
    }

    function getHistoricalData(timeBins:any) {
        var history = [];
    
        var outcomeCategories = selectionData.getOutcomeCategories();
        var missileCategories = selectionData.getMissileCategories();
    
        for (var i in timeBins) {
            var yearBin = timeBins[i].data;
            var value = { successes: 0, failures: 0, unknowns: 0 };
            for (var s in yearBin) {
                var set = yearBin[s];
                var outcomeName = set.outcome;
                var missileName = set.missile;
    
                var relevantCategory = ($.inArray(outcomeName, outcomeCategories) >= 0) &&
                    ($.inArray(missileName, missileCategories) >= 0);
    
                if (relevantCategory == false)
                    continue;
    
                if (outcomeName === 'success')
                    value.successes++;
                else if (outcomeName === 'failure')
                    value.failures++;
                else
                    value.unknowns++;
            }
            history.push(value);
        }
        // console.log(history);
        return history;
    }

    export function initThreeJs(mapImage: any, timeBins: any, missileLookup: any, latlonData: any) {

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
        for (var i in timeBins) {
            var bin = timeBins[i].data;
            for (var s in bin) {
                var set = bin[s];

                var seriesPostfix = set.series ? ' [' + set.series + ']' : '';
                var testName = (set.date + ' ' + missileLookup[set.missile].name + seriesPostfix).toUpperCase();

                selectableTests.push(testName);
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
        var facilityData = Utils.loadGeoData(latlonData);

        //data visual
        var vizilines = Utils.buildDataVizGeometries(timeBins, missileLookup, facilityData);

        visualizationMesh = new THREE.Object3D();
        rotating.add(visualizationMesh);

        var latestBin = timeBins[timeBins.length - 1];
        var selectedYear = latestBin.year;

        var latestTest = latestBin.data[latestBin.data.length - 1];
        var selectedTestName = latestTest.testName;

        selectionData = new Selection(selectedYear, selectedTestName,missileLookup);

        selectVisualization(missileLookup,facilityData,vizilines,timeBins, selectedYear, [selectedTestName], Object.keys(outcomeLookup), Object.keys(missileLookup));




        //	-----------------------------------------------------------------------------
        //	Setup our renderer
        renderer = new THREE.WebGLRenderer({ antialias: false });
        renderer.setPixelRatio(dpr);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.autoClear = false;

        renderer.sortObjects = false;
        renderer.generateMipmaps = false;

        glContainer.appendChild(renderer.domElement);


        //event listener
        Utils.InitEventListener();


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

        Utils.AnimeUpdate();
        rotating.rotation.x = Utils.getRotateX();
        rotating.rotation.y = Utils.getRotateY();

        render();

        requestAnimationFrame(animate);

        rotating.traverse(function (mesh) {
            if (mesh.update !== undefined) {
                mesh.update();
            }
        });

        render2d();
    }
}