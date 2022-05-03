var express = require('express');
var router = express.Router();
var fs = require('fs');


router.get('/video/:film/:file', function (req, res, next) {
    var params = req.params;
    console.log('params: ', params);

    if (params.film && params.file) {
        var file_path = './public/videos/' + params.film + '/' + params.file;
        console.log('File_path: ', file_path);
        fs.readFile(file_path, function (error, content) {
            if (error) {
                let err_msg = '';
                if (error.code == 'ENOENT') {
                    err_msg = 'Video not found.';
                } else {
                    err_msg = 'Sorry, check with the site admin for error: ' + error.code + ' ..\n';
                }
                res.writeHead(500);
                res.end(err_msg);

            } else {
                res.writeHead(200, { 'Access-Control-Allow-Origin': '*' });
                res.end(content, 'utf-8');
            }
        });
    } else {
        console.log('Param is not existed!');
        res.end('', 'utf-8');
    }
});




module.exports = router;
