var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET users listing. */
router.get('/', function(req, res, next) {
    fs.readFile('./public/database/face_landmark64.json', 'utf-8', function(err, data) {
        if (err) {
            throw err;
        }
        var response = {
            database: data
        };
        res.end("jsontestback(" + JSON.stringify(response) + ")");
    });
});

module.exports = router;