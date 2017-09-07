//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////                                                                      //
////  PhysicsSimulationLab  //////////   v0.0                                                               //
//////////////////////////////////////                                                                      //
//////////////////////////////////////  Copyright 2017-2018,                                                //
//////////////////////////////////////  Last vist: 8, 05, 2017  by Raymond Wang                             //
//////////////////////////////////////                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////WANG  XU///-->\



function threeStart() {
    initThree();  
    initCamera(); 
    initLight();  
    initObject();
    render();
    animate();       
}

var stats;
var renderer, scene, canvasFrame, canvas; 
function initThree() {

    //detect the envir of the browser
    if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
    
    canvasFrame = document.getElementById( 'webglContent' );

    renderer = new THREE.WebGLRenderer({ antialias: true });  
    renderer.setSize( canvasFrame.clientWidth, canvasFrame.clientHeight);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;


    canvas = renderer.domElement;
    canvasFrame.appendChild(canvas);
    


    stats = new Stats();
    canvasFrame.appendChild( stats.dom );
    

    scene = new THREE.Scene();
}

var camera, trackball;
var clock = new THREE.Clock();
function initCamera() {

    camera = new THREE.PerspectiveCamera(45, canvasFrame.clientWidth / canvasFrame.clientHeight, 1, 10000);
    camera.position.set(1000, 0, 300);
    camera.up.set(0, 0, 1);
    camera.lookAt({ x: 0, y: 0, z: 100 });

    trackball = new THREE.TrackballControls(camera);

    trackball.screen.width = canvasFrame.clientWidth;                        
    trackball.screen.height = canvasFrame.clientHeight;                      
    trackball.screen.offsetLeft = canvasFrame.getBoundingClientRect().left;  
    trackball.screen.offsetTop = canvasFrame.getBoundingClientRect().top;    

    trackball.noRotate = false;
    trackball.rotateSpeed = 2.0;

    trackball.noZoom = false;
    trackball.zoomSpeed = 0.5;

    trackball.noPan = false;
    trackball.panSpeed = 0.6;
    trackball.target = new THREE.Vector3(0, 0, 100);

    trackball.staticMoving = true;
    trackball.dynamicDampingFactor = 0.3;

}

var directionalLight, ambientLight;
function initLight() {

    directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1.0, 0);
    directionalLight.position.set(100, 100, 1000);
    directionalLight.castShadow = true;
    directionalLight.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 50, 1, 10, 2500 ) );
    directionalLight.shadow.bias = 0.0001;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 1024;

    scene.add(directionalLight);

    ambientLight = new THREE.AmbientLight(0x777777);
    scene.add(ambientLight);
}

var sphere;
function initObject() {

    var geometry = new THREE.SphereGeometry(100, 20, 20);
    var material = new THREE.MeshLambertMaterial({ color: 0xFF0000 });
    sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(0, 0, 200);
    sphere.castShadow = true;
    sphere.castShadow = true;
    scene.add(sphere);


    var yuka_n = 20,  
        yuka_w = 100; 

    for (var i = -yuka_n / 2; i <= yuka_n / 2; i++) {
        for (var j = -yuka_n / 2; j <= yuka_n / 2; j++) {
            //pos
            var x = j * yuka_w;
            var y = i * yuka_w;

            geometry = new THREE.PlaneGeometry(yuka_w, yuka_w);

            if (Math.abs(i + j) % 3 == 0) {
                material = new THREE.MeshLambertMaterial({ color: 0x00CED1 });
            } else if (Math.abs(i + j) % 3 == 1) {
                material = new THREE.MeshLambertMaterial({ color: 0x228B22 });
            } else if (Math.abs(i + j) % 3 == 2) {
                material = new THREE.MeshLambertMaterial({ color: 0xFFFF00 });
            }
            
            var plane = new THREE.Mesh(geometry, material);
            
            plane.position.set(x, y, 0);
            
            plane.castShadow = false;
            plane.receiveShadow = true;
            
            scene.add(plane);
        }
    }
}



function animate() {

    requestAnimationFrame(animate);

    render();
    stats.update();
    trackball.update();
}

function render() {
      
    renderer.clear();
    renderer.render( scene, camera );
    
}

function initEvent() {
    
    document.onmousemove = function(e) {
        e = e || window.event;
        x = e.clientX;
        y = e.clientY;

        if(x-canvas.getBoundingClientRect().left > 0 && x-canvas.getBoundingClientRect().left-canvas.width < 0 && y-canvas.getBoundingClientRect().top > 0 && y-canvas.getBoundingClientRect().top-canvas.height < 0){
            trackball.enabled = true;
        }
        else{
            trackball.enabled = false;
        }
    };

    document.ontouchstart = function(e) {
        e = e || window.event;
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;

        if(x-canvas.getBoundingClientRect().left > 0 && x-canvas.getBoundingClientRect().left-canvas.width < 0 && y-canvas.getBoundingClientRect().top > 0 && y-canvas.getBoundingClientRect().top-canvas.height < 0){
            trackball.enabled = true;
        }
        else{
            trackball.enabled = false;
        }
    };

  

    console.log('init event...'+Math.random());
}



threeStart(); 
initEvent(); 