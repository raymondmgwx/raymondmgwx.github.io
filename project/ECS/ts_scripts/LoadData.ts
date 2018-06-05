/* =========================================================================
 *
 *  LoadData.ts
 *  load data from json file
 *
 * ========================================================================= */
/// <reference path="./System.ts" />
module Utils {
    declare var THREE: any;
    declare var $: any;

    export function loadData(path: string, jsondata: ECS.JsonDataComponent, callback: () => void) {
        let cxhr = new XMLHttpRequest();
        cxhr.open('GET', path, true);
        cxhr.onreadystatechange = function () {
            if (cxhr.readyState === 4 && cxhr.status === 200) {
                jsondata.data = cxhr.responseText;
                if (callback) callback();
            }
        };
        cxhr.send(null);
    }

    var yearIndexLookup = {};
    export function loadGeoData(latlonData: any) {
        var sphereRad = 1;
        var rad = 100;
        var facilityData = new Object();
        for (var i in latlonData.facilities) {
            var facility = latlonData.facilities[i];

            facility.code = i;
            var lon = facility.lon - 90;
            var lat = facility.lat;

            var phi = Math.PI / 2 - lat * Math.PI / 180;
            var theta = 2 * Math.PI - lon * Math.PI / 180 + Math.PI * 0.055;

            var center = new THREE.Vector3();
            center.x = Math.sin(phi) * Math.cos(theta) * rad;
            center.y = Math.cos(phi) * rad;
            center.z = Math.sin(phi) * Math.sin(theta) * rad;

            //	save and catalogue
            facility.center = center;
            facilityData[i] = facility;
        }
        return facilityData;
    }

    function createLineGeometry(points: any) {
        var geometry = new THREE.Geometry();
        for (var i = 0; i < points.length; i++) {
            geometry.vertices.push(points[i]);
        }
        return geometry;
    }

    var globeRadius = 100;
    var vec3_origin = new THREE.Vector3(0, 0, 0);

    function makeConnectionLineGeometry(facility: any, landing: any, apogee: any) {
        if (facility.center === undefined || landing.center == undefined)
            return undefined;

        var distance = landing.center.clone().sub(facility.center).length();

        //	how high we want to shoot the curve upwards
        var midHeight = globeRadius * apogee / 6378.137;
        var midLength = globeRadius + midHeight;
        //	var anchorHeight = globeRadius * apogee / 6378.137 * 0.6666;
        //	var anchorLength = globeRadius + anchorHeight;

        //	start of the line
        var start = facility.center;

        //	end of the line
        var end = landing.center;

        //	midpoint for the curve
        var mid = start.clone().lerp(end, 0.5);
        mid.normalize();
        mid.multiplyScalar(midLength);

        //	the normal from start to end
        var normal = (new THREE.Vector3()).subVectors(start, end);
        normal.normalize();

        /*
                    The curve looks like this:
    
                    midStartAnchor---- mid ----- midEndAnchor
                  /											  \
                 /											   \
                /												\
        start/anchor 										 end/anchor
    
            splineCurveA							splineCurveB
        */

        var distanceOneThird = distance * 0.33;
        //	var distanceOneSixth = distance * 0.1666;

        var startAnchor = start;
        var midStartAnchor = mid.clone().add(normal.clone().multiplyScalar(distanceOneThird));
        var midEndAnchor = mid.clone().add(normal.clone().multiplyScalar(-distanceOneThird));
        var endAnchor = end;
        //	var startAnchor = start.clone().lerp(end,0.1666).normalize().multiplyScalar(anchorLength);
        //	var midStartAnchor = mid.clone().add( normal.clone().multiplyScalar( distanceOneSixth ) );
        //	var midEndAnchor = mid.clone().add( normal.clone().multiplyScalar( -distanceOneSixth ) );
        //	var endAnchor = start.clone().lerp(end,0.8333).normalize().multiplyScalar(anchorLength);

        //	now make a bezier curve out of the above like so in the diagram
        var splineCurveA = new THREE.CubicBezierCurve3(start, startAnchor, midStartAnchor, mid);
        // splineCurveA.updateArcLengths();

        var splineCurveB = new THREE.CubicBezierCurve3(mid, midEndAnchor, endAnchor, end);
        // splineCurveB.updateArcLengths();

        //	how many vertices do we want on this guy? this is for *each* side
        var vertexCountDesired = Math.floor((distance + midHeight) * 0.3 + 3);

        //	collect the vertices
        var points = splineCurveA.getPoints(vertexCountDesired);

        //	remove the very last point since it will be duplicated on the next half of the curve
        points = points.splice(0, points.length - 1);

        points = points.concat(splineCurveB.getPoints(vertexCountDesired));

        //	add one final point to the center of the earth
        //	we need this for drawing multiple arcs, but piled into one geometry buffer
        points.push(vec3_origin);

        //	create a line geometry out of these
        var curveGeometry = createLineGeometry(points);

        curveGeometry.size = 15;

        return curveGeometry;
    }

