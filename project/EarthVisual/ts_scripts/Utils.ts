/* =========================================================================
 *
 *  Utils.ts
 *  Tools
 *
 * ========================================================================= */
module Utils {

    export class Selection {
        selectedYear: any;
        selectedTest: any;
        outcomeCategories: Object;
        missileCategories: Object;
        constructor(selectedYear: any, selectedTest: any, missileLookup: any, outcomeLookup: any) {
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
        getOutcomeCategories() {
            var list = [];
            for (var i in this.outcomeCategories) {
                if (this.outcomeCategories[i]) {
                    list.push(i);
                }
            }
            return list;
        }
        getMissileCategories() {
            var list = [];
            for (var i in this.missileCategories) {
                if (this.missileCategories[i]) {
                    list.push(i);
                }
            }
            return list;
        }
    }

    export function ConvertGISDataTo3DSphere(GisData_lon: any, GisData_lat: any) {
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

    function CreateLineGeometry(points: any) {
        var geometry = new THREE.Geometry();
        for (var i = 0; i < points.length; i++) {
            geometry.vertices.push(points[i]);
        }
        return geometry;
    }

    export function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    var origin = new THREE.Vector3(0, 0, 0);
    function ConnectionLineGeometry(startPos: any, endPos: any, apogee: any) {
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

    export function BuildSphereDataVizGeometries(MoveDataList: any) {

        var rad = 100;
        var loadLayer = document.getElementById('loading');
        var lineArray = [];
        for (let m of MoveDataList) {

            var startPos = new THREE.Vector3(m.startPos[0], m.startPos[1], m.startPos[2]);
            var endPos = new THREE.Vector3(m.endPos[0], m.endPos[1], m.endPos[2]);

            var randomHeight = randomInt(500,1000);
            var line = ConnectionLineGeometry(startPos, endPos, randomHeight);
            lineArray.push(line);
        }

        loadLayer.style.display = 'none';
        return lineArray;
    }

    export function long2tile(lon: any, zoom: any) {
        return (Math.floor((lon + 180) / 360 * Math.pow(2, zoom)));
    }

    export function lat2tile(lat: any, zoom: any) {
        return (Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom)));
    }

    export function tile2long(x: any, z: any) {
        return (x / Math.pow(2, z) * 360 - 180);
    }

    export function tile2lat(y: any, z: any) {
        var n = Math.PI - 2 * Math.PI * y / Math.pow(2, z);
        return (180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))));
    }

    export function measure(R: any, lat1: any, lon1: any, lat2: any, lon2: any) {
        var dLat = (lat2 - lat1) * Math.PI / 180;
        var dLon = (lon2 - lon1) * Math.PI / 180;
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d * 1000;
    }

    export function lonOffsetMeter2lon(R: any, lon: any, lat: any, x: any) {
        return x / (R * Math.cos(lat)) + lon;
    }

    export function latOffsetMeter2lat(R: any, lat: any, y: any) {
        return (y / R) + lat;
    }

    var geoTiles = {};
    var geoTileQueue = [];
    declare var THREE: any;
    export function getTileMesh(r: any, zoom: any, ytile: any, MAX_TILEMESH: any) {
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


            myGeometry.vertices.push(
                new THREE.Vector3(Ax, Ay, Az),
                new THREE.Vector3(Bx, By, Bz),
                new THREE.Vector3(Cx, Cy, Cz),
                new THREE.Vector3(Dx, Dy, Dz)
            );
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

    var textures = {};
    var textureQueue = [];

    export function textureFactory(TILE_PROVIDER: any, MAX_TILEMESH: any, zoom_: any, xtile_: any, ytile_: any, onLoaded: any) {
        var id = 'tile_' + zoom_ + '_' + xtile_ + '_' + ytile_;
        var textureLoader = new THREE.TextureLoader();
        // textures[id] = {};
        if (!(textures.hasOwnProperty(id))) {
            var url = TILE_PROVIDER + '/' +
                zoom_ + '/' +
                ((zoom_ > 0) ? (xtile_ % Math.pow(2, zoom_)) : 0) + '/' +
                ((zoom_ > 0) ? (ytile_ % Math.pow(2, zoom_)) : 0) + '.png';
            textureLoader.load(url,
                function (texture) {
                    textures[id] = texture;
                    textureQueue.push(id);
                    if (textureQueue.length > MAX_TILEMESH) {
                        delete textures[textureQueue.shift()];
                    }
                    onLoaded(texture);
                }
            );
        } else {
            onLoaded(textures[id]);
        }
    }
}