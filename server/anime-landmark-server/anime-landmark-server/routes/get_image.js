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
    fs.readFile('./public/database/anime_landmark_data.json', 'utf-8', function(err, data) {
        if (err) {
            throw err;
        }
        var anime_data = JSON.parse(data);
        for (var item in anime_data) {
            var inter = anime_data[item];
            //console.log(inter);
            if (item == 'needLandmarkedName') {
                var retureNum = GetRandomNum(0, inter.length - 1);
                //return image
                var returnImageName = anime_data[item][retureNum];

                var response = {
                    imagename: returnImageName,
                    unlandmarknumber: inter.length
                };

                res.end("jsontestback(" + JSON.stringify(response) + ")");
            }
        }
    });
});

module.exports = router;