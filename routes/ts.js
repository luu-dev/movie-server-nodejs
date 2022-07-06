var express = require('express');
const common = require('./common');
var router = express.Router();
const multer = require('multer');
const _path_img_upload = './public/videos/mp4';
var fs = require('fs');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/videos/mp4')
    },
    filename: function (req, file, cb) {
        let file_name = file.originalname;
        cb(null, file_name)
    }
});
var upload = multer({storage: storage});

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
                res.writeHead(200, {'Access-Control-Allow-Origin': '*'});
                res.end(content, 'utf-8');
            }
        });
    } else {
        console.log('Param is not existed!');
        res.end('', 'utf-8');
    }
});

router.post('/comvertMp4ToTs', function (req, res, next) {
    var body = req.body;
    console.log('body: ', body);
    let result = {
        status: false,
        msg: ''
    };
    if (!body.film_name) {
        console.error('Require film_name field!');
        res.status(400).send(result);
    }

    const {exec} = require("child_process");
    let folder_video_path = 'public/videos/mp4/';
    let folder_ts_path = 'public/videos/ts/';
    let file_full_name = body.film_name,
        file_name_component = file_full_name.split('.'),
        file_name = file_name_component[0];

    folder_ts_path += common.convertTexToNormalize(file_name) + '/';

    let file_input = folder_video_path + file_full_name;
    let file_output = folder_ts_path + 'filename.m3u8';

    // exec('mkdir ' + folder_ts_path + file_name );
    common.createFolder(folder_ts_path).then((folder_exist_flg) => {
        if (folder_exist_flg) {
            exec('ffmpeg -i ' + file_input + ' -codec: copy -bsf:v h264_mp4toannexb -start_number 0 -hls_time 10 -hls_list_size 0 -f hls ' + file_output, (error, stdout, stderr) => {

                if (stderr) {
                    console.log('---- stdERR: ', stderr);
                    // result.msg = 'Convert error stderr: ' + JSON.stringify(stderr);
                }

                if (error) {
                    // console.error('Convert error: ' + file_output, error.message);
                    // return res.send(error.message);
                    result.msg = 'Convert error: ' + file_output + '. ' + error.message;
                    res.status(200).send(result);
                } else {
                    console.log('Convert success: ', file_output);
                    result.status = true;
                    res.status(200).send(result);
                }
            });
        } else {
            console.error('Folder cannot create: ' + folder_ts_path);
            result.msg = 'Folder cannot create: ' + folder_ts_path;
            res.status(200).send(result);
        }
    });
});


router.post('/upload', upload.single('film'), async function (req, res, next) {

    const file = req.file;
    console.log(file);
    // var filePath = _path_img_upload + file.filename
    // fs.renameSync('/path/to/Afghanistan.png', '/path/to/AF.png');

    res.status(200).send(file)
});
module.exports = router;
