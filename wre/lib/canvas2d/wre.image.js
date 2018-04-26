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
    CalculateBreseHam: function(canvasElement, x1, y1, x2, y2) {
        var context = canvasElement.getContext('2d');
        context.clearRect(0, 0, canvasElement.width, canvasElement.height);

        var width = canvasElement.width;
        var height = canvasElement.height;

        if (x1 >= width || x1 < 0 || y1 >= height || y1 < 0 || x2 >= width || x2 < 0 || y2 >= height || y2 < 0) return;

        var dx = x2 - x1;
        var dy = y2 - y1;
        var x = x1;
        var y = y1;
        var stepx = 1;
        var stepy = 1;
        if (x1 > x2) stepx = -1;
        if (y1 > y2) stepy = -1;

        var bitmapData = [];
        if (dx > dy) {
            var e = dy * 2 - dx;
            for (var i = 0; i <= dx; i++) {
                var index = (x + y * width) * 4;
                bitmapData[index + 0] = 0;
                bitmapData[index + 1] = 0;
                bitmapData[index + 2] = 0;
                bitmapData[index + 3] = 255;
                x += stepx;
                e += dy;
                if (e >= 0) {
                    y += stepy;
                    e -= dx;
                }
            }
        } else {
            var e = dx * 2 - dy;
            for (var i = 0; i <= dy; i++) {
                var index = (parseInt(x) + parseInt(y) * width) * 4;
                bitmapData[index + 0] = 0;
                bitmapData[index + 1] = 0;
                bitmapData[index + 2] = 0;
                bitmapData[index + 3] = 255;
                y += stepy;
                e += dx;
                if (e >= 0) {
                    x += stepx;
                    e -= dy;
                }
            }
        }


        var imageData = this.GetImageDataByBitmap(canvasElement, bitmapData);
        context.putImageData(imageData, 0, 0);
    },
    CalculateDDA: function(canvasElement, x1, y1, x2, y2) {
        var context = canvasElement.getContext('2d');
        context.clearRect(0, 0, canvasElement.width, canvasElement.height);

        var width = canvasElement.width;
        var height = canvasElement.height;

        if (x1 >= width || x1 < 0 || y1 >= height || y1 < 0 || x2 >= width || x2 < 0 || y2 >= height || y2 < 0) return;

        var dx = x2 - x1;
        var dy = y2 - y1;
        var n = 0;
        var xinc = 0;
        var yinc = 0;
        if (Math.abs(dx) > Math.abs(dy)) {
            n = Math.abs(dx);
            if (n == 0) {
                xinc = 0;
                yinc = dy / n;
            } else {
                xinc = dx / n;
                yinc = dy / n;
            }
        } else {
            n = Math.abs(dy);
            if (n == 0) {
                yinc = 0;
                xinc = dx / n;
            } else {
                xinc = dx / n;
                yinc = dy / n;
            }
        }





        var bitmapData = [];
        var x = x1;
        var y = y1;
        for (var i = 1; i <= n; i++) {
            var index = (parseInt(x + 0.5) + parseInt(y + 0.5) * width) * 4;
            bitmapData[index + 0] = 0;
            bitmapData[index + 1] = 0;
            bitmapData[index + 2] = 0;
            bitmapData[index + 3] = 255;
            x += xinc;
            y += yinc;

        }
        var imageData = this.GetImageDataByBitmap(canvasElement, bitmapData);
        context.putImageData(imageData, 0, 0);
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


var LifeGame = function(size, rate) {
    this.field = [];
    this._field = [];
    this.survival_min = 2;
    this.survival_max = 3;
    this.birth_min = 3;
    this.birth_max = 3;
    this.rate = rate || 0.5;
    this.size = size || 100;
    this.init();
};

LifeGame.prototype = {
    init: function() {
        for (var i = 0; i < this.size; i++) {
            this.field[i] = new Array(this.size);
            this._field[i] = new Array(this.size);
            for (var j = 0; j < this.size; j++) {
                this.field[i][j] = (Math.random() > this.rate) ? true : false;
                this._field[i][j] = this.field[i][j];
            }
        }
    },
    read: function(i, j) {
        return this.field[i][j];
    },
    step: function() {
        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size; j++) {
                var ip = (i == this.size - 1) ? 0 : i + 1;
                var im = (i == 0) ? this.size - 1 : i - 1;
                var jp = (j == this.size - 1) ? 0 : j + 1;
                var jm = (j == 0) ? this.size - 1 : j - 1;

                var count = 0;

                if (this._field[im][jm]) count++;
                if (this._field[im][j]) count++;
                if (this._field[im][jp]) count++;
                if (this._field[i][jm]) count++;
                if (this._field[i][jp]) count++;
                if (this._field[ip][jm]) count++;
                if (this._field[ip][j]) count++;
                if (this._field[ip][jp]) count++;

                if (!this.field[i][j] && (count >= this.birth_min && count <= this.birth_max)) this.field[i][j] = true;
                else if (this.field[i][j] && (count >= this.survival_min && count <= this.survival_max)) this.field[i][j] = true;
                else if (this.field[i][j] && count < this.survival_min) this.field[i][j] = false;
                else if (this.field[i][j] && count > this.survival_max) this.field[i][j] = false;
            }
        }
        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size; j++) {
                this._field[i][j] = this.field[i][j];
            }
        }
    }
}