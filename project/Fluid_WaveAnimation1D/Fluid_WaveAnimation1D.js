//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////                                                                      //
////  Image-Visual-Lab      //////////   v0.0                                                              //
//////////////////////////////////////                                                                      //
//////////////////////////////////////  Copyright 2018-2019,                                                //
//////////////////////////////////////  Last vist: 07, 07, 2018  by Raymond Wang                             //
//////////////////////////////////////                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////WANG  XU///-->

var canvasElement_wave1d = document.getElementById('canvas_waveanimation_1d');
canvasElement_wave1d.width = canvasElement_wave1d.clientWidth;
canvasElement_wave1d.height = canvasElement_wave1d.clientHeight;
var context_wave1d = canvasElement_wave1d.getContext('2d');
var height = canvasElement_wave1d.height;
var width = canvasElement_wave1d.width;

function addScript() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "./project/Fluid_WaveAnimation1D/Fluid-theme.js";
    document.getElementsByTagName("head")[0].appendChild(script);
}

function updateWave(timeInterval, x, waveLength, speed) {
    x += timeInterval * speed;

    // Boundary reflection
    if (x > width) {
        speed *= -1.0;
        x = width + timeInterval * speed;
    } else if (x < 0.0) {
        speed *= -1.0;
        x = timeInterval * speed;
    }
    return [x, speed];
}

function accumulateWaveToHeightField(x, waveLength, maxHeight, heightField) {
    var halfWaveLength = 0.5 * waveLength;
    var start = parseInt(x - halfWaveLength);
    var end = parseInt(x + halfWaveLength);
    for (var i = start; i < end; ++i) {
        var distance = (Math.abs(i - x) / (i - x)) * 0.5 * Math.PI * Math.abs(i - x) / halfWaveLength;
        var height = maxHeight * Math.cos(distance);
        heightField[i] += height;
    }
    return heightField;
}



var waveALength = height * 3 / 8;
var waveBLength = height * 5 / 8;
var waveAHeight = height * 4 / 8;
var waveBHeight = height * 2 / 8;
var posA = width / 8;
var posB = width * 7 / 8;
var speedA = 300;
var speedB = -250;
var fps = 100;
var timeInterval = 1.0 / fps;

function loop() {

    context_wave1d.clearRect(0, 0, canvasElement_wave1d.width, canvasElement_wave1d.height);
    var heightField = new Array(canvasElement_wave1d.width);
    for (var n = 0; n < canvasElement_wave1d.width; n++) heightField[n] = 0
    var A_param = updateWave(timeInterval, posA, waveALength, speedA);
    posA = A_param[0];
    speedA = A_param[1];
    var B_param = updateWave(timeInterval, posB, waveBLength, speedB);
    posB = B_param[0];
    speedB = B_param[1];

    heightField = accumulateWaveToHeightField(posA, waveALength, waveAHeight, heightField);
    heightField = accumulateWaveToHeightField(posB, waveBLength, waveBHeight, heightField);

    context_wave1d.beginPath();
    for (var i = 0; i < width; i++) {
        var h = height - parseInt(heightField[i]);

        if (i == 0 && h == height) context_wave1d.moveTo(0, height);
        else if (i == 0 && h != height) context_wave1d.moveTo(0, h);
        else context_wave1d.lineTo(i, h);
    }
    context_wave1d.strokeStyle = 'red';
    context_wave1d.stroke();

    requestAnimationFrame(loop);
}

addScript();
loop();