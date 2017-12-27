//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////                                                                      //
////  Image-Visual-Lab      //////////   v0.0                                                              //
//////////////////////////////////////                                                                      //
//////////////////////////////////////  Copyright 2017-2018,                                                //
//////////////////////////////////////  Last vist: 12, 26, 2017  by Raymond Wang                             //
//////////////////////////////////////                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////WANG  XU///-->

var canvasElement = document.getElementById('canvas_hexagon_draw');
canvasElement.width = canvasElement.clientWidth;
canvasElement.height = canvasElement.clientHeight;
var context = canvasElement.getContext('2d');


function addScript() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "./project/PhySimLab-2d/PhySimLab-theme.js";
    document.getElementsByTagName("head")[0].appendChild(script);
}



function drawStart() {
    context.clearRect(0, 0, canvasElement.width, canvasElement.height);

    var n = document.getElementById("n").value;
    var theta0 = document.getElementById("theta0").value;
    var r = document.getElementById("r").value;

    context.beginPath();
    for (var m = 0; m < n; m++) {
        x = r * Math.cos(theta0 + 2 * Math.PI * m / n);
        y = r * Math.sin(theta0 + 2 * Math.PI * m / n);
        if (m == 0) context.moveTo(x + 250, y + 250);
        else context.lineTo(x + 250, y + 250);
    }
    context.closePath();

    context.strokeStyle = '#FF0000';
    context.lineWidth = 10;
    context.stroke();

    context.fillStyle = document.getElementById("color").value;
    context.fill();
}

function initEvent() {
    document.getElementById("generate_hexagon").addEventListener("click", function() {
        drawStart();
    });
}

addScript();
initEvent();
drawStart();