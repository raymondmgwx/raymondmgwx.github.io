var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/* =========================================================================
 *
 *  Config.js
 *  ECS System Config
 *
 * ========================================================================= */
var ECS;
(function (ECS) {
    ECS.canvasWidth = 600;
    ECS.canvasHeight = 400;
})(ECS || (ECS = {}));
var Utils;
(function (Utils) {
    ;
    var HashSet = /** @class */ (function () {
        function HashSet() {
            this.items = {};
        }
        HashSet.prototype.add = function (key, value) {
            this.items[key] = value;
        };
        HashSet.prototype["delete"] = function (key) {
            return delete this.items[key];
        };
        HashSet.prototype.has = function (key) {
            return key in this.items;
        };
        HashSet.prototype.get = function (key) {
            return this.items[key];
        };
        HashSet.prototype.len = function () {
            return Object.keys(this.items).length;
        };
        HashSet.prototype.forEach = function (f) {
            for (var k in this.items) {
                f(k, this.items[k]);
            }
        };
        return HashSet;
    }());
    Utils.HashSet = HashSet;
})(Utils || (Utils = {}));
/* =========================================================================
 *
 *  Component.ts
 *  Each entity can obtain many components
 *
 * ========================================================================= */
/// <reference path="./Config.ts" />
/// <reference path="./HashSet.ts" />
var ECS;
(function (ECS) {
    var Component = /** @class */ (function () {
        function Component(name) {
            this.name = name;
        }
        return Component;
    }());
    ECS.Component = Component;
    var JsonDataComponent = /** @class */ (function (_super) {
        __extends(JsonDataComponent, _super);
        function JsonDataComponent(value) {
            if (value === void 0) { value = ""; }
            var _this = _super.call(this, "jsondata") || this;
            _this.data = value;
            return _this;
        }
        return JsonDataComponent;
    }(Component));
    ECS.JsonDataComponent = JsonDataComponent;
    var GlobalComponent = /** @class */ (function (_super) {
        __extends(GlobalComponent, _super);
        function GlobalComponent(data) {
            var _this = _super.call(this, "global") || this;
            _this.data = data;
            return _this;
        }
        return GlobalComponent;
    }(Component));
    ECS.GlobalComponent = GlobalComponent;
})(ECS || (ECS = {}));
/* =========================================================================
 *
 *  Entity.js
 *  Each entity has an unique ID
 *
 * ========================================================================= */
/// <reference path="./Component.ts" />
/// <reference path="./HashSet.ts" />
var ECS;
(function (ECS) {
    var Entity = /** @class */ (function () {
        function Entity(name) {
            this.name = name;
            this.id = (+new Date()).toString(16) +
                (Math.random() * 100000000 | 0).toString(16) +
                this.count;
            this.count++;
            this.components = new Utils.HashSet();
        }
        Entity.prototype.addComponent = function (component) {
            this.components.add(component.name, component);
            console.log("add [" + component.name + "] component");
        };
        Entity.prototype.removeComponent = function (component) {
            var name = component.name;
            var deletOrNot = this.components["delete"](name);
            if (deletOrNot) {
                console.log("delete [" + name + "] success!");
            }
            else {
                console.log("delete [" + name + "] fail! not exist!");
            }
        };
        return Entity;
    }());
    ECS.Entity = Entity;
})(ECS || (ECS = {}));
/* =========================================================================
 *
 *  LoadData.ts
 *  load data from json file
 *
 * ========================================================================= */
