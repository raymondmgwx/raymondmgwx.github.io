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

//实用堰类型
var syyType = {
    syy: true,
    kdy: false
};

var shapeType = {
    RECTANGLE: false,
    LADDER: true
}

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

//渠道水力学计算
function mqjyls(st, b, i, n, Q, m) {
    var h = 0;
    if (st == shapeType.RECTANGLE)
        h = Math.pow(n * Q / (Math.pow(2, 1 / 3) * Math.sqrt(i)), 3 / 8);
    else if (st == shapeType.LADDER)
        h = Math.pow(Math.pow(2, 8 / 3) * n * Q / (4 * (2 * Math.sqrt(1 + m * m) - m) * Math.sqrt(i)), 3 / 8);

    var learning_rate = 0.01;

    for (var ii = 0; ii < 10000; ii++) {
        if (st == shapeType.RECTANGLE) {
            var omiga = b * h;
            var x = b + 2 * h;
            var R = omiga / x;
            var Q_0 = (omiga * Math.pow(R, 3 / 2) * Math.sqrt(i)) / n;
            h -= learning_rate * (h - n * Q / (b * Math.pow(R, 3 / 2) * Math.sqrt(i)));
        } else if (st == shapeType.LADDER) {
            var omiga = (b + m * h) * h;
            var x = b + 2 * h * Math.sqrt(1 + m * m);
            var R = omiga / x;
            var Q_0 = (omiga * Math.pow(R, 3 / 2) * Math.sqrt(i)) / n;
            h -= learning_rate * (h - n * Q / (Math.pow(R, 3 / 2) * Math.sqrt(i) * (b + m * h)));
        }

        var chk = Math.abs(Q_0 - Q);
        if (chk < 0.001) {
            var v = Q / omiga
            var resArray = [h, v];
            return resArray;
        }
    }
}

//明渠非均匀流水面线计算
function mqfjyls(type_y, st, phi, h1, alpha, Q, b, m, nz, i, L, N) {

    var res_mqjyls = mqjyls(st, b, i, nz, Q, m);

    var h0 = res_mqjyls[0];
    var learning_rate = 0.01;
    var hk = 0;
    var Ak = 0;
    var xk = 0;
    var Bk = 0;

    if (st == shapeType.RECTANGLE) {
        hk = Math.pow((alpha * Q * Q) / (b * b * g), 1 / 3);
        Ak = b * hk;
        xk = b + 2 * hk;
        Bk = b;
    } else if (st == shapeType.LADDER) {
        for (var ii = 0; ii < 10000; ii++) {
            var targetVal = alpha * Q * Q / g;
            hk -= learning_rate * ((((Math.pow((b + m * hk), 3) * hk * hk * hk) / (2 * m * targetVal)) - b / (2 * m)) - hk);
            calValue = (Math.pow((b + m * hk), 3) * hk * hk * hk) / (b + 2 * m * hk);
            chk = Math.abs(calValue - targetVal);
            if (chk < 0.001) {
                Ak = (b + m * hk) * hk;
                xk = b + 2 * hk * Math.pow(1 + m * m, 0.5);
                Bk = b + m * hk;
                break;
            }
        }
    }

    var Rk = Ak / xk;
    var Ck = Math.pow(Rk, 1 / 6) * 1 / nz;
    var ik = g * xk / (alpha * Ck * Ck * Bk);

    var Value_H = 0;

    var sltypeStr = "";
    if (i > ik) {
        if (h1 > hk && hk > h0) {
            //console.log("急流a2型壅水曲线");
            sltypeStr = "急流a2型壅水曲线";
        } else if (hk > h1 && h1 > h0) {
            //console.log("急流b2型降水曲线");
            sltypeStr = "急流b2型壅水曲线";
        } else if (hk > h0 && h0 > h1) {
            //console.log("急流c2型壅水曲线");
            sltypeStr = "急流c2型壅水曲线";
        }

        if (type_y == syyType.syy) {
            //实用堰
            //SGD


            //identify h0
            for (var t = 0; t < 10000; t++) {
                var h0_right = (Qc / b_c / (phi * Math.sqrt(2 * g * (H_0 - h0 * Math.cos(theta)))));
                h0 -= learning_rate * (h0 - h0_right);

                var chkValue = Math.abs(h0 - (Qc / b_c / (phi * Math.sqrt(2 * g * (H_0 - h0 * Math.cos(theta))))));
                if (chkValue < precision) {
                    //success
                    Value_H = h0;
                    break;
                }
            }

        } else if (type_y == syyType.kdy) {
            //宽顶堰
            Value_H = h_k;

        }

    } else {
        if (h1 > h0 && h0 > hk) {
            //console.log("缓流a1型壅水曲线");
            sltypeStr = "缓流a1型壅水曲线";
        } else if (h0 > h1 && h1 > hk) {
            //console.log("缓流b1型降水曲线");
            sltypeStr = "缓流b1型壅水曲线";
        } else if (h0 > hk && hk > h1) {
            //console.log("缓流c1型壅水曲线");
            sltypeStr = "缓流c1型壅水曲线";
        }

        Value_H = h1;
    }


    var outStr = "L断面水深：";
    var delta_L = L / (N - 1);
    var theta = Math.atan(i);

    outStr += Value_H.toFixed(3) + "|";
    for (var nn = 0; nn < N - 1; nn++) {
        Value_H = ssfl_sgd(st, m, 0.01, Value_H, b, Q, nz, theta, i, alpha, delta_L, 0.001);
        outStr += Value_H.toFixed(3) + "|";
        //console.log(Value_H);
    }

    return [sltypeStr, outStr];
}

