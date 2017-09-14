//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////                                                                      //
////  PhysicsSimulationLab  //////////   v0.0                                                               //
//////////////////////////////////////                                                                      //
//////////////////////////////////////  Copyright 2017-2018,                                                //
//////////////////////////////////////  Last vist: 09, 14, 2017  by Raymond Wang                             //
//////////////////////////////////////                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////WANG  XU///-->\



function threeStart() {
    addScript();
    initThree();
    initCamera();
    initLight();
    initObject();
    render();
    animate();
}

//define physics var
var step = 0;
var dt = 0.001;
var skip = 100;
var skip_data = 5;

var plot2D_position;
var plot2D_velocity;
var plot2D_acceleration;

//time series record
var data_x = [];
var data_y = [];
var data_z = [];
var data_vx = [];
var data_vy = [];
var data_vz = [];
var data_ax = [];
var data_ay = [];
var data_az = [];

//pause var
var restartFlag = false; //restart
var stopFlag = true;

var Ball = function(parameter) {
    this.radius = parameter.radius;
    this.x = parameter.x;
    this.y = parameter.y;
    this.z = parameter.z;

    this.vx = parameter.vx;
    this.vy = parameter.vy;
    this.vz = parameter.vz;

    this.ax = parameter.ax;
    this.ay = parameter.ay;
    this.az = parameter.az;

    this.jx = parameter.jx;
    this.jy = parameter.jy;
    this.jz = parameter.jz;

    data_x = [];
    data_y = [];
    data_z = [];
    data_vx = [];
    data_vy = [];
    data_vz = [];
    data_ax = [];
    data_ay = [];
    data_az = [];

    data_x.push([0, this.x]);
    data_y.push([0, this.y]);
    data_z.push([0, this.z]);
    data_vx.push([0, this.vx]);
    data_vy.push([0, this.vy]);
    data_vz.push([0, this.vz]);
    data_ax.push([0, this.ax]);
    data_ay.push([0, this.ay]);
    data_az.push([0, this.az]);
};

Ball.prototype = {
    constructor: Ball,
    timeEvolution: function(dt) {

        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.z += this.vz * dt;

        this.vx += this.ax * dt;
        this.vy += this.ay * dt;
        this.vz += this.az * dt;

        this.ax += this.jx * dt;
        this.ay += this.jy * dt;
        this.az += this.jz * dt;

        //rebound
        if (this.z < this.radius) {
            this.z = this.radius;
            this.vz = -this.vz;
        }
    }
};

var ball = new Ball({
    radius: 20,
    x: 0,
    y: 0,
    z: 50,
    vx: 4,
    vy: 2,
    vz: 8,
    ax: 0,
    ay: 0,
    az: -1,
    jx: 0.1,
    jy: 0.1,
    jz: -0.1
});