    export function buildDataVizGeometries(linearData: any) {

        var sphereRad = 1;
        var rad = 100;
        var loadLayer = document.getElementById('loading');
        var testData = new Object();
        for (var i in linearData) {
            var yearBin = linearData[i].data;

            var year = linearData[i].year;
            yearIndexLookup[year] = i;

            var count = 0;
            console.log('Building data for ...' + year);
            for (var s in yearBin) {
                var set = yearBin[s];

                var seriesPostfix = set.series ? ' [' + set.series + ']' : '';
                set.testName = (set.date + ' ' + missileLookup[set.missile].name + seriesPostfix).toUpperCase();

                var facilityName = set.facility;
                var facility = facilityData[facilityName];

                //	we couldn't find the facility, it wasn't in our list...
                if (facility === undefined)
                    continue;

                var distance = set.distance;
                if (isNaN(distance)) {
                    distance = 0;
                }

                var apogee = set.apogee;
                if (apogee === 'unknown' && distance > 0) {
                    // minimum energy trajectory
                    apogee = -0.000013 * distance * distance + 0.26 * distance;
                }
                if (isNaN(apogee)) {
                    apogee = 0;
                }

                var landing = landingLatLon(facility.lat, facility.lon, set.bearing, distance);
                var lon = landing.lon - 90;
                var lat = landing.lat;
                var phi = Math.PI / 2 - lat * Math.PI / 180;
                var theta = 2 * Math.PI - (lon - 9.9) * Math.PI / 180;

                var lcenter = new THREE.Vector3();
                lcenter.x = Math.sin(phi) * Math.cos(theta) * rad;
                lcenter.y = Math.cos(phi) * rad;
                lcenter.z = Math.sin(phi) * Math.sin(theta) * rad;

                set.landingLocation = {
                    name: set.landing,
                    lat: landing.lat,
                    lon: landing.lon,
                    center: lcenter
                };

                if (distance == 0) {
                    set.markerOnLeft = true;
                }

                //	visualize this event
                set.lineGeometry = makeConnectionLineGeometry(facility, set.landingLocation, apogee);

                testData[set.testName] = set;

            }

        }

        loadLayer.style.display = 'none';
        return testData;
    }

    var summary;
    function getVisualizedMesh(linearData, year, outcomeCategories, missileCategories){
        //	pick out the year first from the data
        var indexFromYear = yearIndexLookup[year];

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
        for (var i in bin) {
            var set = bin[i];

            var relevantOutcomeCategory = $.inArray(set.outcome, outcomeCategories) >= 0;
            var relevantMissileCategory = $.inArray(set.missile, missileCategories) >= 0;

            if (relevantOutcomeCategory && relevantMissileCategory) {
                //	we may not have line geometry... (?)
                if (set.lineGeometry === undefined)
                    continue;

                var lineColor = new THREE.Color(missileColors[set.missile]);

                var lastColor;
                //	grab the colors from the vertices
                for (s in set.lineGeometry.vertices) {
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

        uniforms = {
            amplitude: { type: "f", value: 1.0 },
            color: { type: "c", value: new THREE.Color(0xffffff) },
            texture: { type: "t", value: new THREE.TextureLoader().load("images/particleA.png") },
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

    var selectedTest = null;
    var previouslySelectedTest = null;
    var selectableTests = [];
    export function selectVisualization(testData:any,linearData:any, year:any, tests:any, outcomeCategories:any, missileCategories:any) {
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
            historical: getHistoricalData()
        };
        for (var i in missileLookup) {
            summary.success[i] = 0;
            summary.failure[i] = 0;
            summary.unknown[i] = 0;
        }

        // console.log(selectedTest);

        //	clear markers
        for (var i in selectableTests) {
            removeMarkerFromTest(selectableTests[i]);
        }

        //	clear children
        while (visualizationMesh.children.length > 0) {
            var c = visualizationMesh.children[0];
            visualizationMesh.remove(c);
        }

        //	build the mesh
        console.time('getVisualizedMesh');
        var mesh = getVisualizedMesh(timeBins, year, outcomeCategories, missileCategories);
        console.timeEnd('getVisualizedMesh');

        //	add it to scene graph
        visualizationMesh.add(mesh);

        for (var i in mesh.affectedTests) {
            var testName = mesh.affectedTests[i];
            var test = testData[testName];
            attachMarkerToTest(testName);
        }

        if (previouslySelectedTest !== selectedTest) {
            if (selectedTest) {
                var facility = facilityData[selectedTest.facility];
                var landing = selectedTest.landingLocation;

                rotateTargetX = (facility.lat + landing.lat) / 2 * Math.PI / 180;
                var targetY0 = -((facility.lon + landing.lon) / 2 - 9.9) * Math.PI / 180;
                var piCounter = 0;
                while (true) {
                    var targetY0Neg = targetY0 - Math.PI * 2 * piCounter;
                    var targetY0Pos = targetY0 + Math.PI * 2 * piCounter;
                    if (Math.abs(targetY0Neg - rotating.rotation.y) < Math.PI) {
                        rotateTargetY = targetY0Neg;
                        break;
                    } else if (Math.abs(targetY0Pos - rotating.rotation.y) < Math.PI) {
                        rotateTargetY = targetY0Pos;
                        break;
                    }
                    piCounter++;
                    rotateTargetY = wrap(targetY0, -Math.PI, Math.PI);
                }
                // console.log(rotateTargetY);
                //lines commented below source of rotation error
                //is there a more reliable way to ensure we don't rotate around the globe too much?
                /*
                if( Math.abs(rotateTargetY - rotating.rotation.y) > Math.PI )
                    rotateTargetY += Math.PI;
                */
                rotateVX *= 0.6;
                rotateVY *= 0.6;

                scaleTarget = 90 / (landing.center.clone().sub(facility.center).length() + 30);
            }
        }

        d3Graphs.initGraphs();
    }
}