//侧槽断溢流前缘的总长度
function ccdyl(Q, m, H, v0, varsigma_k) {
    var H0 = H + v0 * v0 / (2 * g);
    var L = Q / (varsigma_k * m * Math.sqrt(2 * g) * Math.pow(H0, 3 / 2));
    return L;
}
//侧槽断水面线sgd
function ccssm_sgd(nz, bs, bm, Q, L, N, sn, delta, lastH, lastv, lastR, lastQ, deltaH) {
    var learning_rate = 0.01;
    var bn = bs + (bm - bs) / L * (L - (sn - 1) * L / (N - 1));
    var Qn = Q - (Q / L) * (sn - 1) * (L / (N - 1));

    for (var ii = 0; ii < 10000; ii++) {
        var hn = lastH + deltaH - delta;
        var vn = Qn / (bn * hn);
        var Rn = bn * hn / (bn + 2 * hn);
        var aver_v = (lastv + vn) / 2;
        var aver_R = (lastR + Rn) / 2;
        var aver_J = aver_v * aver_v * nz * nz / (Math.pow(aver_R, 4 / 3));
        var _deltaH = (lastQ * (lastv + vn) / (g * (lastQ + Qn))) * ((lastv - vn) + vn * (lastQ - Qn) / lastQ) + aver_J * L / (N - 1);
        var _hn = lastH + _deltaH - delta;
        deltaH -= learning_rate * (deltaH - _deltaH);
        var chk = Math.abs(_hn - hn);
        if (chk < 0.001) {
            //console.log("_______________________");
            //console.log("当前断面n下标:" + sn);
            //console.log("deltaH:" + deltaH);
            //console.log("H:" + hn);
            return [hn, deltaH, vn, Rn, Qn];
        }
    }
}

