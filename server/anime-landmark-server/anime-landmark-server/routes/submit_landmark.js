var express = require('express');
var router = express.Router();
var fs = require('fs');

router.post('/', function(req, res, next) {

    //console.log(req.body.landmarkedName);

    fs.writeFile('./public/database/anime_landmark_data.json', JSON.stringify(req.body), function(err) {
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

    var response = {
        result: 'success submit!'
    };
    res.end(JSON.stringify(response));
    //res.end("jsontestback(" + JSON.stringify(response) + ")");
});

module.exports = router;