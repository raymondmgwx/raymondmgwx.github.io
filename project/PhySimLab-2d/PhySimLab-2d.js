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

var canvasElement_random = document.getElementById('canvas_random_draw');
canvasElement_random.width = canvasElement_random.clientWidth;
canvasElement_random.height = canvasElement_random.clientHeight;

var canvasElement_colormodel = document.getElementById('canvas_colormodel_draw');
canvasElement_colormodel.width = canvasElement_colormodel.clientWidth;
canvasElement_colormodel.height = canvasElement_colormodel.clientHeight;

var canvasElement_gaussian = document.getElementById('canvas_gaussian_draw');
canvasElement_gaussian.width = canvasElement_gaussian.clientWidth;
canvasElement_gaussian.height = canvasElement_gaussian.clientHeight;

var canvasElement_planewave = document.getElementById('canvas_planewave_draw');
canvasElement_planewave.width = canvasElement_planewave.clientWidth;
canvasElement_planewave.height = canvasElement_planewave.clientHeight;

var canvasElement_mandelbrot = document.getElementById('canvas_mandelbrot_draw');
canvasElement_mandelbrot.width = canvasElement_mandelbrot.clientWidth;
canvasElement_mandelbrot.height = canvasElement_mandelbrot.clientHeight;

var canvasElement_ball = document.getElementById('canvas_ball_anime');
canvasElement_ball.width = canvasElement_ball.clientWidth;
canvasElement_ball.height = canvasElement_ball.clientHeight;
var context_ball = canvasElement_ball.getContext('2d');
var canvasElement_ball2 = document.getElementById('canvas_ball_anime2');
canvasElement_ball2.width = canvasElement_ball2.clientWidth;
canvasElement_ball2.height = canvasElement_ball2.clientHeight;
var context_ball2 = canvasElement_ball2.getContext('2d');

var canvasElement_lifegame = document.getElementById('canvas_lifegame_anime');
canvasElement_lifegame.width = canvasElement_lifegame.clientWidth;
canvasElement_lifegame.height = canvasElement_lifegame.clientHeight;
var context_lifegame = canvasElement_lifegame.getContext('2d');


var draw_polygon = new DrawPolygon();
var ImgProcess = new ImgProcess();
var lifeGame = new LifeGame(100, 0.5);

var mandelbrot_flag_step = false;

function addScript() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "./project/PhySimLab-2d/PhySimLab-theme.js";
    document.getElementsByTagName("head")[0].appendChild(script);
}

function drawRandomImage() {
    ImgProcess.CreateRandomImage(canvasElement_random);
}

function drawColorModelImage() {
    ImgProcess.CreateColorModelImage(canvasElement_colormodel);
}

function drawGaussianImage() {
    ImgProcess.CreateGaussianImage(canvasElement_gaussian);
}

function drawPlaneWave() {
    var f0 = document.getElementById("f0_pw").value;
    var theta = document.getElementById("theta_pw").value;
    var k = document.getElementById("k_pw").value;

    ImgProcess.CreateWavePlaneImage(canvasElement_planewave, f0, k, theta);
}