//侧槽断水面线
function ccssm(Q, m, H, v0, varsigma_k, bs, bm, N, nz, i) {
    var L = ccdyl(Q, m, H, v0, varsigma_k);
    var hk = Math.pow(Q * Q / (bm * bm * g), 1 / 3);
    var hm = hk * (1.2 - 0.3 * ((bs / bm) - 1));
    var outStr = "侧槽内水面线水深：";
    var n = 1;
    var bn = bs + (bm - bs) / L * (L - (n - 1) * L / (N - 1));
    var vn = Q / (bn * hm);
    var Rn = bn * hm / (bn + 2 * hm);

    var Qn = Q;
    var deltaH = 0;
    var delta = i * L / (N - 1);

    outStr += hm.toFixed(4) + "|";

    for (var ii = 2; ii < N + 1; ii++) {
        res = ccssm_sgd(nz, bs, bm, Q, L, N, ii, delta, hm, vn, Rn, Qn, deltaH);
        hm = res[0];
        outStr += hm.toFixed(4) + "|";
        deltaH = res[1];
        vn = res[2];
        Rn = res[3];
        Qn = res[4];
    }

    return outStr;
}



//泄槽水面线SGD
function eqfm(h, theta, alpha, qc, bc) {
    var v = qc / (bc * h);
    return h * Math.cos(theta) + alpha * v * v / (2 * g);
}

function ssfl_sgd(sType, m, learning_rate, lastH, bc, qc, n, theta, i, alpha, deltaL, precision) {

    var h = lastH;
    var omega = 0;
    var x = 0;

    if (sType == shapeType.RECTANGLE) {
        omega = bc * h;
        x = (bc + 2 * h);
    } else if (sType == shapeType.LADDER) {
        omega = (bc + m * h) * h;
        x = (bc + 2 * h * Math.sqrt(1 + m * m));
    }

    var lastR = omega / x;
    var lastv = qc / omega;
    var lastC = Math.pow(lastR, 1 / 6) * 1 / n;

    var min_Val = 99999;
    var min_h = 0;
    var flag = true;
    for (var ii = 0; ii < 10000; ii++) {

        if (sType == shapeType.RECTANGLE) {
            omega = bc * h;
            x = (bc + 2 * h);
        } else if (sType == shapeType.LADDER) {
            omega = (bc + m * h) * h;
            x = (bc + 2 * h * Math.sqrt(1 + m * m));
        }

        var R = omega / x;
        var v = qc / omega;
        var C = Math.pow(R, 1 / 6) * 1 / n;
        var aver_v = (lastv + v) / 2;
        var aver_R = (lastR + R) / 2;
        var aver_C = (lastC + C) / 2;
        var J = aver_v * aver_v / (aver_R * aver_C * aver_C);
        var rightValue = ((eqfm(lastH, theta, alpha, qc, bc) + deltaL * (i - J)) - (alpha * v * v / (2 * g))) / (Math.cos(theta));
        h -= learning_rate * Math.abs(h - rightValue);

        var chkValue = Math.abs(Math.abs((eqfm(h, theta, alpha, qc, bc) - eqfm(lastH, theta, alpha, qc, bc)) / (i - J)) - deltaL);

        if (chkValue < min_Val && flag) {
            min_Val = chkValue;
            min_h = h;
        } else {
            flag = false;
        }

        if (chkValue < precision) {
            //success
            return h;
        }
    }

    //console.log("精度无法达到,当前精度为:" + min_Val);
    //console.log("h为:" + min_h);
    return min_h;

}