//jplot
function plotStart() {

    //position graph
    plot2D_position = new Plot2D("posPlotContent");

    plot2D_position.options.axesDefaults.tickOptions.formatString = '';
    plot2D_position.options.axes.xaxis.label = "time [s]"; //x axis label
    plot2D_position.options.axes.yaxis.label = "position [m]"; //y axis label
    plot2D_position.options.axes.yaxis.labelOptions = { angle: -90 };
    plot2D_position.options.axes.xaxis.min = 0; //min value
    plot2D_position.options.legend.show = true;
    plot2D_position.options.legend.location = 'ne';
    var series_p = [];
    series_p.push({
        showLine: true,
        label: "x axis",
        markerOptions: { show: true }
    });
    series_p.push({
        showLine: true,
        label: "y axis",
        markerOptions: { show: true }
    });
    series_p.push({
        showLine: true,
        label: "z axis",
        markerOptions: { show: true }
    });
    plot2D_position.options.series_p = series_p;
    console.log("position plot start.......");

    //velocity graph
    plot2D_velocity = new Plot2D("velPlotContent");

    plot2D_velocity.options.axesDefaults.tickOptions.formatString = '';
    plot2D_velocity.options.axes.xaxis.label = "time [s]";
    plot2D_velocity.options.axes.yaxis.label = "velocity [m/s]";
    plot2D_velocity.options.axes.yaxis.labelOptions = { angle: -90 };
    plot2D_velocity.options.axes.xaxis.min = 0;
    plot2D_velocity.options.legend.show = true;
    plot2D_velocity.options.legend.location = 'ne';
    var series_v = [];
    series_v.push({
        showLine: true,
        label: "vx",
        markerOptions: { show: true }
    });
    series_v.push({
        showLine: true,
        label: "vy",
        markerOptions: { show: true }
    });
    series_v.push({
        showLine: true,
        label: "vz",
        markerOptions: { show: true }
    });
    plot2D_velocity.options.series_v = series_v;
    console.log("velocity plot start.......");

    //acceleration graph
    plot2D_acceleration = new Plot2D("accPlotContent");

    plot2D_acceleration.options.axesDefaults.tickOptions.formatString = '';
    plot2D_acceleration.options.axes.xaxis.label = "time [s]";
    plot2D_acceleration.options.axes.yaxis.label = "acceleration [m/s^2]";
    plot2D_acceleration.options.axes.yaxis.labelOptions = { angle: -90 };
    plot2D_acceleration.options.axes.xaxis.min = 0;
    plot2D_acceleration.options.legend.show = true;
    plot2D_acceleration.options.legend.location = 'ne';
    var series_a = [];
    series_a.push({
        showLine: true,
        label: "ax",
        markerOptions: { show: true }
    });
    series_a.push({
        showLine: true,
        label: "ay",
        markerOptions: { show: true }
    });
    series_a.push({
        showLine: true,
        label: "az",
        markerOptions: { show: true }
    });
    plot2D_velocity.options.series_a = series_a;
    console.log("acceleration plot start.......");
}

//three.js
var stats;
var renderer, scene, canvasFrame, canvas;

function initThree() {

    //detect the envir of the browser
    if (!Detector.webgl) Detector.addGetWebGLMessage();

    canvasFrame = document.getElementById('webglContent');

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(canvasFrame.clientWidth, canvasFrame.clientHeight);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;


    canvas = renderer.domElement;
    canvasFrame.appendChild(canvas);



    stats = new Stats();
    canvasFrame.appendChild(stats.dom);


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
    directionalLight.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(50, 1, 10, 2500));
    directionalLight.shadow.bias = 0.0001;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 1024;

    scene.add(directionalLight);

    ambientLight = new THREE.AmbientLight(0x777777);
    scene.add(ambientLight);
}

var sphere;

function initObject() {

    var geometry = new THREE.SphereGeometry(ball.radius, 20, 20);
    var material = new THREE.MeshLambertMaterial({ color: 0xFF0000 });
    sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(ball.x, ball.y, ball.z);
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

    stats.update();
    trackball.update();
    update_param();

    render();
    requestAnimationFrame(animate);
}

function update_param() {


    var time = step * dt;
    if (stopFlag == false) {
        for (var k = 0; k < skip; k++) {
            step++;
            time = step * dt;
            ball.timeEvolution(dt);

            if (step % (skip * skip_data) == 0) {
                data_x.push([time, ball.x]);
                data_y.push([time, ball.y]);
                data_z.push([time, ball.z]);
                data_vx.push([time, ball.vx]);
                data_vy.push([time, ball.vy]);
                data_vz.push([time, ball.vz]);
                data_ax.push([time, ball.ax]);
                data_ay.push([time, ball.ay]);
                data_az.push([time, ball.az]);
            }
        }
    }

    $('#time_elaspe').val(time.toFixed(2));

    sphere.position.set(ball.x, ball.y, ball.z);

    if (restartFlag == true) {

        step = 0;
        skip = 100;
        dt = 0.001;

        var parameter = { radius: 20 };
        parameter.x = parseFloat(document.getElementById("input_x").value);
        parameter.y = parseFloat(document.getElementById("input_y").value);
        parameter.z = parseFloat(document.getElementById("input_z").value);
        parameter.vx = parseFloat(document.getElementById("input_vx").value);
        parameter.vy = parseFloat(document.getElementById("input_vy").value);
        parameter.vz = parseFloat(document.getElementById("input_vz").value);
        parameter.ax = parseFloat(document.getElementById("input_ax").value);
        parameter.ay = parseFloat(document.getElementById("input_ay").value);
        parameter.az = parseFloat(document.getElementById("input_az").value);
        parameter.jx = parseFloat(document.getElementById("input_jx").value);
        parameter.jy = parseFloat(document.getElementById("input_jy").value);
        parameter.jz = parseFloat(document.getElementById("input_jz").value);
        ball = new Ball(parameter);

        restartFlag = false;
        stopFlag = false;

        $('#btn_start').text("restart");
    }

    if (stopFlag) {
        $('#btn_resume').text("resume");
    } else {
        $('#btn_resume').text("stop");
    }
}

