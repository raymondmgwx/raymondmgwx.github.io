//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////                                                                      //
////  Image-Process-Lab      //////////   v0.0                                                              //
//////////////////////////////////////                                                                      //
//////////////////////////////////////  Copyright 2017-2018,                                                //
//////////////////////////////////////  Last vist: 12, 27, 2017  by Raymond Wang                            //
//////////////////////////////////////                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////WANG  XU///-->




var ImgProcess = function() {};

ImgProcess.prototype = {
    GetImageDataByBitmap: function(canvasElement, bitmapData) {
        var width = canvasElement.width;
        var height = canvasElement.height;
        var context = canvasElement.getContext('2d');
        var imageData = context.createImageData(width, height);
        for (var i = 0; i < width * height * 4; i++) {
            imageData.data[i] = bitmapData[i];
        }
        return imageData;
    },
    CreateRandomImage: function(canvasElement) {
        var context = canvasElement.getContext('2d');
        context.clearRect(0, 0, canvasElement.width, canvasElement.height);

        var width = canvasElement.width;
        var height = canvasElement.height;
        //console.log(width);
        //console.log(height);
        var bitmapData = [];
        for (var j = 0; j < height; j++) {
            for (var i = 0; i < width; i++) {
                var index = (j * width + i) * 4;
                bitmapData[index + 0] = 255 * Math.random();
                bitmapData[index + 1] = 255 * Math.random();
                bitmapData[index + 2] = 255 * Math.random();
                bitmapData[index + 3] = 255;
            }
        }

        var imageData = this.GetImageDataByBitmap(canvasElement, bitmapData);
        //console.log(imageData);
        context.putImageData(imageData, 0, 0);
    },
    CreateColorModelImage: function(canvasElement) {
        var context = canvasElement.getContext('2d');
        context.clearRect(0, 0, canvasElement.width, canvasElement.height);

        var width = canvasElement.width;
        var height = canvasElement.height;

        var half_width = width / 2;
        var half_height = height / 2;

        var bitmapData = [];
        for (var j = 0; j < height; j++) {
            for (var i = 0; i < width; i++) {
                var index = (j * width + i) * 4;

                if (i < half_width && j < half_height) {
                    bitmapData[index + 0] = 255 * (1 - i / half_width);
                    bitmapData[index + 1] = 255 * (1 - j / half_height);
                    bitmapData[index + 2] = 0;
                } else if (i >= half_width && j < half_height) {
                    ii = i - half_width;
                    bitmapData[index + 0] = 0;
                    bitmapData[index + 1] = 255 * (1 - j / half_height);
                    bitmapData[index + 2] = 255 * (ii / half_width);
                } else if (i >= half_width && j >= half_height) {
                    ii = i - half_width;
                    jj = j - half_height;
                    bitmapData[index + 0] = 255 * (jj / half_width);
                    bitmapData[index + 1] = 0;
                    bitmapData[index + 2] = 255 * (ii / half_width);
                } else {
                    bitmapData[index + 0] = 255;
                    bitmapData[index + 1] = 255;
                    bitmapData[index + 2] = 255;
                }

                bitmapData[index + 3] = 255;
            }
        }

        var imageData = this.GetImageDataByBitmap(canvasElement, bitmapData);
        context.putImageData(imageData, 0, 0);
    },
    CreateGaussianImage: function(canvasElement) {
        var context = canvasElement.getContext('2d');
        context.clearRect(0, 0, canvasElement.width, canvasElement.height);

        var width = canvasElement.width;
        var height = canvasElement.height;

        var _x = width / 2;
        var _y = height / 2;
        var _sigma = 10000;

        var bitmapData = [];
        for (var j = 0; j < height; j++) {
            for (var i = 0; i < width; i++) {
                var index = (j * width + i) * 4;
                var x = i;
                var y = j;
                var w = Math.exp(-((x - _x) * (x - _x) + (y - _y) * (y - _y)) / (2 * _sigma));

                bitmapData[index + 0] = 255 * w;
                bitmapData[index + 1] = 0;
                bitmapData[index + 2] = 255 * w;
                bitmapData[index + 3] = 255;
            }
        }

        var imageData = this.GetImageDataByBitmap(canvasElement, bitmapData);

        context.putImageData(imageData, 0, 0);
    },
    CreateWavePlaneImage: function(canvasElement, f0, k, theta) {
        var context = canvasElement.getContext('2d');
        context.clearRect(0, 0, canvasElement.width, canvasElement.height);

        var width = canvasElement.width;
        var height = canvasElement.height;

        var pi_theta = Math.PI * theta / 180;
        var pi_k = Math.PI * k;

        var bitmapData = [];
        for (var j = 0; j < height; j++) {
            for (var i = 0; i < width; i++) {
                var index = (j * width + i) * 4;
                var x = i;
                var y = j;
                var f = f0 * Math.sin(pi_k * (x * Math.cos(pi_theta) + y * Math.sin(pi_theta)));

                if (f > 0) bitmapData[index + 0] = 255 * f;
                else bitmapData[index + 0] = 0;
                bitmapData[index + 1] = 0;

                if (f < 0) bitmapData[index + 2] = 255 * (-f);
                else bitmapData[index + 2] = 0;
                bitmapData[index + 3] = 255;
            }
        }

        var imageData = this.GetImageDataByBitmap(canvasElement, bitmapData);

        context.putImageData(imageData, 0, 0);
    },
    CreateMandelbrotImage: function(canvasElement, min_a, min_b, max_a, max_b, infty, step, flag_step) {
        var context = canvasElement.getContext('2d');
        context.clearRect(0, 0, canvasElement.width, canvasElement.height);

        var width = canvasElement.width;
        var height = canvasElement.height;


        var bitmapData = [];
        for (var j = 0; j < height; j++) {
            for (var i = 0; i < width; i++) {
                var index = (j * width + i) * 4;
                var a = min_a + (max_a - min_a) * i / width;
                var b = min_b + (max_b - min_b) * j / height;

                var x = 0;
                var y = 0;

                var flag = false;
                var hn = 0;
                for (var n = 0; n < step; n++) {
                    _x = (x * x) - (y * y) + a;
                    _y = 2 * x * y + b;

                    x = _x;
                    y = _y;



                    if (Math.abs(x) > infty) {
                        flag = true;
                        hn = n;
                        break;
                    }
                }

                if (!flag) {
                    bitmapData[index + 0] = 0;
                    bitmapData[index + 1] = 0;
                    bitmapData[index + 2] = 255;
                } else {

                    if (flag_step) {
                        bitmapData[index + 0] = 255 * (1 - hn / step);
                        bitmapData[index + 1] = 255 * (1 - hn / step);
                        bitmapData[index + 2] = 255 * (1 - hn / step);
                    } else {

                        bitmapData[index + 0] = 255;
                        bitmapData[index + 1] = 255;
                        bitmapData[index + 2] = 255;
                    }

                }
                bitmapData[index + 3] = 255;
            }
        }

        var imageData = this.GetImageDataByBitmap(canvasElement, bitmapData);

        context.putImageData(imageData, 0, 0);
    }

};