//泄槽水面线计算
function slotSurfaceLine(type, Qc, b_c, n, i, phi, H_0, N, L, alpha) {

    var h_k = Math.pow((Qc * Qc) / (b_c * b_c * g), 1 / 3);
    var R_k = b_c * h_k / (b_c + 2 * h_k);
    var C_k = 1 / n * Math.pow(R_k, 1 / 6);
    var i_k = ((Qc * Qc) / (b_c * b_c)) / (h_k * h_k * C_k * C_k * R_k);
    var outStr = "L断面水深：";

    var h0 = 0;
    var learning_rate = 0.01;
    var theta = Math.atan(i);
    var precision = 0.001;
    if (i > i_k) {
        //急流
        if (type == syyType.syy) {
            //实用堰
            //SGD


            //identify h0
            for (var t = 0; t < 10000; t++) {
                var h0_right = (Qc / b_c / (phi * Math.sqrt(2 * g * (H_0 - h0 * Math.cos(theta)))));
                h0 -= learning_rate * (h0 - h0_right);

                var chkValue = Math.abs(h0 - (Qc / b_c / (phi * Math.sqrt(2 * g * (H_0 - h0 * Math.cos(theta))))));
                if (chkValue < precision) {
                    //success
                    break;
                }
            }

        } else if (type == syyType.kdy) {
            //宽顶堰
            h0 = h_k;

        }

        //identify h0 - hn
        var delta_L = L / (N - 1);
        var outH = h0;
        //console.log(outH);
        outStr += outH.toFixed(3) + "|";
        for (var nn = 0; nn < N - 1; nn++) {
            outH = ssfl_sgd(false, 0, learning_rate, outH, b_c, Qc, n, theta, i, alpha, delta_L, precision);
            outStr += outH.toFixed(3) + "|";
            //console.log(outH);
        }

    } else {
        //输出缓流
        outStr += "缓流";
    }

    return outStr;
}

//带胸墙实用堰-带胸墙孔口泄流能力
function dxqsyy(D, H, v0, mu, b, n) {
    var H0 = H + v0 * v0 / (2 * g);
    var B = n * b;
    var Q = mu * B * D * Math.sqrt(2 * g * H0);
    return Q;
}

//驼峰堰
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
    var Q = c * m * n * epsilon * sigma_m * b * Math.sqrt(2 * g) * Math.pow(h0, 1.5);
    return Q;
}