function drawMandelbrot(flag_step) {
    var min_a = document.getElementById("min_a").value;
    var min_b = document.getElementById("min_b").value;
    var max_a = document.getElementById("max_a").value;
    var max_b = document.getElementById("max_b").value;
    var infty = document.getElementById("infty").value;
    var step = document.getElementById("step").value;

    min_a = parseInt(min_a);
    min_b = parseInt(min_b);
    max_a = parseInt(max_a);
    max_b = parseInt(max_b);

    ImgProcess.CreateMandelbrotImage(canvasElement_mandelbrot, min_a, min_b, max_a, max_b, infty, step, flag_step);
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

function lifeAnimeGame() {

    var width = canvasElement_lifegame.width;
    var height = canvasElement_lifegame.height;
    context_lifegame.clearRect(0, 0, width, height);

    lifeGame.step();
    var l = width / 100;
    context_lifegame.beginPath();
    for (var j = 0; j < 100; j++) {
        for (var i = 0; i < 100; i++) {
            var flag = lifeGame.read(i, j);
            if (flag) context_lifegame.rect(i * l, j * l, l, l);
        }
    }
    context_lifegame.closePath();
    context_lifegame.fillStyle = "blue";
    context_lifegame.fill();
    requestAnimationFrame(lifeAnimeGame);
}

var ball_R = 50;
var ball_x = 250,
    ball_y = 250;
var ball_vx = 7,
    ball_vy = 5;

var ball_R2 = 50;
var ball_x2 = 250,
    ball_y2 = 250;
var ball_vx2 = 7,
    ball_vy2 = 5;

function ballAnimeByEulerFunc() {

    context_ball.clearRect(0, 0, canvasElement_ball.width, canvasElement_ball.height);

    var width = canvasElement_ball.width;
    var height = canvasElement_ball.height;

    ball_x = ball_x + ball_vx;
    ball_y = ball_y + ball_vy;

    if (ball_x < ball_R || ball_x > width - ball_R) ball_vx = -ball_vx;
    if (ball_y < ball_R || ball_y > height - ball_R) ball_vy = -ball_vy;

    context_ball.beginPath();
    context_ball.arc(ball_x, ball_y, ball_R, 0, 2 * Math.PI);
    context_ball.closePath();

    context_ball.strokeStyle = "#FF0000";
    context_ball.lineWidth = ball_R / 10;
    context_ball.stroke();
    context_ball.fillStyle = "blue";
    context_ball.fill();

    requestAnimationFrame(ballAnimeByEulerFunc);
}

function ballAnimeByEulerFunc2() {

    context_ball2.clearRect(0, 0, canvasElement_ball2.width, canvasElement_ball2.height);

    var width = canvasElement_ball2.width;
    var height = canvasElement_ball2.height;

    ball_x2 = ball_x2 + ball_vx2;
    ball_y2 = ball_y2 + ball_vy2;

    if (ball_y2 < ball_R2 || ball_y2 > height - ball_R2) ball_vy2 = -ball_vy2;

    if (ball_x2 > width) ball_x2 = ball_x2 - width;
    else if (ball_x2 < 0) ball_x2 = ball_x2 + width;

    context_ball2.beginPath();
    context_ball2.arc(ball_x2, ball_y2, ball_R2, 0, 2 * Math.PI);
    context_ball2.closePath();

    context_ball2.strokeStyle = "#FF0000";
    context_ball2.lineWidth = ball_R2 / 10;
    context_ball2.stroke();
    context_ball2.fillStyle = "red";
    context_ball2.fill();

    if (ball_x2 > width - ball_R2) {

        context_ball2.beginPath();
        context_ball2.arc(ball_x2 - width, ball_y2, ball_R2, 0, 2 * Math.PI);
        context_ball2.closePath();

        context_ball2.strokeStyle = "#FF0000";
        context_ball2.lineWidth = ball_R2 / 10;
        context_ball2.stroke();
        context_ball2.fillStyle = "red";
        context_ball2.fill();
    } else if (ball_x2 < ball_R2) {

        context_ball2.beginPath();
        context_ball2.arc(ball_x2 + width, ball_y2, ball_R2, 0, 2 * Math.PI);
        context_ball2.closePath();

        context_ball2.strokeStyle = "#FF0000";
        context_ball2.lineWidth = ball_R2 / 10;
        context_ball2.stroke();
        context_ball2.fillStyle = "red";
        context_ball2.fill();
    }

    requestAnimationFrame(ballAnimeByEulerFunc2);
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
    document.getElementById("generate_planewave").addEventListener("click", function() {
        drawPlaneWave();
    });
    document.getElementById("generate_mandelbrot_style1").addEventListener("click", function() {
        mandelbrot_flag_step = false;
        drawMandelbrot(mandelbrot_flag_step);
    });
    document.getElementById("generate_mandelbrot_style2").addEventListener("click", function() {
        mandelbrot_flag_step = true;
        drawMandelbrot(mandelbrot_flag_step);
    });
    document.getElementById("generate_mandelbrot").addEventListener("click", function() {
        drawMandelbrot(mandelbrot_flag_step);
    });

    document.getElementById("reset_lifegame").addEventListener("click", function() {
        lifeGame.init();
    });

}

function initCanvas() {
    drawPolygon();
    drawUzaMaki();
    drawRandomImage();
    drawColorModelImage();
    drawGaussianImage();
    drawPlaneWave();
    drawMandelbrot(mandelbrot_flag_step);

    ballAnimeByEulerFunc();
    ballAnimeByEulerFunc2();
    lifeAnimeGame();
}

addScript();
initEvent();
initCanvas();