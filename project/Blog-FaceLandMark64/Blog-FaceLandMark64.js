//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////                                                                      //
////  FaceLandmark64 SubTask//////////   v0.0                                                               //
//////////////////////////////////////                                                                      //
//////////////////////////////////////  Copyright 2017-2018,                                                //
//////////////////////////////////////  Last vist: 10, 03, 2017  by Raymond Wang                             //
//////////////////////////////////////                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////WANG  XU///-->\



//----------------------server info
var server_address = "http://118.190.204.181:3388/";


//--------------------------------------------
var img_div = document.getElementById('img');
var img_canvas = img_div.getContext('2d');


var img = new Image();
//img.src = './img/nxn.jpg';
//img.onload = init; // init

var maxGender = 2;
var maxSmile = 2;
var maxHeadPose = 5;
var maxGlasses = 2;

var deletepart = "";
var curImageName = "";
//json storage data
var xArray = new Array();
var yArray = new Array();
//--------------------------------------------





function drawImg() {
    img_canvas.drawImage(img, 0, 0);
}

function drawLabeledPoints(ratio_w, ratio_h) {

    for (j = 0; j < xArray.length; j++) {
        img_canvas.fillStyle = "red";
        img_canvas.beginPath();
        img_canvas.arc(xArray[j] * ratio_w, yArray[j] * ratio_h, 2, 0, 2 * Math.PI, true);
        img_canvas.closePath();
        img_canvas.fill();
    }


}





function init_img() {
    img_div.width = 1024.0;
    img_div.height = 768.0;

    ratio_w = img_div.width / img.width
    ratio_h = img_div.height / img.height

    img_canvas.drawImage(img, 0, 0, img.width, img.height, 0, 0, 1024, 768);
    drawLabeledPoints(ratio_w, ratio_h);
}



function init_database() {
    $.ajax({
        type: 'GET',
        url: server_address + 'facelandmark/init_database',
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

function getNextImage() {
    $.ajax({
        type: 'GET',
        url: server_address + 'facelandmark/get_facelandmark64',
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

            //console.log("array_y:" + json['array_y']);
            //console.log("array_x:" + json['array_x']);
            //console.log("gender:" + json['gender']);
            //console.log("smile:" + json['smile']);
            //console.log("headpose:" + json['headpose']);
            //console.log("glasses:" + json['glasses']);

            for (var xx in json['array_x']) {
                xArray.push(json['array_x'][xx])
            }

            for (var yy in json['array_y']) {
                yArray.push(json['array_y'][yy])
            }

            //console.log("array_y:" + yArray);
            //console.log("array_x:" + xArray);


            $('#input_unlandmark_number').val(json['unlandmarknumber']);

            $('#input_gender').val(json['gender']);
            $('#input_smile').val(json['smile']);
            $('#input_glasses').val(json['glasses']);
            $('#input_headpose').val(json['headpose']);

            deletepart = curImageName.split('dataset')[0];
            curImageName = curImageName.split('dataset')[1];


            img.src = server_address + 'images' + curImageName;
            img.onload = init_img;
            // console.log(img.src);
            alert("successful to get the anime image from server!");
        }
    });
}

function reset_img() {
    xArray.splice(0, xArray.length);
    yArray.splice(0, yArray.length);

    $("#input_gender").val(000);
    $("#input_smile").val(000);
    $("#input_headpose").val(000);
    $("#input_glasses").val(000);
}

//init func
function init() {

    //init_database();

    //get image
    getNextImage();
}



$("#btn_next").click(function() {
    reset_img();
    getNextImage();
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
            removeByValue(inter, deletepart + "dataset" + imgname);
        } else if (item == 'landmarkedName') {
            inter.push(imgname);
        } else if (item == 'landmarkedData') {
            var landmarkObj = new Object();
            landmarkObj['image_name'] = imgname;
            landmarkObj['x_coordinate'] = xArray;
            landmarkObj['y_coordinate'] = yArray;
            landmarkObj['gender'] = $("#input_gender").val();
            landmarkObj['headpose'] = $("#input_headpose").val();
            landmarkObj['glasses'] = $("#input_glasses").val();
            landmarkObj['smile'] = $("#input_smile").val();

            inter.push(landmarkObj);
        }
    }

    //console.log(JSON.stringify(database));

    //callback bug,TODO!
    $.ajax({
        type: 'POST',
        url: server_address + 'facelandmark/submit_facesubtask',
        contentType: 'application/json',
        dataType: "json",
        data: JSON.stringify(database),
        error: function(XMLHttpReuqest, textStautus, errothrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpReuqest.readyState);
            console.log(XMLHttpRequest.responseText);
            console.log(textStautus);
            console.log(errothrown);
        },
        success: function(json) {
            alert(json['result']);
            reset_img();
            getNextImage();
        }
    });

    //reset_img();
    //getNextImage();
}

$("#btn_submit").click(function() {
    $.ajax({
        type: 'GET',
        url: server_address + 'facelandmark/get_database',
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
                        if (inter[ik].split('dataset')[1] == curImageName) {
                            //console.log("need landmark, you can submit!");

                            var genderValue = $("#input_gender").val();
                            var headposeValue = $("#input_headpose").val();
                            var glassesValue = $("#input_glasses").val();
                            var smileValue = $("#input_smile").val();


                            if (genderValue > 0 && genderValue <= maxGender && headposeValue > 0 && headposeValue <= maxHeadPose && glassesValue > 0 && glassesValue <= maxGlasses && smileValue > 0 && smileValue <= maxSmile) {
                                //console.log('enough points, you can submit!');
                                submitDatabase(res_database, curImageName);
                            } else {
                                alert('please check you entered value!');
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