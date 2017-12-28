//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////                                                                      //
////  Image-Process-Lab      //////////   v0.0                                                              //
//////////////////////////////////////                                                                      //
//////////////////////////////////////  Copyright 2017-2018,                                                //
//////////////////////////////////////  Last vist: 12, 27, 2017  by Raymond Wang                            //
//////////////////////////////////////                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////WANG  XU///-->




var DrawPolygon = function() {};

DrawPolygon.prototype = {

    DrawPolygon: function(canvasElement, n, theta0, r) {
        var context = canvasElement.getContext('2d');
        context.clearRect(0, 0, canvasElement.width, canvasElement.height);
        context.beginPath();
        for (var m = 0; m < n; m++) {
            x = r * Math.cos(theta0 + 2 * Math.PI * m / n);
            y = r * Math.sin(theta0 + 2 * Math.PI * m / n);
            if (m == 0) context.moveTo(x + canvasElement.width / 2, y + canvasElement.height / 2);
            else context.lineTo(x + canvasElement.width / 2, y + canvasElement.height / 2);
        }
        context.closePath();
    },

    DrawUzaMaki: function(canvasElement, n, N, r, theta0, a) {
        var context = canvasElement.getContext('2d');
        context.clearRect(0, 0, canvasElement.width, canvasElement.height);
        context.beginPath();
        for (var m = 0; m < N; m++) {
            var x = r * Math.pow(a, m) * Math.cos(theta0 + 2 * Math.PI * m / n);
            var y = r * Math.pow(a, m) * Math.sin(theta0 + 2 * Math.PI * m / n);
            if (m == 0) context.moveTo(x + canvasElement.width / 2, y + canvasElement.height / 2);
            else context.lineTo(x + canvasElement.width / 2, y + canvasElement.height / 2);
        }
    }

};