function initEvent() {



    //明渠非均匀流水力计算参数
    document.getElementById("calculate_mqfjyls").addEventListener("click", function() {

        var b = parseFloat(document.getElementById("mqfjyls_b").value);
        var i = parseFloat(document.getElementById("mqfjyls_i").value);
        var nz = parseFloat(document.getElementById("mqfjyls_n").value);
        var Q = parseFloat(document.getElementById("mqfjyls_q").value);
        var m = parseFloat(document.getElementById("mqfjyls_m").value);
        var phi = parseFloat(document.getElementById("mqfjyls_phi").value);
        var alpha = parseFloat(document.getElementById("mqfjyls_alpha").value);
        var h1 = parseFloat(document.getElementById("mqfjyls_h1").value);
        var L = parseFloat(document.getElementById("mqfjyls_l").value);
        var N = parseFloat(document.getElementById("mqfjyls_bign").value);
        var st = document.getElementById('mqfjyls_stype').checked;
        var yt = document.getElementById('mqfjyls_ytype').checked;

        var res = mqfjyls(yt, st, phi, h1, alpha, Q, b, m, nz, i, L, N);

        document.getElementById("mqfjyls_res_0").value = res[0];
        document.getElementById("mqfjyls_res_1").value = res[1];
    });

    //明渠均匀流水力计算参数
    document.getElementById("calculate_mqjyls").addEventListener("click", function() {

        var b = parseFloat(document.getElementById("mqjyls_b").value);
        var i = parseFloat(document.getElementById("mqjyls_i").value);
        var n = parseFloat(document.getElementById("mqjyls_n").value);
        var Q = parseFloat(document.getElementById("mqjyls_q").value);
        var m = parseFloat(document.getElementById("mqjyls_m").value);
        var shape = document.getElementById('mqjyls_stype').checked;

        var res = mqjyls(shape, b, i, n, Q, m);
        document.getElementById("mqjyls_res_h").value = res[0];
        document.getElementById("mqjyls_res_v0").value = res[1];
    });
    //侧槽断溢流前缘的总长度

    document.getElementById("calculate_ccdyl").addEventListener("click", function() {

        var Q = parseFloat(document.getElementById("ccdyl_q").value);
        var m = parseFloat(document.getElementById("ccdyl_m").value);
        var H = parseFloat(document.getElementById("ccdyl_h").value);
        var v0 = parseFloat(document.getElementById("ccdyl_v0").value);
        var varsigma_k = parseFloat(document.getElementById("ccdyl_varsigma_k").value);

        var l = ccdyl(Q, m, H, v0, varsigma_k);
        document.getElementById("ccdyl_l").value = l;
    });
    //侧槽断水面线
    document.getElementById("calculate_ccssm").addEventListener("click", function() {

        var Q = parseFloat(document.getElementById("ccssm_q").value);
        var m = parseFloat(document.getElementById("ccssm_m").value);
        var H = parseFloat(document.getElementById("ccssm_h").value);
        var v0 = parseFloat(document.getElementById("ccssm_v0").value);
        var epsilon = parseFloat(document.getElementById("ccssm_epsilon").value);
        var bs = parseFloat(document.getElementById("ccssm_bs").value);
        var bm = parseFloat(document.getElementById("ccssm_bm").value);
        var N = parseFloat(document.getElementById("ccssm_n").value);
        var nz = parseFloat(document.getElementById("ccssm_nz").value);
        var i = parseFloat(document.getElementById("ccssm_i").value);

        var res = ccssm(Q, m, H, v0, epsilon, bs, bm, N, nz, i);
        document.getElementById("ccssm_outh").value = res;
    });
    //泄槽水面线
    document.getElementById("calculate_ssfl").addEventListener("click", function() {

        var Qc = parseFloat(document.getElementById("ssfl_qc").value);
        var b_c = parseFloat(document.getElementById("ssfl_bc").value);
        var n = parseFloat(document.getElementById("ssfl_n").value);
        var i = parseFloat(document.getElementById("ssfl_i").value);
        var phi = parseFloat(document.getElementById("ssfl_phi").value);
        var H_0 = parseFloat(document.getElementById("ssfl_h0").value);
        var N = parseFloat(document.getElementById("ssfl_bn").value);
        var L = parseFloat(document.getElementById("ssfl_l").value);
        var alpha = parseFloat(document.getElementById("ssfl_alpha").value);
        var chk_type = document.getElementById('ssfl_ssytype').checked;

        var res = slotSurfaceLine(chk_type, Qc, b_c, n, i, phi, H_0, N, L, alpha);
        document.getElementById("ssfl_outh").value = res;
    });
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

    document.getElementById("calculate_dxqsyy").addEventListener("click", function() {

        var D = parseFloat(document.getElementById("dxqsyy_D").value);
        var H = parseFloat(document.getElementById("dxqsyy_H").value);
        var v0 = parseFloat(document.getElementById("dxqsyy_v0").value);
        var mu = parseFloat(document.getElementById("dxqsyy_mu").value);
        var b = parseFloat(document.getElementById("dxqsyy_b").value);
        var n = parseFloat(document.getElementById("dxqsyy_n").value);

        var q = dxqsyy(D, H, v0, mu, b, n);
        document.getElementById("dxqsyy_q").value = q;
    });
}

addScript();
initEvent();

// L = 3386;
// N = 7;
// var outStr = "L断面水深：";
// var delta_L = L / (N - 1);
// var outH = 8.95;
// var m = 2;
// var i = 0.0003333333;
// var Qc = 500;
// var n = 0.025;
// var theta = Math.atan(i);
// var alpha = 1.05;
// var b_c = 45;
// //console.log(outH);
// outStr += outH.toFixed(3) + "|";
// for (var nn = 0; nn < N - 1; nn++) {
//     outH = ssfl_sgd(true, m, 0.01, outH, b_c, Qc, n, theta, i, alpha, delta_L, 0.001);
//     outStr += outH.toFixed(3) + "|";
//     console.log(outH);
// }
// console.log(outStr);