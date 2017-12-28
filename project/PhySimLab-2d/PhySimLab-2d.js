//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////                                                                      //
////  Image-Visual-Lab      //////////   v0.0                                                              //
//////////////////////////////////////                                                                      //
//////////////////////////////////////  Copyright 2017-2018,                                                //
//////////////////////////////////////  Last vist: 12, 26, 2017  by Raymond Wang                             //
//////////////////////////////////////                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////WANG  XU///-->

var canvasElement_hex = document.getElementById('canvas_hexagon_draw');
canvasElement_hex.width = canvasElement_hex.clientWidth;
canvasElement_hex.height = canvasElement_hex.clientHeight;
var context_hex = canvasElement_hex.getContext('2d');

var canvasElement_uzamaki = document.getElementById('canvas_uzamaki_draw');
canvasElement_uzamaki.width = canvasElement_uzamaki.clientWidth;
canvasElement_uzamaki.height = canvasElement_uzamaki.clientHeight;
var context_uzamaki = canvasElement_uzamaki.getContext('2d');

var draw_polygon = new DrawPolygon();

function addScript() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "./project/PhySimLab-2d/PhySimLab-theme.js";
    document.getElementsByTagName("head")[0].appendChild(script);
}



function drawPolygon() {

    var n = document.getElementById("n").value;
    var theta0 = document.getElementById("theta0").value;
    var r = document.getElementById("r").value;

    draw_polygon.DrawPolygon(canvasElement_hex, n, theta0, r);

    context_hex.strokeStyle = '#FF0000';
    context_hex.lineWidth = 10;
    context_hex.stroke();

    context_hex.fillStyle = document.getElementById("color").value;
    context_hex.fill();

}

function drawUzaMaki() {

    var n = document.getElementById("n_u").value;
    var theta0 = document.getElementById("theta0_u").value;
    var r = document.getElementById("r_u").value;
    var a = document.getElementById("a_u").value;
    var N = document.getElementById("N_u").value;

    draw_polygon.DrawUzaMaki(canvasElement_uzamaki, n, N, r, theta0, a);

    context_uzamaki.strokeStyle = '#FF0000';
    context_uzamaki.lineWidth = 3;
    context_uzamaki.stroke();
}

function initEvent() {
    document.getElementById("generate_hexagon").addEventListener("click", function() {
        drawPolygon();
    });


    document.getElementById("generate_uzamaki_style1").addEventListener("click", function() {
        document.getElementById("n_u").value = 6;
        document.getElementById("theta0_u").value = 0;
        document.getElementById("r_u").value = 1;
        document.getElementById("a_u").value = 1.05;
        document.getElementById("N_u").value = 200;
        drawUzaMaki();
    });
    document.getElementById("generate_uzamaki_style2").addEventListener("click", function() {
        document.getElementById("n_u").value = 100;
        document.getElementById("theta0_u").value = 0;
        document.getElementById("r_u").value = 4;
        document.getElementById("a_u").value = 1.007;
        document.getElementById("N_u").value = 1000;
        drawUzaMaki();
    });
    document.getElementById("generate_uzamaki").addEventListener("click", function() {
        drawUzaMaki();
    });
}

function initCanvas() {
    drawPolygon();
    drawUzaMaki();
}

addScript();
initEvent();
initCanvas();