var express = require('express');
var router = express.Router();
var fs = require('fs');

function init_data() {
    fs.readFile('./public/database/face_landmark64.json', 'utf-8', function(err, data) {
        if (err) {
            throw err;
        }
        var face64_data = JSON.parse(data);
        var imgArray = new Array();


        //load image
        for (var item in face64_data) {
            var inter = face64_data[item];
            //console.log(inter);
            if (item == 'landmarkData') {

                for (var p in inter) {

                    var imagePath = inter[p]['image_name'];
                    imgArray.push(imagePath)

                }
            }
        }


        //add to need label
        for (var item in face64_data) {
            var inter = face64_data[item];
            if (item == 'needLandmarkedName') {
                face64_data[item] = imgArray;
                break;
            }
        }

        fs.writeFile('./public/database/face_landmark64.json', JSON.stringify(face64_data), function(err) {
            if (err) {
                throw err;
            }

            console.log('Saved face_landmark64.');
        });
    });


}

router.get('/', function(req, res, next) {
    var response = {
        res: 'success init face64 data!'
    };
    console.log(response);


    //init data
    init_data();

    res.end("jsontestback(" + JSON.stringify(response) + ")");
});


module.exports = router;