var express = require('express');
var router = express.Router();
var fs = require('fs');

function GetRandomNum(Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    return (Min + Math.round(Rand * Range));
}

router.get('/', function(req, res, next) {
    //check database, find a need landmark image
    fs.readFile('./public/database/face_landmark64.json', 'utf-8', function(err, data) {
        if (err) {
            throw err;
        }
        var face64_data = JSON.parse(data);
        for (var item in face64_data) {
            var inter = face64_data[item];
            //console.log(inter);
            if (item == 'needLandmarkedName') {
                var retureNum = GetRandomNum(0, inter.length - 1);
                //return image
                var returnImageName = face64_data[item][retureNum];
                var returnCoordArrayY = Array();
                var returnCoordArrayX = Array();
                var gender = -1;
                var smile = -1;
                var headpose = -1;
                var glasses = -1;


                for (var ii in face64_data) {
                    var inter_sec = face64_data[ii];

                    if (ii == 'landmarkData') {
                        for (var pp in inter_sec) {
                            var find_imagename = inter_sec[pp]['image_name'];
                            if (find_imagename == returnImageName) {

                                for (var yindex in inter_sec[pp]['y_coordinate']) {
                                    returnCoordArrayY.push(inter_sec[pp]['y_coordinate'][yindex])
                                }

                                for (var xindex in inter_sec[pp]['x_coordinate']) {
                                    returnCoordArrayX.push(inter_sec[pp]['x_coordinate'][xindex])
                                }


                                returnCoordArrayX = inter_sec[pp]['x_coordinate'];
                                gender = inter_sec[pp]['gender'];
                                smile = inter_sec[pp]['smile'];
                                headpose = inter_sec[pp]['headpose'];
                                glasses = inter_sec[pp]['glasses'];
                                break;
                            }

                        }
                    }
                }

                //var returnImageLandMark = 


                //console.log(returnCoordArrayY);
                var response = {
                    imagename: returnImageName,
                    array_y: returnCoordArrayY,
                    array_x: returnCoordArrayX,
                    gender: gender,
                    smile: smile,
                    headpose: headpose,
                    glasses: glasses,
                    unlandmarknumber: inter.length
                };

                res.end("jsontestback(" + JSON.stringify(response) + ")");
            }
        }
    });
});

module.exports = router;