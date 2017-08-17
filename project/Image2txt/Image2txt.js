
var img_div = document.getElementById('img');
var img_canvas = img_div.getContext('2d');
var txt_div = document.getElementById('txt');
var txt_canvas = txt_div.getContext('2d');


var fileBtn = document.getElementById("up-button");
var downloadBtn = document.getElementById("down-button");
var downloadImg = document.getElementById("download-img");

var img = new Image();
img.src = './img/nxn.jpg';
img.onload = init; // init


//bind event
fileBtn.onchange = getImg;
downloadBtn.onclick = saveImg2PC;

//generate txt according to gray value
function toText(g) {
    if (g <= 30) {
        return '8';
    } else if (g > 30 && g <= 60) {
        return '&';
    } else if (g > 60 && g <= 120) {
        return '$';
    }  else if (g > 120 && g <= 150) {
        return '*';
    } else if (g > 150 && g <= 180) {
        return 'o';
    } else if (g > 180 && g <= 210) {
        return '!';
    } else if (g > 210 && g <= 240) {
        return ';';
    }  else {
        return '.';
    }
}


//convert rgb to gray
function getGray(r, g, b) {
    return 0.299 * r + 0.578 * g + 0.114 * b;
}

//img2txt
function init() {
    txt_div.width = img.width;
    txt_div.height = img.height;
    txt_canvas.font = "bold 10px Courier New";
    txt_canvas.fillStyle = "blue";


    
    img_div.width = img.width;
    img_div.height = img.height;
    img_canvas.drawImage(img, 0, 0);
    var imgData = img_canvas.getImageData(0, 0, img.width, img.height);
    var imgDataArr = imgData.data;
    var imgDataWidth = imgData.width;
    var imgDataHeight = imgData.height;
    for (h = 0; h < imgDataHeight; h += 6) {
        for (w = 0; w < imgDataWidth; w += 6) {
            var index = (w + imgDataWidth * h) * 4;
            var r = imgDataArr[index + 0];
            var g = imgDataArr[index + 1];
            var b = imgDataArr[index + 2];
            var gray = getGray(r, g, b);
            txt_canvas.fillText(toText(gray), w, h);
        }
    }
    
}




//save image
function saveImg2PC() {
    
    var type = 'png';
    var imgdata = txt_div.toDataURL(type);

    var fixtype = function (type) {
        type = type.toLocaleLowerCase().replace(/jpg/i, 'jpeg');
        var r = type.match(/png|jpeg|bmp|gif/)[0];
        return 'image/' + r;
    }
    imgdata = imgdata.replace(fixtype(type), 'image/octet-stream')

    var saveFile = function (data, filename) {
        var link = document.createElement('a');
        link.href = data;
        link.download = filename;
        var event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        link.dispatchEvent(event);
    }
    var filename = new Date().toLocaleDateString() + '.' + type;
    
    //console.log(imgdata);
    saveFile(imgdata, filename);

}

//get image
function getImg(file) {
    var reader = new FileReader();
    reader.readAsDataURL(fileBtn.files[0]);
    reader.onload = function () {
        img.src = reader.result;
    }
}
