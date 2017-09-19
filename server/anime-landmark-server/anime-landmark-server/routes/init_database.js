var express = require('express');
var router = express.Router();
var fs = require('fs');

function init_data() {
    fs.readdir('./public/images', function(err, files) {
        if (err) {
            throw err;
        }
        //console.log(files[0]);

        //read all of the images name from file
        var imgArray = new Array();
        for (var i = 0; i < files.length; i++) {
            imgArray.push(files[i]);
        }

        //read database and write all of the images name into it
        fs.readFile('./public/database/anime_landmark_data.json', 'utf-8', function(err, data) {
            if (err) {
                throw err;
            }
            var anime_data = JSON.parse(data);
            for (var item in anime_data) {
                var inter = anime_data[item];
                //console.log(inter);
                if (item == 'needLandmarkedName') {
                    anime_data[item] = imgArray;
                }
            }

            //write edited res into database
            fs.writeFile('./public/database/anime_landmark_data.json', JSON.stringify(anime_data), function(err) {
                if (err) {
                    throw err;
                }

                console.log('Saved.');

                //test result
                fs.readFile('./public/database/anime_landmark_data.json', 'utf-8', function(err, data) {
                    if (err) {
                        throw err;
                    }
                    console.log(data);
                });
            });
        });

    });
}

router.get('/', function(req, res, next) {
    var response = {
        res: 'success init data!'
    };
    console.log(response);


    //init data
    init_data();

    res.end("jsontestback(" + JSON.stringify(response) + ")");
});


module.exports = router;