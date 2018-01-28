//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////                                                                      //
////  HYCAL                  //////////   v0.0                                                              //
//////////////////////////////////////                                                                      //
//////////////////////////////////////  Copyright 2018-2019,                                                //
//////////////////////////////////////  Last vist: 01, 27, 2018  by Raymond Wang                             //
//////////////////////////////////////                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////WANG  XU///-->

//重力加速度
var g = 9.8;

//enum

//堰进口底坎边缘类型，方角/圆角
var WcwEdgeType = {
    SQUARE: true,
    ROUND: false
};

//驼峰堰类型
var tfyType = {
    A: true,
    B: false
};


function addScript() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "./project/HYCAL/HYCAL-theme.js";
    var script_math = document.createElement("script");
    script_math.type = "text/javascript";
    script_math.src = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-MML-AM_CHTML";
    document.getElementsByTagName("head")[0].appendChild(script);
    document.getElementsByTagName("head")[0].appendChild(script_math);
}

function tfy(type, epsilon, n, b, H, v0, p1) {
    var H0 = H + v0 * v0 / (2 * g);
    //console.log(H0);
    var m = 0;
    var p1dH0 = p1 / H0;
    //console.log(p1dH0);
    //identify param m
    if (type == tfyType.A) {
        if (p1dH0 <= 0.24) {
            m = 0.385 + 0.171 * Math.pow(p1dH0, -0.0657);
        } else {
            m = 0.414 * Math.pow(p1dH0, -0.0652);
        }
    } else if (type == tfyType.B) {
        if (p1dH0 <= 0.34) {
            m = 0.385 + 0.224 * Math.pow(p1dH0, 0.934);
        } else {
            m = 0.452 * Math.pow(p1dH0, -0.032);
        }
    }
    //console.log(m);
    var Q = m * epsilon * n * b * Math.pow(2 * g, 0.5) * Math.pow(H0, 1.5);
    return Q;
}

//计算宽顶堰
function WideCrestWeir(edgetype, epsilon, n, b, H, v0, p1) {
    var H0 = H + v0 * v0 / (2 * g);
    var m = 0;

    //identify param m
    if (edgetype == WcwEdgeType.SQUARE) {
        if (p1 / H0 <= 3) {
            m = 0.32 + 0.01 * ((3 - p1 / H0) / (0.46 + 0.75 * p1 / H0));
        } else {
            m = 0.32;
        }
    } else if (edgetype == WcwEdgeType.ROUND) {
        if (p1 / H0 <= 3) {
            m = 0.36 + 0.01 * ((3 - p1 / H0) / (1.5 * p1 / H0));
        } else {
            m = 0.36;
        }
    }

    var Q = m * epsilon * n * b * Math.pow(2 * g, 0.5) * Math.pow(H0, 1.5);
    return Q;
}

//计算开敞式幂曲线
function kcsmqx(sigma_m, c, m, epsilon, b, n, h, h_p, v0, p1) {
    var B = n * b;
    var H_d = h_p / 100 * h;

    var h0 = 0;

    if (1.33 * H_d > p1) {
        h0 = h + v0 * v0 / (2 * g);
        console.log(h0);
    } else {
        h0 = h;
    }

    //console.log(c);
    //console.log(m);
    //console.log(epsilon);
    //console.log(sigma_m);
    //console.log(b);
    var Q = c * m * n * epsilon * sigma_m * b * Math.sqrt(2 * g) * Math.pow(h0, 1.5);
    return Q;
}

function initEvent() {


    //计算开敞式幂曲线实用堰  按钮
    document.getElementById("calculate_kcs").addEventListener("click", function() {
        var sigma_m = parseFloat(document.getElementById("sigma_m").value);
        var c = parseFloat(document.getElementById("c").value);
        var m = parseFloat(document.getElementById("m").value);
        var epsilon = parseFloat(document.getElementById("epsilon").value);
        var b = parseFloat(document.getElementById("b").value);
        var n = parseFloat(document.getElementById("n").value);
        var h = parseFloat(document.getElementById("h").value);
        var v0 = parseFloat(document.getElementById("v0").value);
        var h_p = parseFloat(document.getElementById("h_p").value);
        var p1 = parseFloat(document.getElementById("p1").value);
        var q = kcsmqx(sigma_m, c, m, epsilon, b, n, h, h_p, v0, p1);
        document.getElementById("q").value = q;
    });

    //宽顶堰  按钮
    document.getElementById("calculate_wcw").addEventListener("click", function() {

        var epsilon = parseFloat(document.getElementById("wcw_epsilon").value);
        var b = parseFloat(document.getElementById("wcw_b").value);
        var n = parseFloat(document.getElementById("wcw_n").value);
        var H = parseFloat(document.getElementById("wcw_h").value);
        var v0 = parseFloat(document.getElementById("wcw_v0").value);
        var p1 = parseFloat(document.getElementById("wcw_p1").value);

        var chk_edge = document.getElementById('wcw_chkedge').checked;
        var q = WideCrestWeir(chk_edge, epsilon, n, b, H, v0, p1);
        document.getElementById("wcw_q").value = q;
    });

    //驼峰堰

    document.getElementById("calculate_tfy").addEventListener("click", function() {

        var epsilon = parseFloat(document.getElementById("tfy_epsilon").value);
        var b = parseFloat(document.getElementById("tfy_b").value);
        var n = parseFloat(document.getElementById("tfy_n").value);
        var H = parseFloat(document.getElementById("tfy_h").value);
        var v0 = parseFloat(document.getElementById("tfy_v0").value);
        var p1 = parseFloat(document.getElementById("tfy_p1").value);

        var chk_type = document.getElementById('tfy_chktype').checked;
        var q = tfy(chk_type, epsilon, n, b, H, v0, p1);
        document.getElementById("tfy_q").value = q;
    });
}

addScript();
initEvent();