//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////                                                                      //
////  AnimeFacialPointSystem//////////   v0.0                                                               //
//////////////////////////////////////                                                                      //
//////////////////////////////////////  Copyright 2017-2018,                                                //
//////////////////////////////////////  Last vist: 9, 19, 2017  by Raymond Wang                             //
//////////////////////////////////////                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////WANG  XU///-->\


var img_div = document.getElementById('img');
var img_canvas = img_div.getContext('2d');


var img = new Image();
//img.src = './img/nxn.jpg';
//img.onload = init; // init

var curMousePosInCvsX = 0;
var curMousePosInCvsY = 0;
var maxLabeledPoints = 5;
var curIndex = 0;
var curImageName = "";
//json storage data
var xArray = new Array();
var yArray = new Array();


function windowPos2CanvasPos(cvs, x, y) {
    var box = cvs.getBoundingClientRect();
    return {
        x: x - box.left * (cvs.width / box.width),
        y: y - box.top * (cvs.height / box.height)
    }
}

function drawBg() {
    var VERTICAL_LINE_SPACING = 12,
        i = img_div.height;

    img_canvas.clearRect(0, 0, img_div.width, img_div.height);
    img_canvas.strokeStyle = 'lightgray';
    img_canvas.lineWidth = 0.5;
    while (i > VERTICAL_LINE_SPACING * 4) {
        img_canvas.beginPath();
        img_canvas.moveTo(0, 1);
        img_canvas.lineTo(img_div.width, i);
        img_canvas.stroke();
        i -= VERTICAL_LINE_SPACING;
    }
}


function drawImg() {
    img_canvas.drawImage(img, 0, 0);
}

function drawLabeledPoints() {

    for (j = 0; j < curIndex; j++) {
        img_canvas.strokeStyle = "blue";
        img_canvas.beginPath();
        img_canvas.arc(xArray[j], yArray[j], 10, 0, 2 * Math.PI, true);
        img_canvas.closePath();
        img_canvas.stroke();

        img_canvas.fillStyle = "red";
        img_canvas.beginPath();
        img_canvas.arc(xArray[j], yArray[j], 2, 0, 2 * Math.PI, true);
        img_canvas.closePath();
        img_canvas.fill();
    }


}

function drawGuideLines(x, y) {
    img_canvas.strokeStyle = 'red';
    img_canvas.lineWidth = 5;

    function drawHorizontalLine(y) {
        img_canvas.beginPath();
        img_canvas.moveTo(0, y + .5);
        img_canvas.lineTo(img_div.width, y + .5);
        img_canvas.stroke();
    }

    function drawVerticalLine(x) {
        img_canvas.beginPath();
        img_canvas.moveTo(x + .5, 0)
        img_canvas.lineTo(x + .5, img_div.height);
        img_canvas.stroke();
    }

    drawVerticalLine(x);
    drawHorizontalLine(y);
}

function updatePosition(x, y) {
    curMousePosInCvsX = x.toFixed(0);
    curMousePosInCvsY = y.toFixed(0);
    //console.log('(' + x.toFixed(0) + ',' + y.toFixed(0) + ')');
}

function init_img() {
    img_div.width = img.width;
    img_div.height = img.height;
    img_canvas.drawImage(img, 0, 0);
}


function init_database() {
    $.ajax({
        type: 'GET',
        url: 'http://127.0.0.1:3000/init_database',
        contentType: 'application/json',
        dataType: "jsonp",
        jsonp: 'callback',
        jsonpCallback: "jsontestback",
        error: function(XMLHttpReuqest, textStautus, errothrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpReuqest.readyState);
            console.log(XMLHttpRequest.responseText);
            console.log(textStautus);
            console.log(errothrown);
        },
        success: function(json) {
            console.log(json['res']);
        }
    });
}

