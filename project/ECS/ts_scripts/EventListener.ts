/* =========================================================================
 *
 *  EventListener.ts
 *  event listener
 *
 * ========================================================================= */
/// <reference path="./ThreeJsFunc.ts" />
module Utils {
    declare var Hammer: any;
    declare var THREE: any;
    declare var THREEx: any;

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

    export function setRotateTargetX(val: any) {
        rotateTargetX = val;
    }

    export function setRotateTargetY(val: any) {
        rotateTargetY = val;
    }

    export function setRotateVX(val: any) {
        rotateVX = val;
    }

    export function setRotateVY(val: any) {
        rotateVY = val;
    }

    export function getRotateVX() {
        return rotateVX;
    }

    export function getRotateVY() {
        return rotateVY;
    }

    export function setScaleTarget(val: any) {
        scaleTarget = val;
    }



    function constrain(v, min, max) {
        if (v < min)
            v = min;
        else
            if (v > max)
                v = max;
        return v;
    }

    function onDocumentMouseMove(event) {

        pmouseX = mouseX;
        pmouseY = mouseY;

        if (event instanceof MouseEvent) {
            mouseX = event.clientX - window.innerWidth * 0.5;
            mouseY = event.clientY - window.innerHeight * 0.5;
        } else {
            mouseX = event.touches[0].clientX - window.innerWidth * 0.5;
            mouseY = event.touches[0].clientY - window.innerHeight * 0.5;
        }

        if (dragging && !('ontouchmove' in document && event instanceof TouchEvent && event.touches.length > 1)) {
            if (keyboard.pressed("shift") == false) {
                rotateVY += (mouseX - pmouseX) / 2 * Math.PI / 180 * 0.1;
                rotateVX += (mouseY - pmouseY) / 2 * Math.PI / 180 * 0.1;
            } else {
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
        } else {
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

    function onClick(event) {
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
        } else if (event.detail) { // firefox
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

    export function getRotateX() {
        return rotateX;
    }
    export function getRotateY() {
        return rotateY;
    }

    export function AnimeUpdate() {
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

    var masterContainer = document.getElementById('visualization');
    export function InitEventListener() {
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
}