//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////                                                                      //
////  HYCAL                  //////////   v0.0                                                              //
//////////////////////////////////////                                                                      //
//////////////////////////////////////  Copyright 2018-2019,                                                //
//////////////////////////////////////  Last vist: 01, 19, 2018  by Raymond Wang                             //
//////////////////////////////////////                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////WANG  XU///-->


function addScript() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "./project/HYCAL/HYCAL-theme.js";
    document.getElementsByTagName("head")[0].appendChild(script);
}


function kcsmqx(sigma_m, c, m, epsilon, b, n, h, h_p, v0, p1) {
    var B = n * b;
    var H_d = h_p / 100 * h;
    var g = 9.8;
    var h0 = 0;

    if (1.33 * H_d > p1) {
        h0 = h + v0 * v0 / (2 * g);
        console.log(h0);
    } else {
        h0 = h;
    }

    console.log(c);
    console.log(m);
    console.log(epsilon);
    console.log(sigma_m);
    console.log(b);
    var Q = c * m * n * epsilon * sigma_m * b * Math.sqrt(2 * g) * Math.pow(h0, 1.5);
    return Q;
}

function initEvent() {


    //计算开敞式幂曲线实用堰参数  按钮
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


}

addScript();
initEvent();