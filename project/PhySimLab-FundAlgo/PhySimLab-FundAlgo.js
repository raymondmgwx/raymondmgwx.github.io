//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////                                                                      //
////  Image-Visual-Lab      //////////   v0.0                                                              //
//////////////////////////////////////                                                                      //
//////////////////////////////////////  Copyright 2018-2019,                                                //
//////////////////////////////////////  Last vist: 04, 22, 2018  by Raymond Wang                             //
//////////////////////////////////////                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////WANG  XU///-->

var canvasElement_dda = document.getElementById('canvas_dda');
canvasElement_dda.width = canvasElement_dda.clientWidth;
canvasElement_dda.height = canvasElement_dda.clientHeight;
var context_dda = canvasElement_dda.getContext('2d');

var ImgProcess = new ImgProcess();

function addScript() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "./project/PhySimLab-FundAlgo/PhySimLab-theme.js";
    document.getElementsByTagName("head")[0].appendChild(script);
}

function drawBreseham(x1, y1, x2, y2) {
    x1 = parseInt(x1);
    y1 = parseInt(y1);
    x2 = parseInt(x2);
    y2 = parseInt(y2);

    ImgProcess.CalculateBreseHam(canvasElement_dda, x1, y1, x2, y2);
}

function drawDDA(x1, y1, x2, y2) {
    x1 = parseInt(x1);
    y1 = parseInt(y1);
    x2 = parseInt(x2);
    y2 = parseInt(y2);

    ImgProcess.CalculateDDA(canvasElement_dda, x1, y1, x2, y2);
}


function initEvent() {
    document.getElementById("generate_dda").addEventListener("click", function() {
        var x1 = document.getElementById("x1").value;
        var y1 = document.getElementById("y1").value;
        var x2 = document.getElementById("x2").value;
        var y2 = document.getElementById("y2").value;

        drawBreseham(x1, y1, x2, y2);
    });
}

function initCanvas() {
    var x1 = document.getElementById("x1").value;
    var y1 = document.getElementById("y1").value;
    var x2 = document.getElementById("x2").value;
    var y2 = document.getElementById("y2").value;

    drawBreseham(x1, y1, x2, y2);
}

addScript();
initEvent();
initCanvas();