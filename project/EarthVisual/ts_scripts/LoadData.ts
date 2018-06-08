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

    export function getYearIndexlookUp(){
        return yearIndexLookup;
    }

    export function loadGeoData(latlonData: any) {
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

    function landingLatLon(lat:any, lon:any, bearing:any, distance:any) {
        var a = 6378137.06; // radius at equator
    
        var phi1 = lat * Math.PI / 180;
        var L1 = lon * Math.PI / 180;
        var alpha1 = bearing * Math.PI / 180;
        var delta = distance * 1000 / a;
    
        var phi2 = Math.asin(Math.sin(phi1) * Math.cos(delta) +
            Math.cos(phi1) * Math.sin(delta) * Math.cos(alpha1));
        var dL = Math.atan2(Math.sin(alpha1) * Math.sin(delta) * Math.cos(phi1),
            Math.cos(delta) - Math.sin(phi1) * Math.sin(phi2));
        var L2 = (L1 + dL + 3 * Math.PI) % (2 * Math.PI) - Math.PI;
    
        return {'lat': phi2 * 180 / Math.PI, 'lon': L2 * 180 / Math.PI};
    }

    export function buildDataVizGeometries(linearData: any,missileLookup:any,facilityData:any) {

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

}