function render() {

    renderer.clear();
    renderer.render(scene, camera);

}


function addScript() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-MML-AM_CHTML";
    document.getElementsByTagName("head")[0].appendChild(script);
}

function initEvent() {

    document.onmousemove = function(e) {
        e = e || window.event;
        x = e.clientX;
        y = e.clientY;

        if (x - canvas.getBoundingClientRect().left > 0 && x - canvas.getBoundingClientRect().left - canvas.width < 0 && y - canvas.getBoundingClientRect().top > 0 && y - canvas.getBoundingClientRect().top - canvas.height < 0) {
            trackball.enabled = true;
        } else {
            trackball.enabled = false;
        }
    };

    document.ontouchstart = function(e) {
        e = e || window.event;
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;

        if (x - canvas.getBoundingClientRect().left > 0 && x - canvas.getBoundingClientRect().left - canvas.width < 0 && y - canvas.getBoundingClientRect().top > 0 && y - canvas.getBoundingClientRect().top - canvas.height < 0) {
            trackball.enabled = true;
        } else {
            trackball.enabled = false;
        }
    };

    //init control param 
    var strs = ['x', 'y', 'z', 'vx', 'vy', 'vz', 'ax', 'ay', 'az', 'jx', 'jy', 'jz'];
    for (var i = 0; i < strs.length; i++) {
        var axis = strs[i];
        var value = ball[axis];

        document.getElementById("input_" + axis).value = value;
        $('#slide_' + axis).slider({
            min: -100,
            max: 100,
            step: 1,
            value: value
        });

        $('#slide_' + axis).on("slide", function(slideEvt) {

            var id = this.id;
            var curAxis = id.replace("slide_", "");
            var curInput = id.replace("slide_", "input_");
            $('#' + curInput).val(slideEvt.value);
            ball[curAxis] = slideEvt.value;
        });
    }





    //bind button event
    document.getElementById("btn_start").addEventListener("click", function() {
        restartFlag = true;
    });

    document.getElementById("btn_resume").addEventListener("click", function() {
        if (stopFlag) {
            stopFlag = false;
        } else {
            stopFlag = true;
        }
    });

    $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
        if (e.target.id == 'pos-tab') {
            plot2D_position.clearData();

            plot2D_position.pushData(data_x);
            plot2D_position.pushData(data_y);
            plot2D_position.pushData(data_z);

            plot2D_position.linerPlot();
            stopFlag = true;
        } else if (e.target.id == 'vel-tab') {
            plot2D_velocity.clearData();

            plot2D_velocity.pushData(data_vx);
            plot2D_velocity.pushData(data_vy);
            plot2D_velocity.pushData(data_vz);

            plot2D_velocity.linerPlot();
            stopFlag = true;
        } else if (e.target.id == 'acc-tab') {
            plot2D_acceleration.clearData();

            plot2D_acceleration.pushData(data_ax);
            plot2D_acceleration.pushData(data_ay);
            plot2D_acceleration.pushData(data_az);

            plot2D_acceleration.linerPlot();
            stopFlag = true;
        }

    });


    console.log('init event...' + Math.random());
}



threeStart();
plotStart();
initEvent();