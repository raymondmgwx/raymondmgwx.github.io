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
var Utils;
(function (Utils) {
    ;
    var HashSet = /** @class */ (function () {
        function HashSet() {
            this.items = {};
        }
        HashSet.prototype.set = function (key, value) {
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
    var JapanCityDataComponent = /** @class */ (function (_super) {
        __extends(JapanCityDataComponent, _super);
        function JapanCityDataComponent(id, lon, lat) {
            var _this = _super.call(this, "japancity") || this;
            _this.id = id;
            _this.lon = lon;
            _this.lat = lat;
            return _this;
        }
        return JapanCityDataComponent;
    }(Component));
    ECS.JapanCityDataComponent = JapanCityDataComponent;
    var HumanMovementDataComponent = /** @class */ (function (_super) {
        __extends(HumanMovementDataComponent, _super);
        function HumanMovementDataComponent(b_id, b_lon, b_lat, a_id, a_lon, a_lat) {
            var _this = _super.call(this, "humanmove") || this;
            _this.b_id = b_id;
            _this.b_lon = b_lon;
            _this.b_lat = b_lat;
            _this.a_id = a_id;
            _this.a_lon = a_lon;
            _this.a_lat = a_lat;
            return _this;
        }
        return HumanMovementDataComponent;
    }(Component));
    ECS.HumanMovementDataComponent = HumanMovementDataComponent;
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
            this.components.set(component.name, component);
            //console.log("add ["+component.name+"] component");
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
    var ThreeJsMoveEntity = /** @class */ (function () {
        function ThreeJsMoveEntity(startPos, endPos) {
            this.startPos = startPos;
            this.endPos = endPos;
        }
        return ThreeJsMoveEntity;
    }());
    ECS.ThreeJsMoveEntity = ThreeJsMoveEntity;
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
        var rad = 100;
        var facilityData = new Object();
        for (var i in latlonData.facilities) {
            var facility = latlonData.facilities[i];
            facility.code = i;
            var lon = facility.lon - 90;
            var lat = facility.lat;
            var phi = Math.PI / 2 - lat * Math.PI / 180;
            var theta = 2 * Math.PI - lon * Math.PI / 180;
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
                var theta = 2 * Math.PI - lon * Math.PI / 180;
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
 *  Utils.ts
 *  Tools
 *
 * ========================================================================= */
var Utils;
(function (Utils) {
    var Selection = /** @class */ (function () {
        function Selection(selectedYear, selectedTest, missileLookup, outcomeLookup) {
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
        }
        Selection.prototype.getOutcomeCategories = function () {
            var list = [];
            for (var i in this.outcomeCategories) {
                if (this.outcomeCategories[i]) {
                    list.push(i);
                }
            }
            return list;
        };
        Selection.prototype.getMissileCategories = function () {
            var list = [];
            for (var i in this.missileCategories) {
                if (this.missileCategories[i]) {
                    list.push(i);
                }
            }
            return list;
        };
        return Selection;
    }());
    Utils.Selection = Selection;
    function ConvertGISDataTo3DSphere(GisData_lon, GisData_lat) {
        var rad = 100;
        var lon = GisData_lon - 90;
        var lat = GisData_lat;
        var phi = Math.PI / 2 - lat * Math.PI / 180;
        var theta = 2 * Math.PI - lon * Math.PI / 180;
        var center = new THREE.Vector3();
        center.x = Math.sin(phi) * Math.cos(theta) * rad;
        center.y = Math.cos(phi) * rad;
        center.z = Math.sin(phi) * Math.sin(theta) * rad;
        return center;
    }
    Utils.ConvertGISDataTo3DSphere = ConvertGISDataTo3DSphere;
    function CreateLineGeometry(points) {
        var geometry = new THREE.Geometry();
        for (var i = 0; i < points.length; i++) {
            geometry.vertices.push(points[i]);
        }
        return geometry;
    }
    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    Utils.randomInt = randomInt;
    var origin = new THREE.Vector3(0, 0, 0);
    function ConnectionLineGeometry(startPos, endPos, apogee) {
        var globeRadius = 100;
        var distance = endPos.clone().sub(startPos).length();
        var midHeight = globeRadius * apogee / 6378.137;
        var midLength = globeRadius + midHeight;
        var mid = startPos.clone().lerp(endPos, 0.5);
        mid.normalize();
        mid.multiplyScalar(midLength);
        var normal = (new THREE.Vector3()).subVectors(startPos, endPos);
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
        var startAnchor = startPos;
        var midStartAnchor = mid.clone().add(normal.clone().multiplyScalar(distanceOneThird));
        var midEndAnchor = mid.clone().add(normal.clone().multiplyScalar(-distanceOneThird));
        var endAnchor = endPos;
        var splineCurveA = new THREE.CubicBezierCurve3(startPos, startAnchor, midStartAnchor, mid);
        // splineCurveA.updateArcLengths();
        var splineCurveB = new THREE.CubicBezierCurve3(mid, midEndAnchor, endAnchor, endPos);
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
        points.push(origin);
        //	create a line geometry out of these
        var curveGeometry = CreateLineGeometry(points);
        curveGeometry.size = 15;
        return curveGeometry;
    }
    function BuildSphereDataVizGeometries(MoveDataList) {
        var rad = 100;
        var loadLayer = document.getElementById('loading');
        var lineArray = [];
        for (var _i = 0, MoveDataList_1 = MoveDataList; _i < MoveDataList_1.length; _i++) {
            var m = MoveDataList_1[_i];
            var startPos = new THREE.Vector3(m.startPos[0], m.startPos[1], m.startPos[2]);
            var endPos = new THREE.Vector3(m.endPos[0], m.endPos[1], m.endPos[2]);
            var randomHeight = randomInt(500, 1000);
            var line = ConnectionLineGeometry(startPos, endPos, randomHeight);
            lineArray.push(line);
        }
        loadLayer.style.display = 'none';
        return lineArray;
    }
    Utils.BuildSphereDataVizGeometries = BuildSphereDataVizGeometries;
    function long2tile(lon, zoom) {
        return (Math.floor((lon + 180) / 360 * Math.pow(2, zoom)));
    }
    Utils.long2tile = long2tile;
    function lat2tile(lat, zoom) {
        return (Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom)));
    }
    Utils.lat2tile = lat2tile;
    function tile2long(x, z) {
        return (x / Math.pow(2, z) * 360 - 180);
    }
    Utils.tile2long = tile2long;
    function tile2lat(y, z) {
        var n = Math.PI - 2 * Math.PI * y / Math.pow(2, z);
        return (180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))));
    }
    Utils.tile2lat = tile2lat;
    function measure(R, lat1, lon1, lat2, lon2) {
        var dLat = (lat2 - lat1) * Math.PI / 180;
        var dLon = (lon2 - lon1) * Math.PI / 180;
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d * 1000;
    }
    Utils.measure = measure;
    function lonOffsetMeter2lon(R, lon, lat, x) {
        return x / (R * Math.cos(lat)) + lon;
    }
    Utils.lonOffsetMeter2lon = lonOffsetMeter2lon;
    function latOffsetMeter2lat(R, lat, y) {
        return (y / R) + lat;
    }
    Utils.latOffsetMeter2lat = latOffsetMeter2lat;
    var geoTiles = {};
    var geoTileQueue = [];
    function getTileMesh(r, zoom, ytile, MAX_TILEMESH) {
        var id = 'tile_' + zoom + '_' + ytile;
        if (!(geoTiles.hasOwnProperty(id))) {
            geoTiles[id] = new THREE.Geometry();
            var myGeometry = geoTiles[id];
            geoTileQueue.push(id);
            if (geoTileQueue.length > MAX_TILEMESH) {
                delete geoTiles[geoTileQueue.shift()];
            }
            var lon1 = tile2long(0, zoom);
            var lat1 = tile2lat(ytile, zoom);
            var lon2 = tile2long(1, zoom);
            var lat2 = tile2lat(ytile + 1, zoom);
            /*************************
             *            ^ Y         *
             *            |           *
             *            |           *
             *            |           *
             *            -------> X  *
             *           /            *
             *          /             *
             *         / Z            *
             *************************/
            /***************************
             *       B        C         *
             *                          *
             *                          *
             *                          *
             *      A          D        *
             ***************************/
            var rUp = r * Math.cos(lat1 * Math.PI / 180);
            var rDown = r * Math.cos(lat2 * Math.PI / 180);
            var Ax = rDown * Math.sin(lon1 * Math.PI / 180);
            var Ay = r * Math.sin(lat2 * Math.PI / 180);
            var Az = rDown * Math.cos(lon1 * Math.PI / 180);
            var Bx = rUp * Math.sin(lon1 * Math.PI / 180);
            var By = r * Math.sin(lat1 * Math.PI / 180);
            var Bz = rUp * Math.cos(lon1 * Math.PI / 180);
            var Cx = rUp * Math.sin(lon2 * Math.PI / 180);
            var Cy = r * Math.sin(lat1 * Math.PI / 180);
            var Cz = rUp * Math.cos(lon2 * Math.PI / 180);
            var Dx = rDown * Math.sin(lon2 * Math.PI / 180);
            var Dy = r * Math.sin(lat2 * Math.PI / 180);
            var Dz = rDown * Math.cos(lon2 * Math.PI / 180);
            myGeometry.vertices.push(new THREE.Vector3(Ax, Ay, Az), new THREE.Vector3(Bx, By, Bz), new THREE.Vector3(Cx, Cy, Cz), new THREE.Vector3(Dx, Dy, Dz));
            myGeometry.faces.push(new THREE.Face3(0, 2, 1));
            myGeometry.faces.push(new THREE.Face3(0, 3, 2));
            myGeometry.faceVertexUvs[0].push([
                new THREE.Vector2(0.0, 0.0),
                new THREE.Vector2(1.0, 1.0),
                new THREE.Vector2(0.0, 1.0)
            ]);
            myGeometry.faceVertexUvs[0].push([
                new THREE.Vector2(0.0, 0.0),
                new THREE.Vector2(1.0, 0.0),
                new THREE.Vector2(1.0, 1.0)
            ]);
            myGeometry.uvsNeedUpdate = true;
        }
        return new THREE.Mesh(geoTiles[id]);
    }
    Utils.getTileMesh = getTileMesh;
    var textures = {};
    var textureQueue = [];
    function textureFactory(TILE_PROVIDER, MAX_TILEMESH, zoom_, xtile_, ytile_, onLoaded) {
        var id = 'tile_' + zoom_ + '_' + xtile_ + '_' + ytile_;
        var textureLoader = new THREE.TextureLoader();
        // textures[id] = {};
        if (!(textures.hasOwnProperty(id))) {
            var url = TILE_PROVIDER + '/' +
                zoom_ + '/' +
                ((zoom_ > 0) ? (xtile_ % Math.pow(2, zoom_)) : 0) + '/' +
                ((zoom_ > 0) ? (ytile_ % Math.pow(2, zoom_)) : 0) + '.png';
            textureLoader.load(url, function (texture) {
                textures[id] = texture;
                textureQueue.push(id);
                if (textureQueue.length > MAX_TILEMESH) {
                    delete textures[textureQueue.shift()];
                }
                onLoaded(texture);
            });
        }
        else {
            onLoaded(textures[id]);
        }
    }
    Utils.textureFactory = textureFactory;
})(Utils || (Utils = {}));
/* =========================================================================
 *
 *  System.ts
 *  game execute logical
 *
 * ========================================================================= */
/// <reference path="./Entity.ts" />
/// <reference path="./LoadData.ts" />
/// <reference path="./HashSet.ts" />
/// <reference path="./Utils.ts" />
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
        LoadingSystem.prototype.InitDataStructure = function (data, cityCode) {
            var data_2008_value = data.GET_STATS_DATA.STATISTICAL_DATA.DATA_INF.VALUE;
            var MovementBeforeNode = cityCode.MovementBeforeNode.Value;
            var MoveAfterNode = cityCode.MoveAfterNode.Value;
            var MovementBeforeNodeList = new Utils.HashSet();
            for (var _i = 0, MovementBeforeNode_1 = MovementBeforeNode; _i < MovementBeforeNode_1.length; _i++) {
                var mb = MovementBeforeNode_1[_i];
                MovementBeforeNodeList.set(mb.id, new ECS.JapanCityDataComponent(mb.id, +mb.lon, +mb.lat));
            }
            var MoveAfterNodeList = new Utils.HashSet();
            for (var _a = 0, MoveAfterNode_1 = MoveAfterNode; _a < MoveAfterNode_1.length; _a++) {
                var ma = MoveAfterNode_1[_a];
                MoveAfterNodeList.set(ma.id, new ECS.JapanCityDataComponent(ma.id, +ma.lon, +ma.lat));
            }
            var BeforeNotAllowedList = new Utils.HashSet();
            BeforeNotAllowedList.set("001", "001");
            BeforeNotAllowedList.set("049", "049");
            BeforeNotAllowedList.set("050", "050");
            BeforeNotAllowedList.set("051", "051");
            BeforeNotAllowedList.set("052", "052");
            var AfterNotAllowedList = new Utils.HashSet();
            AfterNotAllowedList.set("00999", "00999");
            AfterNotAllowedList.set("48000", "48000");
            AfterNotAllowedList.set("49000", "49000");
            AfterNotAllowedList.set("50000", "50000");
            AfterNotAllowedList.set("00413", "00413");
            AfterNotAllowedList.set("99000", "99000");
            AfterNotAllowedList.set("99100", "99100");
            var ConflictList = new Utils.HashSet();
            var MovementArray = new Array();
            for (var _b = 0, data_2008_value_1 = data_2008_value; _b < data_2008_value_1.length; _b++) {
                var d = data_2008_value_1[_b];
                var b = d["@cat01"];
                var a = d["@area"];
                var n = d["$"];
                //select data load
                if (b != "014")
                    continue;
                //not need data
                if (BeforeNotAllowedList.get(b) != undefined)
                    continue;
                if (AfterNotAllowedList.get(a) != undefined)
                    continue;
                if (n == "-")
                    continue;
                var before_data = MovementBeforeNodeList.get(b);
                var after_data = MoveAfterNodeList.get(a);
                if (before_data == undefined) {
                    if (ConflictList.get(b) == undefined) {
                        ConflictList.set(b, b);
                    }
                }
                if (after_data == undefined) {
                    if (ConflictList.get(a) == undefined) {
                        ConflictList.set(a, a);
                    }
                }
                var entity_move = new ECS.Entity("move_entity");
                entity_move.addComponent(new ECS.HumanMovementDataComponent(before_data.id, before_data.lon, before_data.lat, after_data.id, after_data.lon, after_data.lat));
                MovementArray.push(entity_move);
                //console.log("before cood:"+before_data.lon+","+before_data.lat);
                //console.log("after cood:"+after_data.lon+","+after_data.lat);
            }
            // for(let m of MovementArray){
            //     console.log("b:"+(<HumanMovementDataComponent>m.components.get("humanmove")).b_id+",a:"+(<HumanMovementDataComponent>m.components.get("humanmove")).a_id);
            // }
            ConflictList.forEach(function (f) {
                console.log("please check city code!need code:" + f);
            });
            return MovementArray;
        };
        LoadingSystem.prototype.Execute = function () {
            var _this = this;
            _super.prototype.Execute.call(this);
            // var mapImage = new Image();
            // mapImage.src = './images/2_no_clouds_4k.jpg';
            //console.log("load image data finished!");
            // Utils.loadData('./data/tip.json', <JsonDataComponent>this.entities.get("tip_entity").components.get("jsondata"), function () {
            //     console.log("load tip data finished!");
            //     Utils.loadData('./data/country.json', <JsonDataComponent>this.entities.get("country_entity").components.get("jsondata"), function () {
            //         console.log("load country data finished!");
            //         Utils.loadData('./data/missile.json', <JsonDataComponent>this.entities.get("missile_entity").components.get("jsondata"), function () {
            //             console.log("load missile data finished!");
            //             Utils.loadData('./data/history.json', <JsonDataComponent>this.entities.get("history_entity").components.get("jsondata"), function () {
            //                 console.log("load history data finished!");
            //                 var timeBins = JSON.parse((<JsonDataComponent>this.entities.get("history_entity").components.get("jsondata")).data).timeBins;
            //                 var missileLookup = JSON.parse((<JsonDataComponent>this.entities.get("missile_entity").components.get("jsondata")).data);
            //                 var latlonData = JSON.parse((<JsonDataComponent>this.entities.get("country_entity").components.get("jsondata")).data);
            //                 let entity_GlobalData = new ECS.Entity("global_entity");
            //                 let global_data = new Utils.HashSet<any>();
            //                 var outcomeLookup = {
            //                     'success': 'Success',
            //                     'failure': 'Failure',
            //                     'unknown': 'Unknown'
            //                 };
            //                 var missileColors = {
            //                     'er-scud': 0x1A62A5,
            //                     'hwasong-12': 0x6C6C6C,
            //                     'hwasong-14': 0xAEB21A,
            //                     'hwasong-15': 0x1DB2C4,
            //                     'kn-02': 0xB68982,
            //                     'musudan': 0x9FBAE3,
            //                     'nodong': 0xFD690F,
            //                     'polaris-1': 0xFEAE65,
            //                     'polaris-2': 0xDA5CB6,
            //                     'scud-b': 0x279221,
            //                     'scud-b-marv': 0xD2D479,
            //                     'scud-c': 0x89DC78,
            //                     'scud-c-marv': 0xBBBBBB,
            //                     'taepodong-1': 0xCA0F1E,
            //                     'unha': 0x814EAF,
            //                     'unha-3': 0xB89FCB,
            //                     'unknown': 0x78433B
            //                 };
            //                 global_data.set("timeBins", timeBins);
            //                 global_data.set("missileLookup", missileLookup);
            //                 global_data.set("latlonData", latlonData);
            //                 global_data.set("outcomeLookup", outcomeLookup);
            //                 global_data.set("missileColors", missileColors);
            //                 entity_GlobalData.addComponent(new ECS.GlobalComponent(global_data));
            //                 let threejs_system = new ECS.ThreeJsSystem();
            //                 let eventlistener_system = new ECS.EventListenerSystem();
            //                 let other_systems = new Utils.HashSet<System>();
            //                 other_systems.set(threejs_system.name, threejs_system);
            //                 other_systems.set(eventlistener_system.name, eventlistener_system);
            //                 let main_system = new ECS.MainSystem(entity_GlobalData, other_systems);
            //                 main_system.Execute();
            //             });
            //         });
            //     });
            // });
            Utils.loadData('./data/citycode.json', this.entities.get("citycode_entity").components.get("jsondata"), function () {
                Utils.loadData('./data/0003008383.json', _this.entities.get("2008data_entity").components.get("jsondata"), function () {
                    var cityCode = JSON.parse(_this.entities.get("citycode_entity").components.get("jsondata").data);
                    var data_2008 = JSON.parse(_this.entities.get("2008data_entity").components.get("jsondata").data);
                    var moveData = _this.InitDataStructure(data_2008, cityCode);
                    var entity_GlobalData = new ECS.Entity("global_entity");
                    var global_data = new Utils.HashSet();
                    global_data.set("moveData", moveData);
                    entity_GlobalData.addComponent(new ECS.GlobalComponent(global_data));
                    var threejs_system = new ECS.ThreeJsSystem();
                    var eventlistener_system = new ECS.EventListenerSystem();
                    var other_systems = new Utils.HashSet();
                    other_systems.set(threejs_system.name, threejs_system);
                    other_systems.set(eventlistener_system.name, eventlistener_system);
                    var main_system = new ECS.MainSystem(entity_GlobalData, other_systems);
                    main_system.Execute();
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
            _this.MainSystem = _this;
            return _this;
        }
        MainSystem.prototype.Execute = function () {
            _super.prototype.Execute.call(this);
            var g = this.GlobalDatas;
            var m = this.MainSystem;
            this.OtherSystems.forEach(function (key, val) {
                val.GlobalDatas = g;
                val.MainSystem = m;
                val.Execute();
            });
        };
        return MainSystem;
    }(System));
    ECS.MainSystem = MainSystem;
    var ThreeJsSystem = /** @class */ (function (_super) {
        __extends(ThreeJsSystem, _super);
        function ThreeJsSystem() {
            var _this = _super.call(this, "threejs") || this;
            _this.animate = function () {
                _this.AnimeUpdate();
                _this.render();
                requestAnimationFrame(_this.animate);
                var stats = _this.GlobalParams.get("stats");
                stats.update();
                _this.GlobalParams.get("rotating").traverse(function (mesh) {
                    if (mesh.update !== undefined) {
                        mesh.update();
                    }
                });
            };
            _this.GlobalParams = new Utils.HashSet();
            return _this;
        }
        ThreeJsSystem.prototype.wrap = function (value, min, rangeSize) {
            rangeSize -= min;
            while (value < min) {
                value += rangeSize;
            }
            return value % rangeSize;
        };
        ThreeJsSystem.prototype.getVisualizedMesh = function (linearData, year, outcomeCategories, missileCategories, missileColors) {
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
                    var particleSize = set.lineGeometry.size * this.GlobalParams.get("dpr");
                    if (set === this.GlobalParams.get("selectedTest")) {
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
                    var summary = this.GlobalParams.get("summary");
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
                    this.GlobalParams.set("summary", summary);
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
        };
        ThreeJsSystem.prototype.GetVisualizedMesh = function (lineArray) {
            var linesGeo = new THREE.Geometry();
            var lineColors = [];
            var particlesGeo = new THREE.BufferGeometry();
            var particlePositions = [];
            var particleSizes = [];
            var particleColors = [];
            var randomColor = [0x1A62A5, 0x6C6C6C, 0xAEB21A, 0x1DB2C4, 0xB68982, 0x9FBAE3, 0xFD690F, 0xFEAE65, 0xDA5CB6, 0x279221, 0xD2D479, 0x89DC78, 0xBBBBBB, 0xCA0F1E, 0x814EAF, 0xB89FCB, 0x78433B];
            particlesGeo.vertices = [];
            //	go through the data from year, and find all relevant geometries
            for (var _i = 0, lineArray_1 = lineArray; _i < lineArray_1.length; _i++) {
                var l = lineArray_1[_i];
                var randomIndex = Utils.randomInt(0, 15);
                var lineColor = new THREE.Color(randomColor[randomIndex]);
                var lastColor;
                //	grab the colors from the vertices
                for (var _a = 0, _b = l.vertices; _a < _b.length; _a++) {
                    var s_2 = _b[_a];
                    var v = l.vertices[s_2];
                    lineColors.push(lineColor);
                    lastColor = lineColor;
                }
                //	merge it all together
                linesGeo.merge(l);
                var particleColor = lastColor.clone();
                var points = l.vertices;
                var particleCount = 1;
                var particleSize = l.size * this.GlobalParams.get("dpr");
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
            return splineOutline;
        };
        ThreeJsSystem.prototype.getHistoricalData = function (timeBins) {
            var history = [];
            var selectionData = this.GlobalParams.get("selectionData");
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
        };
        ThreeJsSystem.prototype.selectVisualization = function (missileLookup, facilityData, testData, linearData, year, tests, outcomeCategories, missileCategories, missileColors) {
            var cName = tests[0].toUpperCase();
            $("#hudButtons .testTextInput").val(cName);
            var previouslySelectedTest = this.GlobalParams.get("selectedTest");
            this.GlobalParams.set("selectedTest", testData[tests[0].toUpperCase()]);
            var summary = {
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
                historical: this.getHistoricalData(linearData)
            };
            for (var i in missileLookup) {
                summary.success[i] = 0;
                summary.failure[i] = 0;
                summary.unknown[i] = 0;
            }
            this.GlobalParams.set("summary", summary);
            var visualizationMesh = this.GlobalParams.get("visualizationMesh");
            //	clear children
            while (visualizationMesh.children.length > 0) {
                var c = visualizationMesh.children[0];
                visualizationMesh.remove(c);
            }
            //	build the mesh
            var mesh = this.getVisualizedMesh(linearData, year, outcomeCategories, missileCategories, missileColors);
            //	add it to scene graph
            visualizationMesh.add(mesh);
            this.GlobalParams.set("visualizationMesh", visualizationMesh);
            var EventListenerGlobeParam = this.MainSystem.OtherSystems.get("eventlistener").GlobalParams;
            if (previouslySelectedTest !== this.GlobalParams.get("selectedTest")) {
                if (this.GlobalParams.get("selectedTest")) {
                    var facility = facilityData[this.GlobalParams.get("selectedTest").facility];
                    var landing = this.GlobalParams.get("selectedTest").landingLocation;
                    EventListenerGlobeParam.set("rotateTargetX", (facility.lat + landing.lat) / 2 * Math.PI / 180);
                    //var targetY0 = -((facility.lon + landing.lon) / 2 ) * Math.PI / 180;
                    // var piCounter = 0;
                    // while (true) {
                    //     var targetY0Neg = targetY0 - Math.PI * 2 * piCounter;
                    //     var targetY0Pos = targetY0 + Math.PI * 2 * piCounter;
                    //     if (Math.abs(targetY0Neg - this.GlobalParams.get("rotating").rotation.y) < Math.PI) {
                    //         EventListenerGlobeParam.set("rotateTargetY", targetY0Neg);
                    //         break;
                    //     } else if (Math.abs(targetY0Pos - this.GlobalParams.get("rotating").rotation.y) < Math.PI) {
                    //         EventListenerGlobeParam.set("rotateTargetY", targetY0Pos);
                    //         break;
                    //     }
                    //     piCounter++;
                    //     EventListenerGlobeParam.set("rotateTargetY", this.wrap(targetY0, -Math.PI, Math.PI));
                    // }
                    this.GlobalParams.set("targetPos", [(facility.lat + landing.lat) / 2, (facility.lon + landing.lon) / 2]);
                    // EventListenerGlobeParam.set("rotateVX", EventListenerGlobeParam.get("rotateVX") * 0.6);
                    // EventListenerGlobeParam.set("rotateVY", EventListenerGlobeParam.get("rotateVY") * 0.6);
                    // EventListenerGlobeParam.set("scaleTarget", 90 / (landing.center.clone().sub(facility.center).length() + 30));
                }
            }
            //d3Graphs.initGraphs();
        };
        ThreeJsSystem.prototype.VisualizationLine = function (lineArray) {
            var visualizationMesh = this.GlobalParams.get("visualizationMesh");
            //	clear children
            while (visualizationMesh.children.length > 0) {
                var c = visualizationMesh.children[0];
                visualizationMesh.remove(c);
            }
            //	build the mesh
            var mesh = this.GetVisualizedMesh(lineArray);
            //	add it to scene graph
            visualizationMesh.add(mesh);
            this.GlobalParams.set("visualizationMesh", visualizationMesh);
            //d3Graphs.initGraphs();
        };
        ThreeJsSystem.prototype.UpdateOSMTile = function (p_lon, p_lat, zoom) {
            var xtile = Utils.long2tile(p_lon, zoom);
            var ytile = Utils.lat2tile(p_lat, zoom);
            var osmSwitch = this.GlobalParams.get("osmSwitch");
            var tiles = {};
            var nextMinXtile, nextMaxXtile;
            var rotating = this.GlobalParams.get("rotating");
            var tileGroup = this.GlobalParams.get("tileGroup");
            var tileGroups = this.GlobalParams.get("tileGroups");
            var ZOOM_MIN = this.GlobalParams.get("ZOOM_MIN");
            var ZOOM_SHIFT_SIZE = this.GlobalParams.get("ZOOM_SHIFT_SIZE");
            var MAX_TILEMESH = this.GlobalParams.get("MAX_TILEMESH");
            var TILE_PROVIDER = this.GlobalParams.get("TILE_PROVIDER");
            var radius = this.GlobalParams.get("radius");
            rotating.remove(tileGroups);
            tileGroups = new THREE.Object3D(); //create an empty container
            rotating.add(tileGroups);
            //console.log('zoom_ start:', Math.max(zoom, ZOOM_MIN));
            //console.log('zoom_ end:', Math.max(zoom - ZOOM_SHIFT_SIZE, ZOOM_MIN) + 1);
            if (osmSwitch) {
                for (var zoom_ = Math.max(zoom, ZOOM_MIN); zoom_ > Math.max(zoom - ZOOM_SHIFT_SIZE, ZOOM_MIN); zoom_--) {
                    var zShift = zoom - zoom_;
                    tileGroup[zShift] = new THREE.Object3D();
                    tileGroups.add(tileGroup[zShift]);
                    // var zoom_ = zoom - zShift;
                    if (zoom_ < 0 && zShift > 0) {
                        continue;
                    }
                    var size = 2;
                    var factor = Math.pow(2, zShift);
                    var xtile_ = Math.floor(xtile / factor);
                    var ytile_ = Math.floor(ytile / factor);
                    if (zoom < 8) {
                        var size = 2;
                    }
                    else if (zoom < 10) {
                        var size = 2;
                    }
                    else {
                        size = 1;
                    }
                    var minXtile = Math.floor((xtile_ - (Math.pow(2, (size - 1)) - 1)) / 2) * 2;
                    var maxXtile = Math.floor((xtile_ + (Math.pow(2, (size - 1)) - 1)) / 2) * 2 + 1;
                    var minYtile = Math.floor((ytile_ - (Math.pow(2, (size - 1)) - 1)) / 2) * 2;
                    var maxYtile = Math.floor((ytile_ + (Math.pow(2, (size - 1)) - 1)) / 2) * 2 + 1;
                    if (minXtile < 0 && maxXtile >= 0) {
                        var minXOffset = Math.abs(minXtile) % 32;
                        var realMinX = 32 - minXOffset;
                        var realMaxX = 32 + maxXtile;
                        minXtile = realMinX;
                        maxXtile = realMaxX;
                    }
                    else if (minXtile < 0 && maxXtile < 0) {
                        var minXOffset = Math.abs(minXtile) % 32;
                        var realMinX = 32 - minXOffset;
                        var maxXOffset = Math.abs(maxXtile) % 32;
                        var realMaxX = 32 - maxXOffset;
                        minXtile = realMinX;
                        maxXtile = realMaxX;
                    }
                    // console.log({
                    //     'zoom_': zoom_,
                    //     'xtile_': xtile_,
                    //     'ytile_': ytile_,
                    //     'minXtile': minXtile,
                    //     'maxXtile': maxXtile,
                    //     'minYtile': minYtile,
                    //     'maxYtile': maxYtile,
                    //     'lon':p_lon,
                    //     'p_lat':p_lat
                    // })
                    var modulus = (zoom_ > 0) ? Math.pow(2, zoom_) : 0;
                    for (var atile = minXtile; atile <= maxXtile; atile++) {
                        for (var btile = minYtile; btile <= maxYtile; btile++) {
                            var lon1 = Utils.tile2long(atile, zoom_);
                            var lat1 = Utils.tile2lat(btile, zoom_);
                            var lon2 = Utils.tile2long(atile + 1, zoom_);
                            var lat2 = Utils.tile2lat(btile + 1, zoom_);
                            var lat = (lat1 + lat2) / 2;
                            var lon = (lon1 + lon2) / 2;
                            var widthUp = Utils.measure(radius, lat1, lon1, lat1, lon2);
                            var widthDown = Utils.measure(radius, lat2, lon1, lat2, lon2);
                            var widthSide = Utils.measure(radius, lat1, lon1, lat2, lon1);
                            var id = 'z_' + zoom_ + '_' + atile + "_" + btile;
                            for (var zzz = 1; zzz <= 2; zzz++) {
                                var idNext = 'z_' + (zoom_ - zzz) + '_' + Math.floor(atile / Math.pow(2, zzz)) + "_" + Math.floor(btile / Math.pow(2, zzz));
                                tiles[idNext] = {};
                            }
                            if (!tiles.hasOwnProperty(id)) {
                                var tileEarth = new THREE.Object3D(); //create an empty container
                                tileEarth.rotation.set(0, (lon1 + 180) * Math.PI / 180, 0);
                                tileGroup[zShift].add(tileEarth);
                                var tileMesh = Utils.getTileMesh(radius, zoom_, btile, MAX_TILEMESH);
                                tileEarth.add(tileMesh);
                                (function (yourTileMesh, yourZoom, yourXtile, yourYtile) {
                                    var onLoaded = function (texture) {
                                        // MeshFaceMaterial
                                        yourTileMesh.material = new THREE.MeshBasicMaterial({
                                            map: texture
                                        });
                                    };
                                    Utils.textureFactory(TILE_PROVIDER, MAX_TILEMESH, yourZoom, yourXtile, yourYtile, onLoaded);
                                })(tileMesh, zoom_, atile % modulus, btile % modulus);
                            }
                        }
                    }
                }
            }
            this.GlobalParams.set("xtile", xtile);
            this.GlobalParams.set("ytile", ytile);
            this.GlobalParams.set("rotating", rotating);
            this.GlobalParams.set("tileGroups", tileGroups);
            this.GlobalParams.set("tileGroup", tileGroup);
        };
        ThreeJsSystem.prototype.initUi = function () {
            var GlobalParams = this.GlobalParams;
            var osmSwitch = GlobalParams.get("osmSwitch");
            var earthParam = {
                NightView: true,
                LoadOSM: osmSwitch
            };
            GlobalParams.set("earthParam", earthParam);
            var gui = new dat.GUI();
            function guiChanged() {
                var camera = GlobalParams.get("camera");
                var renderer = GlobalParams.get("renderer");
                var scene = GlobalParams.get("scene");
                var nighttexture = GlobalParams.get("earthParam").NightView;
                var osmSwitchNow = GlobalParams.get("earthParam").LoadOSM;
                var earthSphere = GlobalParams.get("earthSphere");
                if (nighttexture) {
                    earthSphere.material.map = new THREE.TextureLoader().load('./images/nightearth2016.jpg');
                    earthSphere.material.needsUpdate = true;
                }
                else {
                    earthSphere.material.map = new THREE.TextureLoader().load('./images/2_no_clouds_4k.jpg');
                    earthSphere.material.needsUpdate = true;
                }
                if (osmSwitchNow)
                    GlobalParams.set("osmSwitch", true);
                else
                    GlobalParams.set("osmSwitch", false);
                GlobalParams.set("earthSphere", earthSphere);
                renderer.render(scene, camera);
            }
            gui.add(earthParam, "NightView", false).onChange(guiChanged);
            gui.add(earthParam, "LoadOSM", true).onChange(guiChanged);
            guiChanged();
        };
        ThreeJsSystem.prototype.InitThreeJs = function () {
            var glContainer = document.getElementById('glContainer');
            var dpr = window.devicePixelRatio ? window.devicePixelRatio : 1;
            this.GlobalParams.set("dpr", dpr);
            this.GlobalParams.set("selectedTest", null);
            var selectableTests = [];
            //osm tile groups
            var TILE_PROVIDER = 'https://a.tile.openstreetmap.org';
            var ZOOM_SHIFT_SIZE = 10;
            var ZOOM_MIN = 5;
            var MAX_TILEMESH = 500;
            var tileGroup = [];
            var tileGroups;
            //Global Data
            var global_data = this.GlobalDatas.components.get("global").data;
            // var latlonData = global_data.get("latlonData");
            // var missileLookup = global_data.get("missileLookup");
            // var timeBins = global_data.get("timeBins");
            // var outcomeLookup = global_data.get("outcomeLookup");
            // var missileColors = global_data.get("missileColors");
            var moveData = global_data.get("moveData");
            var scene = new THREE.Scene();
            scene.matrixAutoUpdate = false;
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
            var rotating = new THREE.Object3D();
            scene.add(rotating);
            var mapMaterial = new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load('./images/2_no_clouds_4k.jpg'),
                polygonOffset: true,
                polygonOffsetFactor: 1,
                polygonOffsetUnits: 1
            });
            // var mapMaterial = new THREE.MeshPhongMaterial({
            //     map: new THREE.TextureLoader().load('./images/2_no_clouds_4k.jpg'),
            //     bumpMap: new THREE.TextureLoader().load('./images/elev_bump_4k.jpg'),
            //     bumpScale: 0.005,
            //     specularMap: new THREE.TextureLoader().load('./images/water_4k.png'),
            //     specular: new THREE.Color('grey'),
            //     polygonOffset: true,
            //     polygonOffsetFactor: 1,
            //     polygonOffsetUnits: 1
            // })
            var radius = 100;
            var segments = 40;
            var sphere = new THREE.Mesh(new THREE.SphereGeometry(radius - 1, segments, segments), mapMaterial);
            sphere.doubleSided = false;
            sphere.rotation.x = Math.PI;
            sphere.rotation.y = -Math.PI / 2;
            sphere.rotation.z = Math.PI;
            sphere.id = "base";
            rotating.add(sphere);
            //map index
            var lookupCanvas = document.createElement('canvas');
            lookupCanvas.width = 256;
            lookupCanvas.height = 1;
            var lookupTexture = new THREE.Texture(lookupCanvas);
            lookupTexture.magFilter = THREE.NearestFilter;
            lookupTexture.minFilter = THREE.NearestFilter;
            lookupTexture.needsUpdate = true;
            var indexedMapTexture = new THREE.TextureLoader().load('./images/map_indexed.png');
            indexedMapTexture.needsUpdate = true;
            indexedMapTexture.magFilter = THREE.NearestFilter;
            indexedMapTexture.minFilter = THREE.NearestFilter;
            //clouds
            var cloudsMesh = new THREE.Mesh(new THREE.SphereGeometry(radius + 1, segments, segments), new THREE.MeshPhongMaterial({
                map: new THREE.TextureLoader().load('./images/fair_clouds_4k.png'),
                transparent: true
            }));
            rotating.add(cloudsMesh);
            //load history data
            // for (var i in timeBins) {
            //     var bin = timeBins[i].data;
            //     for (var s in bin) {
            //         var set = bin[s];
            //         var seriesPostfix = set.series ? ' [' + set.series + ']' : '';
            //         var testName = (set.date + ' ' + missileLookup[set.missile].name + seriesPostfix).toUpperCase();
            //         selectableTests.push(testName);
            //     }
            // }
            var wireframeGeo = new THREE.EdgesGeometry(sphere.geometry, 0.3);
            var wireframeMaterial = new THREE.LineBasicMaterial({
                color: Math.random() * 0xffffff,
                linewidth: 0.5
            });
            var wireframe = new THREE.LineSegments(wireframeGeo, wireframeMaterial);
            //sphere.add(wireframe);
            var atmosphereMaterial = new THREE.ShaderMaterial({
                vertexShader: document.getElementById('vertexShaderAtmosphere').textContent,
                fragmentShader: document.getElementById('fragmentShaderAtmosphere').textContent,
                side: THREE.BackSide
            });
            var atmosphere = new THREE.Mesh(sphere.geometry.clone(), atmosphereMaterial);
            atmosphere.scale.x = atmosphere.scale.y = atmosphere.scale.z = 1.8;
            rotating.add(atmosphere);
            //country coordinates
            //var facilityData = Utils.loadGeoData(latlonData);
            //convert gis data to 3d sphere data
            var moveDataForSphere = new Array();
            for (var _i = 0, moveData_1 = moveData; _i < moveData_1.length; _i++) {
                var m = moveData_1[_i];
                var current_humanmove = m.components.get("humanmove");
                //console.log("b:" + (<HumanMovementDataComponent>m.components.get("humanmove")).b_id + ",a:" + (<HumanMovementDataComponent>m.components.get("humanmove")).a_id);
                var start_lon = current_humanmove.b_lon;
                var start_lat = current_humanmove.b_lat;
                var end_lon = current_humanmove.a_lon;
                var end_lat = current_humanmove.a_lat;
                //console.log(start_lon,start_lat);
                //console.log(end_lon,end_lat);
                var start_pos = Utils.ConvertGISDataTo3DSphere(start_lon, start_lat);
                var end_pos = Utils.ConvertGISDataTo3DSphere(end_lon, end_lat);
                moveDataForSphere.push(new ECS.ThreeJsMoveEntity([start_pos.x, start_pos.y, start_pos.z], [end_pos.x, end_pos.y, end_pos.z]));
            }
            //data visual
            //var vizilines = Utils.buildDataVizGeometries(timeBins, missileLookup, facilityData);
            var lineArray = Utils.BuildSphereDataVizGeometries(moveDataForSphere);
            var visualizationMesh = new THREE.Object3D();
            this.GlobalParams.set("visualizationMesh", visualizationMesh);
            rotating.add(visualizationMesh);
            // var latestBin = timeBins[timeBins.length - 1];
            // var selectedYear = latestBin.year;
            // var latestTest = latestBin.data[latestBin.data.length - 1];
            // var selectedTestName = latestTest.testName;
            // var selectionData = new Utils.Selection(selectedYear, selectedTestName, missileLookup, outcomeLookup);
            // this.GlobalParams.set("selectionData", selectionData);
            this.GlobalParams.set("rotating", rotating);
            //this.selectVisualization(missileLookup, facilityData, vizilines, timeBins, selectedYear, [selectedTestName], Object.keys(outcomeLookup), Object.keys(missileLookup), missileColors);
            this.VisualizationLine(lineArray);
            //	-----------------------------------------------------------------------------
            //	Setup renderer
            var renderer = new THREE.WebGLRenderer({ antialias: false });
            renderer.setPixelRatio(dpr);
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.autoClear = false;
            renderer.sortObjects = false;
            renderer.generateMipmaps = false;
            //event listener
            //(<EventListenerSystem>(<MainSystem>this.MainSystem).OtherSystems.get("eventlistener")).InitEventListener();
            //	-----------------------------------------------------------------------------
            //	Setup camera
            var aspect = window.innerWidth / window.innerHeight;
            var camera = new THREE.PerspectiveCamera(12 / Math.min(aspect, 1), aspect, 1, 20000);
            camera.up.set(0, 0, 1);
            camera.position.z = 800;
            camera.position.y = 0;
            camera.lookAt(scene.position);
            camera.zoom = 0.5;
            scene.add(camera);
            var controls = new THREE.EarthControls(camera, renderer.domElement);
            glContainer.appendChild(renderer.domElement);
            var stats = new Stats();
            glContainer.appendChild(stats.dom);
            this.GlobalParams.set("scene", scene);
            this.GlobalParams.set("zoom", 0);
            this.GlobalParams.set("controls", controls);
            this.GlobalParams.set("lonStamp", 0);
            this.GlobalParams.set("latStamp", 0);
            this.GlobalParams.set("camera", camera);
            this.GlobalParams.set("renderer", renderer);
            this.GlobalParams.set("cloudsMesh", cloudsMesh);
            this.GlobalParams.set("tileGroup", tileGroup);
            this.GlobalParams.set("tileGroups", tileGroups);
            this.GlobalParams.set("ZOOM_SHIFT_SIZE", ZOOM_SHIFT_SIZE);
            this.GlobalParams.set("ZOOM_MIN", ZOOM_MIN);
            this.GlobalParams.set("MAX_TILEMESH", MAX_TILEMESH);
            this.GlobalParams.set("TILE_PROVIDER", TILE_PROVIDER);
            this.GlobalParams.set("radius", radius);
            this.GlobalParams.set("earthSphere", sphere);
            this.GlobalParams.set("osmSwitch", false);
            this.GlobalParams.set("stats", stats);
            this.GlobalParams.set("timeLast", Date.now());
        };
        ThreeJsSystem.prototype.render = function () {
            this.GlobalParams.get("renderer").clear();
            this.GlobalParams.get("renderer").render(this.GlobalParams.get("scene"), this.GlobalParams.get("camera"));
        };
        ThreeJsSystem.prototype.AnimeUpdate = function () {
            var camera = this.GlobalParams.get("camera");
            var renderer = this.GlobalParams.get("renderer");
            var scene = this.GlobalParams.get("scene");
            var cloudMesh = this.GlobalParams.get("cloudsMesh");
            var EventListenerGlobalParams = this.MainSystem.OtherSystems.get("eventlistener").GlobalParams;
            var rotateVX = EventListenerGlobalParams.get("rotateVX");
            var rotateVY = EventListenerGlobalParams.get("rotateVY");
            var rotateX = EventListenerGlobalParams.get("rotateX");
            var rotateY = EventListenerGlobalParams.get("rotateY");
            var rotateTargetX = EventListenerGlobalParams.get("rotateTargetX");
            var rotateTargetY = EventListenerGlobalParams.get("rotateTargetY");
            var dragging = EventListenerGlobalParams.get("dragging");
            var rotateXMax = EventListenerGlobalParams.get("rotateXMax");
            var tiltTarget = EventListenerGlobalParams.get("tiltTarget");
            var tilt = EventListenerGlobalParams.get("tilt");
            var scaleTarget = EventListenerGlobalParams.get("scaleTarget");
            var rotating = this.GlobalParams.get("rotating");
            var osmTile = this.GlobalParams.get("osmTile");
            var ZOOM_MIN = this.GlobalParams.get("ZOOM_MIN");
            var ZOOM_SHIFT_SIZE = this.GlobalParams.get("ZOOM_SHIFT_SIZE");
            var oldZoom = this.GlobalParams.get("zoom");
            var zoom = this.GlobalParams.get("zoom");
            var controls = this.GlobalParams.get("controls");
            var targetPos = this.GlobalParams.get("targetPos");
            this.GlobalParams.set("timeNow", Date.now());
            cloudMesh.rotation.y += (1 / 16 * (this.GlobalParams.get("timeNow") - this.GlobalParams.get("timeLast"))) / 1000;
            // if (rotateTargetX !== undefined && rotateTargetY !== undefined) {
            //     rotateVX += (rotateTargetX - rotateX) * 0.012;
            //     rotateVY += (rotateTargetY - rotateY) * 0.012;
            //     if (Math.abs(rotateTargetX - rotateX) < 0.02 && Math.abs(rotateTargetY - rotateY) < 0.02) {
            //         rotateTargetX = undefined;
            //         rotateTargetY = undefined;
            //     }
            //     rotateX += rotateVX;
            //     rotateY += rotateVY;
            //     rotateVX *= 0.98;
            //     rotateVY *= 0.98;
            //     if (dragging || rotateTargetX !== undefined) {
            //         rotateVX *= 0.6;
            //         rotateVY *= 0.6;
            //     }
            //     if (rotateX < -rotateXMax) {
            //         rotateX = -rotateXMax;
            //         rotateVX *= -0.95;
            //     }
            //     if (rotateX > rotateXMax) {
            //         rotateX = rotateXMax;
            //         rotateVX *= -0.95;
            //     }
            //     //rotating.rotation.x = rotateX;
            //     //rotating.rotation.y = rotateY;
            //     // controls.rotateLeft(rotateVY*180/Math.PI);
            //     // controls.rotateUp(rotateVX*180/Math.PI);
            //     // controls.update();
            // }
            // if (rotateTargetX !== undefined) {
            //     var dLat = (controls.getLatitude() - targetPos[0]) * Math.PI / 180;
            //     var dLon = (controls.getLongitude() - targetPos[1]) * Math.PI / 180;
            //     // if (dLat > 0.02)
            //     //     controls.panUp(dLat);
            //     // else
            //     controls.panLeft(-dLat*1.5);
            //     controls.panUp(-dLon*1.5);
            //     if (Math.abs(dLat) < 0.02 && Math.abs(dLon) < 0.02) rotateTargetX = undefined;
            // }
            // if (scaleTarget !== undefined) {
            //     //camera.zoom *= Math.pow(scaleTarget / camera.zoom, 0.012);
            //     //camera.updateProjectionMatrix();
            //     controls.zoomCamera(scaleTarget);
            //     if (Math.abs(Math.log(scaleTarget / camera.zoom)) < 0.05) {
            //         scaleTarget = undefined;
            //     }
            // }
            var dist = new THREE.Vector3().copy(controls.object.position).sub(controls.target).length();
            var zoom = Math.floor(Math.max(Math.min(Math.floor(15 - Math.log2(dist)), ZOOM_MIN + ZOOM_SHIFT_SIZE), ZOOM_MIN));
            var latStamp = this.GlobalParams.get("latStamp");
            var lonStamp = this.GlobalParams.get("lonStamp");
            var xtile = this.GlobalParams.get("xtile");
            var ytile = this.GlobalParams.get("ytile");
            if (lonStamp != controls.getLongitude() || latStamp != controls.getLatitude()) {
                lonStamp = controls.getLongitude();
                latStamp = controls.getLatitude();
                rotating.rotation.set(latStamp * Math.PI / 180, (-lonStamp) * Math.PI / 180, 0);
                var oldXtile = xtile;
                var oldYtile = ytile;
                xtile = Utils.long2tile(lonStamp, zoom);
                ytile = Utils.lat2tile(latStamp, zoom);
                if (Math.abs(oldXtile - xtile) >= 1 ||
                    Math.abs(oldYtile - ytile) >= 1) {
                    this.UpdateOSMTile(lonStamp, latStamp, zoom);
                }
            }
            else if (Math.abs(zoom - oldZoom) >= 1) {
                this.UpdateOSMTile(lonStamp, latStamp, zoom);
            }
            this.GlobalParams.set("zoom", zoom);
            this.GlobalParams.set("latStamp", latStamp);
            this.GlobalParams.set("lonStamp", lonStamp);
            this.GlobalParams.set("xtile", xtile);
            this.GlobalParams.set("ytile", ytile);
            this.GlobalParams.set("timeLast", Date.now());
            EventListenerGlobalParams.set("rotateTargetX", rotateTargetX);
            EventListenerGlobalParams.set("rotateTargetY", rotateTargetY);
            EventListenerGlobalParams.set("rotateX", rotateX);
            EventListenerGlobalParams.set("rotateY", rotateY);
            EventListenerGlobalParams.set("rotateVY", rotateVY);
            EventListenerGlobalParams.set("rotateVX", rotateVX);
            EventListenerGlobalParams.set("tilt", tilt);
            EventListenerGlobalParams.set("tiltTarget", tiltTarget);
            EventListenerGlobalParams.set("scaleTarget", scaleTarget);
            this.GlobalParams.set("controls", controls);
            this.GlobalParams.set("rotating", rotating);
            this.GlobalParams.set("osmTile", osmTile);
            this.GlobalParams.set("camera", camera);
        };
        ThreeJsSystem.prototype.Execute = function () {
            _super.prototype.Execute.call(this);
            //console.log("three.js main system:"+this.MainSystem.name);
            this.InitThreeJs();
            this.initUi();
            this.animate();
        };
        return ThreeJsSystem;
    }(System));
    ECS.ThreeJsSystem = ThreeJsSystem;
    var EventListenerSystem = /** @class */ (function (_super) {
        __extends(EventListenerSystem, _super);
        function EventListenerSystem() {
            var _this = _super.call(this, "eventlistener") || this;
            _this.GlobalParams = new Utils.HashSet();
            var mouseX = 0, mouseY = 0, pmouseX = 0, pmouseY = 0;
            var pressX = 0, pressY = 0;
            var pscale = 0;
            _this.GlobalParams.set("mouseX", mouseX);
            _this.GlobalParams.set("mouseY", mouseY);
            _this.GlobalParams.set("pmouseX", pmouseX);
            _this.GlobalParams.set("pmouseY", pmouseY);
            _this.GlobalParams.set("pressX", pressX);
            _this.GlobalParams.set("pressY", pressY);
            _this.GlobalParams.set("pscale", pscale);
            var dragging = false;
            var touchEndTime = 0;
            _this.GlobalParams.set("dragging", dragging);
            _this.GlobalParams.set("touchEndTime", touchEndTime);
            var rotateX = 0, rotateY = 0;
            var rotateVX = 0, rotateVY = 0;
            var rotateXMax = 90 * Math.PI / 180;
            _this.GlobalParams.set("rotateX", rotateX);
            _this.GlobalParams.set("rotateY", rotateY);
            _this.GlobalParams.set("rotateVX", rotateVX);
            _this.GlobalParams.set("rotateVY", rotateVY);
            _this.GlobalParams.set("rotateXMax", rotateXMax);
            var rotateTargetX = undefined;
            var rotateTargetY = undefined;
            _this.GlobalParams.set("rotateTargetX", rotateTargetX);
            _this.GlobalParams.set("rotateTargetY", rotateTargetY);
            var tilt = 0;
            var tiltTarget = undefined;
            var scaleTarget = undefined;
            _this.GlobalParams.set("tilt", tilt);
            _this.GlobalParams.set("tiltTarget", tiltTarget);
            _this.GlobalParams.set("scaleTarget", scaleTarget);
            return _this;
            // var keyboard = new THREEx.KeyboardState();
            // this.GlobalParams.set("keyboard", keyboard);
        }
        EventListenerSystem.prototype.constrain = function (v, min, max) {
            if (v < min)
                v = min;
            else if (v > max)
                v = max;
            return v;
        };
        EventListenerSystem.prototype.handleMWheel = function (delta) {
            var camera = this.MainSystem.OtherSystems.get("threejs").GlobalParams.get("camera");
            camera.zoom += delta * 0.1;
            camera.zoom = this.constrain(camera.zoom, 0.5, 5.0);
            camera.updateProjectionMatrix();
            this.MainSystem.OtherSystems.get("threejs").GlobalParams.set("camera", camera);
            this.GlobalParams.set("scaleTarget", undefined);
        };
        EventListenerSystem.prototype.onMouseWheel = function (event) {
            var delta = 0;
            if (event.wheelDelta) {
                delta = event.wheelDelta / 120;
            }
            else if (event.detail) {
                delta = -event.detail / 3;
            }
            if (delta) {
                this.handleMWheel(delta);
            }
            event.returnValue = false;
        };
        EventListenerSystem.prototype.handleTiltWheel = function (delta) {
            var camera = this.MainSystem.OtherSystems.get("threejs").GlobalParams.get("camera");
            var tilt = this.GlobalParams.get("tilt");
            tilt -= delta * 0.1;
            tilt = this.constrain(tilt, 0, Math.PI / 2);
            this.GlobalParams.set("tilt", tilt);
            camera.position.y = 300 * Math.sin(-tilt);
            camera.position.z = 100 + 300 * Math.cos(-tilt);
            camera.lookAt(new THREE.Vector3(0, 0, 100));
            this.MainSystem.OtherSystems.get("threejs").GlobalParams.set("camera", camera);
            this.GlobalParams.set("tiltTarget", undefined);
        };
        EventListenerSystem.prototype.InitEventListener = function () {
            var masterContainer = document.getElementById('visualization');
            var passive = false;
            var options = Object.defineProperty({}, 'passive', {
                get: function () {
                    passive = true;
                }
            });
            // document.addEventListener('testPassiveEventSupport', () => { }, options);
            // document.removeEventListener('testPassiveEventSupport', () => { }, options);
            // document.addEventListener('mousemove', (event: any) => {
            //     this.GlobalParams.set("pmouseX", this.GlobalParams.get("mouseX"));
            //     this.GlobalParams.set("pmouseY", this.GlobalParams.get("mouseY"));
            //     if (event instanceof MouseEvent) {
            //         this.GlobalParams.set("mouseX", event.clientX - window.innerWidth * 0.5);
            //         this.GlobalParams.set("mouseY", event.clientY - window.innerHeight * 0.5);
            //     } else {
            //         this.GlobalParams.set("mouseX", event.touches[0].clientX - window.innerWidth * 0.5);
            //         this.GlobalParams.set("mouseY", event.touches[0].clientY - window.innerHeight * 0.5);
            //     }
            //     if (this.GlobalParams.get("dragging") && !('ontouchmove' in document && event instanceof TouchEvent && event.touches.length > 1)) {
            //         if (this.GlobalParams.get("keyboard").pressed("shift") == false) {
            //             var rotateVY = this.GlobalParams.get("rotateVY");
            //             var rotateVX = this.GlobalParams.get("rotateVX");
            //             rotateVY += (this.GlobalParams.get("mouseX") - this.GlobalParams.get("pmouseX")) / 2 * Math.PI / 180 * 0.1;
            //             rotateVX += (this.GlobalParams.get("mouseY") - this.GlobalParams.get("pmouseY")) / 2 * Math.PI / 180 * 0.1;
            //             this.GlobalParams.set("rotateVX", rotateVX);
            //             this.GlobalParams.set("rotateVY", rotateVY);
            //         } else {
            //             this.handleTiltWheel((this.GlobalParams.get("mouseY") - this.GlobalParams.get("pmouseY")) * 0.1);
            //         }
            //     }
            //     //pan event: mouse left drag
            //     if (this.GlobalParams.get("dragging") && 'ontouchmove' in document && event instanceof TouchEvent) {
            //         event.preventDefault();
            //     }
            // }, true);
            // document.addEventListener('touchmove', (event: any) => {
            //     this.GlobalParams.set("pmouseX", this.GlobalParams.get("mouseX"));
            //     this.GlobalParams.set("pmouseY", this.GlobalParams.get("mouseY"));
            //     if (event instanceof MouseEvent) {
            //         this.GlobalParams.set("mouseX", event.clientX - window.innerWidth * 0.5);
            //         this.GlobalParams.set("mouseY", event.clientY - window.innerHeight * 0.5);
            //     } else {
            //         this.GlobalParams.set("mouseX", event.touches[0].clientX - window.innerWidth * 0.5);
            //         this.GlobalParams.set("mouseY", event.touches[0].clientY - window.innerHeight * 0.5);
            //     }
            //     if (this.GlobalParams.get("dragging") && !('ontouchmove' in document && event instanceof TouchEvent && event.touches.length > 1)) {
            //         if (this.GlobalParams.get("keyboard").pressed("shift") == false) {
            //             var rotateVY = this.GlobalParams.get("rotateVY");
            //             var rotateVX = this.GlobalParams.get("rotateVX");
            //             rotateVY += (this.GlobalParams.get("mouseX") - this.GlobalParams.get("pmouseX")) / 2 * Math.PI / 180 * 0.1;
            //             rotateVX += (this.GlobalParams.get("mouseY") - this.GlobalParams.get("pmouseY")) / 2 * Math.PI / 180 * 0.1;
            //             this.GlobalParams.set("rotateVX", rotateVX);
            //             this.GlobalParams.set("rotateVY", rotateVY);
            //         } else {
            //             this.handleTiltWheel((this.GlobalParams.get("mouseY") - this.GlobalParams.get("pmouseY")) * 0.1);
            //         }
            //     }
            //     if (this.GlobalParams.get("dragging") && 'ontouchmove' in document && event instanceof TouchEvent) {
            //         event.preventDefault();
            //     }
            // }, passive ? { capture: true, passive: false } : true);
            // document.addEventListener('windowResize', () => { }, false);
            // document.addEventListener('mousedown', (event: any) => {
            //     if (typeof event.target.className === 'string' && event.target.className.indexOf('noMapDrag') !== -1) {
            //         return;
            //     }
            //     if (event instanceof MouseEvent) {
            //         this.GlobalParams.set("mouseX", event.clientX - window.innerWidth * 0.5);
            //         this.GlobalParams.set("mouseY", event.clientY - window.innerHeight * 0.5);
            //     } else {
            //         this.GlobalParams.set("mouseX", event.touches[0].clientX - window.innerWidth * 0.5);
            //         this.GlobalParams.set("mouseY", event.touches[0].clientY - window.innerHeight * 0.5);
            //     }
            //     this.GlobalParams.set("dragging", true);
            //     this.GlobalParams.set("pressX", this.GlobalParams.get("mouseX"));
            //     this.GlobalParams.set("pressY", this.GlobalParams.get("mouseY"));
            //     this.GlobalParams.set("rotateTargetX", undefined);
            //     this.GlobalParams.set("tiltTarget", undefined);
            //     this.GlobalParams.set("scaleTarget", undefined);
            //     if ('ontouchstart' in document && event instanceof TouchEvent && event.touches.length > 1) {
            //         event.preventDefault();
            //     }
            // }, true);
            // document.addEventListener('touchstart', (event: any) => {
            //     if (typeof event.target.className === 'string' && event.target.className.indexOf('noMapDrag') !== -1) {
            //         return;
            //     }
            //     if (event instanceof MouseEvent) {
            //         this.GlobalParams.set("mouseX", event.clientX - window.innerWidth * 0.5);
            //         this.GlobalParams.set("mouseY", event.clientY - window.innerHeight * 0.5);
            //     } else {
            //         this.GlobalParams.set("mouseX", event.touches[0].clientX - window.innerWidth * 0.5);
            //         this.GlobalParams.set("mouseY", event.touches[0].clientY - window.innerHeight * 0.5);
            //     }
            //     this.GlobalParams.set("dragging", true);
            //     this.GlobalParams.set("pressX", this.GlobalParams.get("mouseX"));
            //     this.GlobalParams.set("pressY", this.GlobalParams.get("mouseY"));
            //     this.GlobalParams.set("rotateTargetX", undefined);
            //     this.GlobalParams.set("tiltTarget", undefined);
            //     this.GlobalParams.set("scaleTarget", undefined);
            //     if ('ontouchstart' in document && event instanceof TouchEvent && event.touches.length > 1) {
            //         event.preventDefault();
            //     }
            // }, passive ? { capture: true, passive: false } : true);
            // document.addEventListener('mouseup', (event: any) => {
            //     this.GlobalParams.set("dragging", false);
            //     if ('ontouchend' in document && event instanceof TouchEvent) {
            //         var now = new Date().getTime();
            //         if (now - this.GlobalParams.get("touchEndTime") < 500) {
            //             event.preventDefault();
            //         }
            //         this.GlobalParams.set("touchEndTime", now);
            //     }
            // }, false);
            // document.addEventListener('touchend', (event: any) => {
            //     this.GlobalParams.set("dragging", false);
            //     if ('ontouchend' in document && event instanceof TouchEvent) {
            //         var now = new Date().getTime();
            //         if (now - this.GlobalParams.get("touchEndTime") < 500) {
            //             event.preventDefault();
            //         }
            //         this.GlobalParams.set("touchEndTime", now);
            //     }
            // }, false);
            // document.addEventListener('touchcancel', (event: any) => {
            //     this.GlobalParams.set("dragging", false);
            //     if ('ontouchend' in document && event instanceof TouchEvent) {
            //         var now = new Date().getTime();
            //         if (now - this.GlobalParams.get("touchEndTime") < 500) {
            //             event.preventDefault();
            //         }
            //         this.GlobalParams.set("touchEndTime", now);
            //     }
            // }, false);
            // var mc = new Hammer(document);
            // mc.get('pinch').set({ enable: true });
            // mc.get('pan').set({ threshold: 0, pointers: 3, direction: Hammer.DIRECTION_VERTICAL });
            // mc.on('pinchstart pinchmove', (event: any) => {
            //     if (event.type === 'pinchmove') {
            //         this.handleMWheel(Math.log(event.scale / this.GlobalParams.get("pscale")) * 10);
            //     }
            //     this.GlobalParams.set("pscale", event.scale);
            // });
            // mc.on('panmove', (event: any) => {
            //     this.handleTiltWheel(event.velocityY);
            // });
            // masterContainer.addEventListener('click', (event: any) => {
            //     if (Math.abs(this.GlobalParams.get("pressX") - this.GlobalParams.get("mouseX")) > 3 || Math.abs(this.GlobalParams.get("pressY") - this.GlobalParams.get("mouseY")) > 3)
            //         return;
            //     //var pickColorIndex = getPickColor();
            // }, true);
            // masterContainer.addEventListener('mousewheel', (event: any) => {
            //     var delta = 0;
            //     if (event.wheelDelta) { /* IE/Opera. */
            //         delta = event.wheelDelta / 120;
            //     } else if (event.detail) { // firefox
            //         delta = -event.detail / 3;
            //     }
            //     if (delta) {
            //         this.handleMWheel(delta);
            //     }
            //     event.returnValue = false;
            // }, false);
            // //	firefox
            // masterContainer.addEventListener('DOMMouseScroll', (e: any) => {
            //     var event = window.event || e;
            //     var delta = 0;
            //     if (event.wheelDelta) { /* IE/Opera. */
            //         delta = event.wheelDelta / 120;
            //     } else if (event.detail) { // firefox
            //         delta = -event.detail / 3;
            //     }
            //     if (delta) {
            //         this.handleMWheel(delta);
            //     }
            //     event.returnValue = false;
            // }, false);
            // document.addEventListener('keydown', () => { }, false);
        };
        EventListenerSystem.prototype.Execute = function () {
            _super.prototype.Execute.call(this);
        };
        return EventListenerSystem;
    }(System));
    ECS.EventListenerSystem = EventListenerSystem;
})(ECS || (ECS = {}));
/// <reference path="./Component.ts" />
/// <reference path="./System.ts" />
/// <reference path="./Entity.ts" />
/// <reference path="./LoadData.ts" />
/// <reference path="./HashSet.ts" />
var entity_tip = new ECS.Entity("tip_entity");
entity_tip.addComponent(new ECS.JsonDataComponent());
var entity_country = new ECS.Entity("country_entity");
entity_country.addComponent(new ECS.JsonDataComponent());
var entity_missile = new ECS.Entity("missile_entity");
entity_missile.addComponent(new ECS.JsonDataComponent());
var entity_history = new ECS.Entity("history_entity");
entity_history.addComponent(new ECS.JsonDataComponent());
var entity_citycode = new ECS.Entity("citycode_entity");
entity_citycode.addComponent(new ECS.JsonDataComponent());
var entity_2008data = new ECS.Entity("2008data_entity");
entity_2008data.addComponent(new ECS.JsonDataComponent());
var entities = new Utils.HashSet();
entities.set(entity_tip.name, entity_tip);
entities.set(entity_country.name, entity_country);
entities.set(entity_missile.name, entity_missile);
entities.set(entity_history.name, entity_history);
entities.set(entity_citycode.name, entity_citycode);
entities.set(entity_2008data.name, entity_2008data);
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