/// <reference path="./System.ts" />
var Utils;
(function (Utils) {
    function loadData(path, jsondata, callback) {
        var cxhr = new XMLHttpRequest();
        cxhr.open('GET', path, true);
        cxhr.onreadystatechange = function () {
            if (cxhr.readyState === 4 && cxhr.status === 200) {
                jsondata.data = cxhr.responseText;
                if (callback)
                    callback();
            }
        };
        cxhr.send(null);
    }
    Utils.loadData = loadData;
    var yearIndexLookup = {};
    function getYearIndexlookUp() {
        return yearIndexLookup;
    }
    Utils.getYearIndexlookUp = getYearIndexlookUp;
    function loadGeoData(latlonData) {
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
    Utils.loadGeoData = loadGeoData;
    function createLineGeometry(points) {
        var geometry = new THREE.Geometry();
        for (var i = 0; i < points.length; i++) {
            geometry.vertices.push(points[i]);
        }
        return geometry;
    }
    var globeRadius = 100;
    var vec3_origin = new THREE.Vector3(0, 0, 0);
    function makeConnectionLineGeometry(facility, landing, apogee) {
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
    function landingLatLon(lat, lon, bearing, distance) {
        var a = 6378137.06; // radius at equator
        var phi1 = lat * Math.PI / 180;
        var L1 = lon * Math.PI / 180;
        var alpha1 = bearing * Math.PI / 180;
        var delta = distance * 1000 / a;
        var phi2 = Math.asin(Math.sin(phi1) * Math.cos(delta) +
            Math.cos(phi1) * Math.sin(delta) * Math.cos(alpha1));
        var dL = Math.atan2(Math.sin(alpha1) * Math.sin(delta) * Math.cos(phi1), Math.cos(delta) - Math.sin(phi1) * Math.sin(phi2));
        var L2 = (L1 + dL + 3 * Math.PI) % (2 * Math.PI) - Math.PI;
        return { 'lat': phi2 * 180 / Math.PI, 'lon': L2 * 180 / Math.PI };
    }
    function buildDataVizGeometries(linearData, missileLookup, facilityData) {
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
    Utils.buildDataVizGeometries = buildDataVizGeometries;
})(Utils || (Utils = {}));
/* =========================================================================
 *
 *  EventListener.ts
 *  event listener
 *
 * ========================================================================= */
/// <reference path="./ThreeJsFunc.ts" />
var Utils;
(function (Utils) {
    var mouseX = 0, mouseY = 0, pmouseX = 0, pmouseY = 0;
    var pressX = 0, pressY = 0;
    var pscale = 0;
    var dragging = false;
    var touchEndTime = 0;
    var rotateX = 0, rotateY = 0;
    var rotateVX = 0, rotateVY = 0;
    var rotateXMax = 90 * Math.PI / 180;
    var rotateTargetX = undefined;
    var rotateTargetY = undefined;
    var tilt = 0;
    var tiltTarget = undefined;
    var scaleTarget = undefined;
    var keyboard = new THREEx.KeyboardState();
    function setRotateTargetX(val) {
        rotateTargetX = val;
    }
    Utils.setRotateTargetX = setRotateTargetX;
    function setRotateTargetY(val) {
        rotateTargetY = val;
    }
    Utils.setRotateTargetY = setRotateTargetY;
    function setRotateVX(val) {
        rotateVX = val;
    }
    Utils.setRotateVX = setRotateVX;
    function setRotateVY(val) {
        rotateVY = val;
    }
    Utils.setRotateVY = setRotateVY;
    function getRotateVX() {
        return rotateVX;
    }
    Utils.getRotateVX = getRotateVX;
    function getRotateVY() {
        return rotateVY;
    }
    Utils.getRotateVY = getRotateVY;
    function getMouseX() {
        return mouseX;
    }
    Utils.getMouseX = getMouseX;
    function getMouseY() {
        return mouseY;
    }
    Utils.getMouseY = getMouseY;
    function setScaleTarget(val) {
        scaleTarget = val;
    }
    Utils.setScaleTarget = setScaleTarget;
    function constrain(v, min, max) {
        if (v < min)
            v = min;
        else if (v > max)
            v = max;
        return v;
    }
    function onDocumentMouseMove(event) {
        pmouseX = mouseX;
        pmouseY = mouseY;
        if (event instanceof MouseEvent) {
            mouseX = event.clientX - window.innerWidth * 0.5;
            mouseY = event.clientY - window.innerHeight * 0.5;
        }
        else {
            mouseX = event.touches[0].clientX - window.innerWidth * 0.5;
            mouseY = event.touches[0].clientY - window.innerHeight * 0.5;
        }
        if (dragging && !('ontouchmove' in document && event instanceof TouchEvent && event.touches.length > 1)) {
            if (keyboard.pressed("shift") == false) {
                rotateVY += (mouseX - pmouseX) / 2 * Math.PI / 180 * 0.1;
                rotateVX += (mouseY - pmouseY) / 2 * Math.PI / 180 * 0.1;
            }
            else {
                handleTiltWheel((mouseY - pmouseY) * 0.1);
            }
        }
        // This prevents zooming by gesture
        if (dragging && 'ontouchmove' in document && event instanceof TouchEvent) {
            event.preventDefault();
        }
    }
    function onDocumentMouseDown(event) {
        if (typeof event.target.className === 'string' && event.target.className.indexOf('noMapDrag') !== -1) {
            return;
        }
        if (event instanceof MouseEvent) {
            mouseX = event.clientX - window.innerWidth * 0.5;
            mouseY = event.clientY - window.innerHeight * 0.5;
        }
        else {
            mouseX = event.touches[0].clientX - window.innerWidth * 0.5;
            mouseY = event.touches[0].clientY - window.innerHeight * 0.5;
        }
        dragging = true;
        pressX = mouseX;
        pressY = mouseY;
        rotateTargetX = undefined;
        rotateTargetX = undefined;
        tiltTarget = undefined;
        scaleTarget = undefined;
        // This prevents zooming by gesture
        if ('ontouchstart' in document && event instanceof TouchEvent && event.touches.length > 1) {
            event.preventDefault();
        }
    }
    function onDocumentMouseUp(event) {
        //d3Graphs.tiltBtnMouseup();
        //d3Graphs.zoomBtnMouseup();
        dragging = false;
        //histogramPressed = false;
        // This prevents zooming by double-taps
        if ('ontouchend' in document && event instanceof TouchEvent) {
            var now = new Date().getTime();
            if (now - touchEndTime < 500) {
                event.preventDefault();
            }
            touchEndTime = now;
        }
    }
    //click current country
    function onClick(event) {
        if (Math.abs(pressX - mouseX) > 3 || Math.abs(pressY - mouseY) > 3)
            return;
        //var pickColorIndex = getPickColor();
    }
    function onKeyDown(event) {
    }
    function handleMWheel(delta) {
        var camera = ThreeJS.getCamera();
        camera.zoom += delta * 0.1;
        camera.zoom = constrain(camera.zoom, 0.5, 5.0);
        camera.updateProjectionMatrix();
        scaleTarget = undefined;
    }
    function onMouseWheel(event) {
        var delta = 0;
        if (event.wheelDelta) { /* IE/Opera. */
            delta = event.wheelDelta / 120;
        }
        else if (event.detail) { // firefox
            delta = -event.detail / 3;
        }
        if (delta) {
            handleMWheel(delta);
        }
        event.returnValue = false;
    }
    function onDocumentResize(event) {
    }
    function onDocumentPinch(event) {
        if (event.type === 'pinchmove') {
            handleMWheel(Math.log(event.scale / pscale) * 10);
        }
        pscale = event.scale;
    }
    function handleTiltWheel(delta) {
        var camera = ThreeJS.getCamera();
        tilt -= delta * 0.1;
        tilt = constrain(tilt, 0, Math.PI / 2);
        camera.position.y = 300 * Math.sin(-tilt);
        camera.position.z = 100 + 300 * Math.cos(-tilt);
        camera.lookAt(new THREE.Vector3(0, 0, 100));
        tiltTarget = undefined;
    }
    function onDocumentPan(event) {
        handleTiltWheel(event.velocityY);
    }
    function getRotateX() {
        return rotateX;
    }
    Utils.getRotateX = getRotateX;
    function getRotateY() {
        return rotateY;
    }
    Utils.getRotateY = getRotateY;
    function AnimeUpdate() {
        var camera = ThreeJS.getCamera();
        if (rotateTargetX !== undefined && rotateTargetY !== undefined) {
            rotateVX += (rotateTargetX - rotateX) * 0.012;
            rotateVY += (rotateTargetY - rotateY) * 0.012;
            if (Math.abs(rotateTargetX - rotateX) < 0.02 && Math.abs(rotateTargetY - rotateY) < 0.02) {
                rotateTargetX = undefined;
                rotateTargetY = undefined;
            }
        }
        rotateX += rotateVX;
        rotateY += rotateVY;
        rotateVX *= 0.98;
        rotateVY *= 0.98;
        if (dragging || rotateTargetX !== undefined) {
            rotateVX *= 0.6;
            rotateVY *= 0.6;
        }
        if (rotateX < -rotateXMax) {
            rotateX = -rotateXMax;
            rotateVX *= -0.95;
        }
        if (rotateX > rotateXMax) {
            rotateX = rotateXMax;
            rotateVX *= -0.95;
        }
        if (tiltTarget !== undefined) {
            tilt += (tiltTarget - tilt) * 0.012;
            camera.position.y = 300 * Math.sin(-tilt);
            camera.position.z = 100 + 300 * Math.cos(-tilt);
            camera.lookAt(new THREE.Vector3(0, 0, 100));
            if (Math.abs(tiltTarget - tilt) < 0.05) {
                tiltTarget = undefined;
            }
        }
        if (scaleTarget !== undefined) {
            camera.zoom *= Math.pow(scaleTarget / camera.zoom, 0.012);
            camera.updateProjectionMatrix();
            if (Math.abs(Math.log(scaleTarget / camera.zoom)) < 0.05) {
                scaleTarget = undefined;
            }
        }
    }
    Utils.AnimeUpdate = AnimeUpdate;
    var masterContainer = document.getElementById('visualization');
    function InitEventListener() {
        // Detect passive event support
        var passive = false;
        var options = Object.defineProperty({}, 'passive', {
            get: function () {
                passive = true;
            }
        });
        document.addEventListener('testPassiveEventSupport', function () { }, options);
        document.removeEventListener('testPassiveEventSupport', function () { }, options);
        document.addEventListener('mousemove', onDocumentMouseMove, true);
        document.addEventListener('touchmove', onDocumentMouseMove, passive ? { capture: true, passive: false } : true);
        document.addEventListener('windowResize', onDocumentResize, false);
        document.addEventListener('mousedown', onDocumentMouseDown, true);
        document.addEventListener('touchstart', onDocumentMouseDown, passive ? { capture: true, passive: false } : true);
        document.addEventListener('mouseup', onDocumentMouseUp, false);
        document.addEventListener('touchend', onDocumentMouseUp, false);
        document.addEventListener('touchcancel', onDocumentMouseUp, false);
        var mc = new Hammer(document);
        mc.get('pinch').set({ enable: true });
        mc.get('pan').set({ threshold: 0, pointers: 3, direction: Hammer.DIRECTION_VERTICAL });
        mc.on('pinchstart pinchmove', onDocumentPinch);
        mc.on('panmove', onDocumentPan);
        masterContainer.addEventListener('click', onClick, true);
        masterContainer.addEventListener('mousewheel', onMouseWheel, false);
        //	firefox
        masterContainer.addEventListener('DOMMouseScroll', function (e) {
            var evt = window.event || e; //equalize event object
            onMouseWheel(evt);
        }, false);
        document.addEventListener('keydown', onKeyDown, false);
    }
    Utils.InitEventListener = InitEventListener;
})(Utils || (Utils = {}));
/* =========================================================================
 *
 *  ThreeJsFunc.ts
 *  using three.js library to init 3D scene
 *
 * ========================================================================= */
/// <reference path="./EventListener.ts" />
/// <reference path="./LoadData.ts" />
var ThreeJS;
(function (ThreeJS) {
    var camera, scene, renderer;
    var camera2d, scene2d;
    var sphere;
    var rotating;
    var visualizationMesh;
    var selectableTests = [];
    var glContainer = document.getElementById('glContainer');
    var dpr = window.devicePixelRatio ? window.devicePixelRatio : 1;
    var lookupCanvas, lookupTexture;
    var outcomeLookup = {
        'success': 'Success',
        'failure': 'Failure',
        'unknown': 'Unknown'
    };
    var selectionData;
    var Selection = function (selectedYear, selectedTest, missileLookup) {
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
        };
        this.getMissileCategories = function () {
            var list = [];
            for (var i in this.missileCategories) {
                if (this.missileCategories[i]) {
                    list.push(i);
                }
            }
            return list;
        };
    };
    function getCamera() {
        return camera;
    }
    ThreeJS.getCamera = getCamera;
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
        for (var _i = 0, bin_1 = bin; _i < bin_1.length; _i++) {
            var i = bin_1[_i];
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
                for (var _a = 0, _b = set.lineGeometry.vertices; _a < _b.length; _a++) {
                    var s_1 = _b[_a];
                    var v = set.lineGeometry.vertices[s_1];
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
        var splineOutline = new THREE.Line(linesGeo, new THREE.LineBasicMaterial({
            color: 0xffffff, opacity: 1.0, blending: THREE.AdditiveBlending, transparent: true,
            depthWrite: false, vertexColors: true,
            linewidth: 1
        }));
        particlesGeo.addAttribute('position', new THREE.BufferAttribute(new Float32Array(particlePositions), 3));
        particlesGeo.addAttribute('size', new THREE.BufferAttribute(new Float32Array(particleSizes), 1));
        particlesGeo.addAttribute('customColor', new THREE.BufferAttribute(new Float32Array(particleColors), 3));
        var uniforms = {
            amplitude: { type: "f", value: 1.0 },
            color: { type: "c", value: new THREE.Color(0xffffff) },
            texture: { type: "t", value: new THREE.TextureLoader().load("./images/particleA.png") }
        };
        var shaderMaterial = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: document.getElementById('vertexshader').textContent,
            fragmentShader: document.getElementById('fragmentshader').textContent,
            blending: THREE.AdditiveBlending,
            depthTest: true,
            depthWrite: false,
            transparent: true
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
        rangeSize -= min;
        while (value < min) {
            value += rangeSize;
        }
        return value % rangeSize;
    }
    var selectedTest = null;
    var previouslySelectedTest = null;
    var selectableTests = [];
    var testData = new Object();
    function selectVisualization(missileLookup, facilityData, testData, linearData, year, tests, outcomeCategories, missileCategories) {
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
                    }
                    else if (Math.abs(targetY0Pos - rotating.rotation.y) < Math.PI) {
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
    ThreeJS.selectVisualization = selectVisualization;
    var countryColorMap = {
        'PE': 1,
        'BF': 2, 'FR': 3, 'LY': 4, 'BY': 5, 'PK': 6, 'ID': 7, 'YE': 8, 'MG': 9, 'BO': 10, 'CI': 11, 'DZ': 12, 'CH': 13, 'CM': 14, 'MK': 15, 'BW': 16, 'UA': 17,
        'KE': 18, 'TW': 19, 'JO': 20, 'MX': 21, 'AE': 22, 'BZ': 23, 'BR': 24, 'SL': 25, 'ML': 26, 'CD': 27, 'IT': 28, 'SO': 29, 'AF': 30, 'BD': 31, 'DO': 32, 'GW': 33,
        'GH': 34, 'AT': 35, 'SE': 36, 'TR': 37, 'UG': 38, 'MZ': 39, 'JP': 40, 'NZ': 41, 'CU': 42, 'VE': 43, 'PT': 44, 'CO': 45, 'MR': 46, 'AO': 47, 'DE': 48, 'SD': 49,
        'TH': 50, 'AU': 51, 'PG': 52, 'IQ': 53, 'HR': 54, 'GL': 55, 'NE': 56, 'DK': 57, 'LV': 58, 'RO': 59, 'ZM': 60, 'IR': 61, 'MM': 62, 'ET': 63, 'GT': 64, 'SR': 65,
        'EH': 66, 'CZ': 67, 'TD': 68, 'AL': 69, 'FI': 70, 'SY': 71, 'KG': 72, 'SB': 73, 'OM': 74, 'PA': 75, 'AR': 76, 'GB': 77, 'CR': 78, 'PY': 79, 'GN': 80, 'IE': 81,
        'NG': 82, 'TN': 83, 'PL': 84, 'NA': 85, 'ZA': 86, 'EG': 87, 'TZ': 88, 'GE': 89, 'SA': 90, 'VN': 91, 'RU': 92, 'HT': 93, 'BA': 94, 'IN': 95, 'CN': 96, 'CA': 97,
        'SV': 98, 'GY': 99, 'BE': 100, 'GQ': 101, 'LS': 102, 'BG': 103, 'BI': 104, 'DJ': 105, 'AZ': 106, 'MY': 107, 'PH': 108, 'UY': 109, 'CG': 110, 'RS': 111, 'ME': 112, 'EE': 113,
        'RW': 114, 'AM': 115, 'SN': 116, 'TG': 117, 'ES': 118, 'GA': 119, 'HU': 120, 'MW': 121, 'TJ': 122, 'KH': 123, 'KR': 124, 'HN': 125, 'IS': 126, 'NI': 127, 'CL': 128, 'MA': 129,
        'LR': 130, 'NL': 131, 'CF': 132, 'SK': 133, 'LT': 134, 'ZW': 135, 'LK': 136, 'IL': 137, 'LA': 138, 'KP': 139, 'GR': 140, 'TM': 141, 'EC': 142, 'BJ': 143, 'SI': 144, 'NO': 145,
        'MD': 146, 'LB': 147, 'NP': 148, 'ER': 149, 'US': 150, 'KZ': 151, 'AQ': 152, 'SZ': 153, 'UZ': 154, 'MN': 155, 'BT': 156, 'NC': 157, 'FJ': 158, 'KW': 159, 'TL': 160, 'BS': 161,
        'VU': 162, 'FK': 163, 'GM': 164, 'QA': 165, 'JM': 166, 'CY': 167, 'PR': 168, 'PS': 169, 'BN': 170, 'TT': 171, 'CV': 172, 'PF': 173, 'WS': 174, 'LU': 175, 'KM': 176, 'MU': 177,
        'FO': 178, 'ST': 179, 'AN': 180, 'DM': 181, 'TO': 182, 'KI': 183, 'FM': 184, 'BH': 185, 'AD': 186, 'MP': 187, 'PW': 188, 'SC': 189, 'AG': 190, 'BB': 191, 'TC': 192, 'VC': 193,
        'LC': 194, 'YT': 195, 'VI': 196, 'GD': 197, 'MT': 198, 'MV': 199, 'KY': 200, 'KN': 201, 'MS': 202, 'BL': 203, 'NU': 204, 'PM': 205, 'CK': 206, 'WF': 207, 'AS': 208, 'MH': 209,
        'AW': 210, 'LI': 211, 'VG': 212, 'SH': 213, 'JE': 214, 'AI': 215, 'MF_1_': 216, 'GG': 217, 'SM': 218, 'BM': 219, 'TV': 220, 'NR': 221, 'GI': 222, 'PN': 223, 'MC': 224, 'VA': 225,
        'IM': 226, 'GU': 227, 'SG': 228
    };
    // function highlightCountry(countries: any, countryData: any) {
    //     var countryCodes = [];
    //     for (var i in countries) {
    //         var code = findCode(countries[i]);
    //         countryCodes.push(code);
    //     }
    //     var ctx = lookupCanvas.getContext('2d');
    //     ctx.clearRect(0, 0, 256, 1);
    //     var pickMask = countries.length == 0 ? 0 : 1;
    //     var oceanFill = 10 * pickMask;
    //     ctx.fillStyle = 'rgb(' + oceanFill + ',' + oceanFill + ',' + oceanFill + ')';
    //     ctx.fillRect(0, 0, 1, 1);
    //     var selectedCountryCode = selectedCountry.countryCode;
    //     for (var i in countryCodes) {
    //         var countryCode = countryCodes[i];
    //         var colorIndex = countryColorMap[countryCode];
    //         var mapColor = countryData[countries[i]].mapColor;
    //         // var fillCSS = '#ff0000';
    //         var fillCSS = '#333333';
    //         if (countryCode === selectedCountryCode)
    //             fillCSS = '#eeeeee'
    //         ctx.fillStyle = fillCSS;
    //         ctx.fillRect(colorIndex, 0, 1, 1);
    //     }
    //     lookupTexture.needsUpdate = true;
    // }
    // function getPickColor(countryData: any) {
    //     highlightCountry([], countryData);
    //     mapUniforms['outlineLevel'].value = 0;
    //     lookupTexture.needsUpdate = true;
    //     renderer.autoClear = false;
    //     renderer.autoClearColor = false;
    //     renderer.autoClearDepth = false;
    //     renderer.autoClearStencil = false;
    //     renderer.preserve
    //     renderer.clear();
    //     renderer.render(scene, camera);
    //     var gl = renderer.context;
    //     gl.preserveDrawingBuffer = true;
    //     var mx = (Utils.getMouseX() + renderer.context.canvas.width / 2);
    //     var my = (-Utils.getMouseY() + renderer.context.canvas.height / 2);
    //     mx = Math.floor(mx);
    //     my = Math.floor(my);
    //     var buf = new Uint8Array(4);
    //     gl.readPixels(mx, my, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, buf);
    //     renderer.autoClear = true;
    //     renderer.autoClearColor = true;
    //     renderer.autoClearDepth = true;
    //     renderer.autoClearStencil = true;
    //     gl.preserveDrawingBuffer = false;
    //     mapUniforms['outlineLevel'].value = 1;
    //     return buf[0];
    // }
    function getHistoricalData(timeBins) {
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
    function initThreeJs(timeBins, missileLookup, latlonData) {
        scene = new THREE.Scene();
        scene.matrixAutoUpdate = false;
        scene2d = new THREE.Scene();
        scene.add(new THREE.AmbientLight(0x505050));
        var light1 = new THREE.SpotLight(0xeeeeee, 2);
        light1.position.x = 1730;
        light1.position.y = 1520;
        light1.position.z = 626;
        light1.castShadow = true;
        scene.add(light1);
        var light2 = new THREE.PointLight(0x222222, 14);
        light2.position.x = -640;
        light2.position.y = -500;
        light2.position.z = -1000;
        scene.add(light2);
        rotating = new THREE.Object3D();
        scene.add(rotating);
        // var MapTexture = new THREE.Texture(mapImage);
        // MapTexture.needsUpdate = true;
        // var mapMaterial = new THREE.MeshBasicMaterial({
        //     map: MapTexture,
        //     polygonOffset: true,
        //     polygonOffsetFactor: 1,
        //     polygonOffsetUnits: 1
        // });
        var mapMaterial = new THREE.MeshPhongMaterial({
            map: new THREE.TextureLoader().load('./images/2_no_clouds_4k.jpg'),
            bumpMap: new THREE.TextureLoader().load('./images/elev_bump_4k.jpg'),
            bumpScale: 0.005,
            specularMap: new THREE.TextureLoader().load('./images/water_4k.png'),
            specular: new THREE.Color('grey')
        });
        var radius = 100;
        var segments = 40;
        sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, segments, segments), mapMaterial);
        sphere.doubleSided = false;
        sphere.rotation.x = Math.PI;
        sphere.rotation.y = -Math.PI / 2;
        sphere.rotation.z = Math.PI;
        sphere.id = "base";
        rotating.add(sphere);
        //map index
        lookupCanvas = document.createElement('canvas');
        lookupCanvas.width = 256;
        lookupCanvas.height = 1;
        lookupTexture = new THREE.Texture(lookupCanvas);
        lookupTexture.magFilter = THREE.NearestFilter;
        lookupTexture.minFilter = THREE.NearestFilter;
        lookupTexture.needsUpdate = true;
        var indexedMapTexture = new THREE.TextureLoader().load('./images/map_indexed.png');
        indexedMapTexture.needsUpdate = true;
        indexedMapTexture.magFilter = THREE.NearestFilter;
        indexedMapTexture.minFilter = THREE.NearestFilter;
        //clouds
        var cloudsMesh = new THREE.Mesh(new THREE.SphereGeometry(radius + 0.6, segments, segments), new THREE.MeshPhongMaterial({
            map: new THREE.TextureLoader().load('./images/fair_clouds_4k.png'),
            transparent: true
        }));
        scene.add(cloudsMesh);
        rotating.add(cloudsMesh);
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
        selectionData = new Selection(selectedYear, selectedTestName, missileLookup);
        selectVisualization(missileLookup, facilityData, vizilines, timeBins, selectedYear, [selectedTestName], Object.keys(outcomeLookup), Object.keys(missileLookup));
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
    ThreeJS.initThreeJs = initThreeJs;
    function render() {
        renderer.clear();
        renderer.render(scene, camera);
    }
    function render2d() {
        renderer.render(scene2d, camera2d);
    }
    function animate() {
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
    ThreeJS.animate = animate;
})(ThreeJS || (ThreeJS = {}));
/* =========================================================================
 *
 *  System.ts
 *  game execute logical
 *
 * ========================================================================= */
/// <reference path="./Entity.ts" />
/// <reference path="./LoadData.ts" />
/// <reference path="./HashSet.ts" />
/// <reference path="./ThreeJsFunc.ts" />
var ECS;
(function (ECS) {
    var System = /** @class */ (function () {
        function System(name) {
            this.name = name;
        }
        System.prototype.Execute = function () {
            console.log("[" + this.name + "]System Execute!");
        };
        return System;
    }());
    ECS.System = System;
    var LoadingSystem = /** @class */ (function (_super) {
        __extends(LoadingSystem, _super);
        function LoadingSystem(entities) {
            var _this = _super.call(this, "loading") || this;
            _this.entities = entities;
            return _this;
        }
        LoadingSystem.prototype.Execute = function () {
            _super.prototype.Execute.call(this);
            // var mapImage = new Image();
            // mapImage.src = './images/2_no_clouds_4k.jpg';
            //console.log("load image data finished!");
            Utils.loadData('./data/tip.json', this.entities.get("tip_entity").components.get("jsondata"), function () {
                console.log("load tip data finished!");
                Utils.loadData('./data/country.json', this.entities.get("country_entity").components.get("jsondata"), function () {
                    console.log("load country data finished!");
                    Utils.loadData('./data/missile.json', this.entities.get("missile_entity").components.get("jsondata"), function () {
                        console.log("load missile data finished!");
                        Utils.loadData('./data/history.json', this.entities.get("history_entity").components.get("jsondata"), function () {
                            console.log("load history data finished!");
                            var timeBins = JSON.parse(this.entities.get("history_entity").components.get("jsondata").data).timeBins;
                            var missileLookup = JSON.parse(this.entities.get("missile_entity").components.get("jsondata").data);
                            var latlonData = JSON.parse(this.entities.get("country_entity").components.get("jsondata").data);
                            var entity_GlobalData = new ECS.Entity("global_entity");
                            var global_data = new Utils.HashSet();
                            global_data.add("timeBins", timeBins);
                            global_data.add("missileLookup", missileLookup);
                            global_data.add("latlonData", latlonData);
                            entity_GlobalData.addComponent(new ECS.GlobalComponent(global_data));
                            var other_systems = new Utils.HashSet();
                            var main_system = new ECS.MainSystem(entity_GlobalData, other_systems);
                            ThreeJS.initThreeJs(timeBins, missileLookup, latlonData);
                            ThreeJS.animate();
                        });
                    });
                });
            });
        };
        return LoadingSystem;
    }(System));
    ECS.LoadingSystem = LoadingSystem;
    var MainSystem = /** @class */ (function (_super) {
        __extends(MainSystem, _super);
        function MainSystem(GlobalDatas, othSystems) {
            var _this = _super.call(this, "main") || this;
            _this.GlobalDatas = GlobalDatas;
            _this.OtherSystems = othSystems;
            return _this;
        }
        MainSystem.prototype.Execute = function () {
            _super.prototype.Execute.call(this);
            this.OtherSystems.forEach(function (key, val) {
                val.GlobalDatas = this.GlobalDatas;
                val.Execute();
            });
        };
        return MainSystem;
    }(System));
    ECS.MainSystem = MainSystem;
})(ECS || (ECS = {}));
/// <reference path="./Component.ts" />
/// <reference path="./System.ts" />
/// <reference path="./Entity.ts" />
/// <reference path="./HashSet.ts" />
var entity_tip = new ECS.Entity("tip_entity");
entity_tip.addComponent(new ECS.JsonDataComponent());
var entity_country = new ECS.Entity("country_entity");
entity_country.addComponent(new ECS.JsonDataComponent());
var entity_missile = new ECS.Entity("missile_entity");
entity_missile.addComponent(new ECS.JsonDataComponent());
var entity_history = new ECS.Entity("history_entity");
entity_history.addComponent(new ECS.JsonDataComponent());
var entities = new Utils.HashSet();
entities.add(entity_tip.name, entity_tip);
entities.add(entity_country.name, entity_country);
entities.add(entity_missile.name, entity_missile);
entities.add(entity_history.name, entity_history);
var load_system = new ECS.LoadingSystem(entities);
var load = function () {
    if (!Detector.webgl) {
        Detector.addGetWebGLMessage();
    }
    else {
        load_system.Execute();
    }
    ;
};