//init func
function init() {

    //init_database();

    //get image
    $.ajax({
        type: 'GET',
        url: 'http://127.0.0.1:3000/get_image',
        contentType: 'application/json',
        dataType: "jsonp",
        jsonp: 'callback',
        jsonpCallback: "jsontestback",
        error: function(XMLHttpReuqest, textStautus, errothrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpReuqest.readyState);
            console.log(XMLHttpRequest.responseText);
            console.log(textStautus);
            console.log(errothrown);

            img.src = './img/nxn.jpg';
            img.onload = init_img;
        },
        success: function(json) {
            //console.log(json['imagename']);
            //get image from server
            curImageName = json['imagename'];
            img.src = 'http://127.0.0.1:3000/images/' + json['imagename'];
            img.onload = init_img;
            // console.log(img.src);
        }
    });
}

img_div.onmousemove = function(e) {
    var loc = windowPos2CanvasPos(img_div, e.clientX, e.clientY);
    drawBg();
    drawImg();
    drawLabeledPoints();
    drawGuideLines(loc.x, loc.y);
    updatePosition(loc.x, loc.y);
}

img_div.onclick = function(e) {

    if (curIndex < maxLabeledPoints) {
        xArray.push(curMousePosInCvsX);
        yArray.push(curMousePosInCvsY);
        curIndex = curIndex + 1;
    } else {
        alert('the maxium of the labeled points is ' + maxLabeledPoints + '. If you make a wrong point, you can reset the status and restart to label the point.');
    }


    //console.log('(' + curMousePosInCvsX + ',' + curMousePosInCvsY + ')');
}


$("#btn_reset").click(function() {
    xArray.splice(0, xArray.length);
    yArray.splice(0, yArray.length);
    curIndex = 0;
    drawBg();
    drawImg();
});

function removeByValue(arr, val) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == val) {
            arr.splice(i, 1);
            break;
        }
    }
}

function submitDatabase(database, imgname) {
    for (var item in database) {
        var inter = database[item];
        if (item == 'needLandmarkedName') {
            removeByValue(inter, imgname);
        } else if (item == 'landmarkedName') {
            inter.push(imgname);
        } else if (item == 'landmarkData') {
            var landmarkObj = new Object();
            landmarkObj['image_name'] = imgname;
            landmarkObj['x_coordinate'] = xArray;
            landmarkObj['y_coordinate'] = yArray;
            landmarkObj['smile'] = 0;
            landmarkObj['position'] = 1;
            inter.push(landmarkObj);
        }
    }

    console.log(JSON.stringify(database));

    $.ajax({
        type: 'POST',
        processData: false,
        url: 'http://127.0.0.1:3000/submit_landmark',
        contentType: 'application/json',
        dataType: "json",
        data: JSON.stringify(database),
        success: function(json) {
            console.log(json);
        }
    });

}

$("#btn_submit").click(function() {
    $.ajax({
        type: 'GET',
        url: 'http://127.0.0.1:3000/get_database',
        contentType: 'application/json',
        dataType: "jsonp",
        jsonp: 'callback',
        jsonpCallback: "jsontestback",
        error: function(XMLHttpReuqest, textStautus, errothrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpReuqest.readyState);
            console.log(XMLHttpRequest.responseText);
            console.log(textStautus);
            console.log(errothrown);
        },
        success: function(json) {
            //console.log(json['database']);

            //check current image need landmark or not
            var res_database = JSON.parse(json['database']);
            for (var item in res_database) {
                var inter = res_database[item];
                if (item == 'needLandmarkedName') {
                    for (var ik = 0; ik < inter.length; ik++) {
                        if (inter[ik] == curImageName) {
                            console.log("need landmark, you can submit!");

                            if (xArray.length == maxLabeledPoints && yArray.length == maxLabeledPoints) {
                                console.log('enough points, you can submit!');
                                submitDatabase(res_database, curImageName);
                            } else {
                                console.log('please label enough points!');
                            }

                            break;
                        }
                    }
                }
            }
        }
    });
});



init();