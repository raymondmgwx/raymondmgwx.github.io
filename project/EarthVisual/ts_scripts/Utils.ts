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

    export function measure(R: any,lat1: any, lon1: any, lat2: any, lon2: any) {
        var dLat = (lat2 - lat1) * Math.PI / 180;
        var dLon = (lon2 - lon1) * Math.PI / 180;
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d * 1000;
    }

    export function lonOffsetMeter2lon(R: any,lon: any, lat: any, x: any) {
        return x / (R * Math.cos(lat)) + lon;
    }

    export function latOffsetMeter2lat(R: any,lat: any, y: any) {
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

            var rUp = r  * Math.cos(lat1 * Math.PI / 180);
            var rDown = r  * Math.cos(lat2 * Math.PI / 180);

            var Ax = rDown * Math.sin(lon1 * Math.PI / 180);
            var Ay = r  * Math.sin(lat2 * Math.PI / 180);
            var Az = rDown * Math.cos(lon1 * Math.PI / 180);

            var Bx = rUp * Math.sin(lon1 * Math.PI / 180);
            var By = r  * Math.sin(lat1 * Math.PI / 180);
            var Bz = rUp * Math.cos(lon1 * Math.PI / 180);

            var Cx = rUp * Math.sin(lon2 * Math.PI / 180);
            var Cy = r  * Math.sin(lat1 * Math.PI / 180);
            var Cz = rUp * Math.cos(lon2 * Math.PI / 180);

            var Dx = rDown * Math.sin(lon2 * Math.PI / 180);
            var Dy = r  * Math.sin(lat2 * Math.PI / 180);
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

    export function textureFactory(TILE_PROVIDER: any,MAX_TILEMESH: any, zoom_: any, xtile_: any, ytile_: any, onLoaded: any) {
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