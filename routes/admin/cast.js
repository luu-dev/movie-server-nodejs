const express = require('express');
const router = express.Router();
const config = require('config');
const bodyParser = require("body-parser");
const g_var = require('../../modules/varible');
const imageDownloader = require('node-image-downloader');
const model = require("../../model");
const cast = model.model('cast');
const castRes = require('../../controller/CastsController');
const multer = require('multer');
const fs = require('fs');
const _path_img_upload = './public/images/';

var storage1 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images')
    },
    filename: function (req, file, cb) {
        let file_name = Date.now()+"_"+file.originalname;
        cb(null, file_name)
    }
});

var upload1 = multer({storage: storage1});

router.get('/', function(req, res, next) {
    res.render('admin/cast/index', { title: 'Cast list' });
});

router.post('/list', function (req, res, next) {
    try {
        var data = cast.find().exec()
            .then(data =>{
                res.status(200).send(data);
            });

    }catch (e) {
        console.log('videos trailer err:', e);
        response.msg = "Unknow error!";
        res.status(400);
    }
});

router.post('/getItem', async function (req, res, next) {
    try {
        let body = req.body,
            id = body.id;
        let item = await castRes.getById(id);
        res.status(200).send(item);

    }catch (e) {
        console.log('Cast get one:', e.message);
        res.status(400);
    }
});


router.post('/insert', upload1.single('img'), async function (req, res, next) {
    const body = req.body;
    var data = {
        gender : body.gender,
        known_for_department : body.known_for_department,
        original_name : body.original_name,
        popularity : body.popularity,
        character : body.character
    };

    if(req.file) {
        const file = req.file;
        data['profile_path'] = file.filename;
    }
    let insert = await castRes.insert(data);
    res.redirect('/admin/cast')
});

router.post('/update',  upload1.single('img'),async function (req, res, next) {
    let body = req.body,
        id = body.id;
    console.log("idddd",id);
    let data_update = {
        gender : body.gender,
        known_for_department : body.known_for_department,
        original_name : body.original_name,
        popularity : body.popularity,
        character : body.character

    };
    let old_logo_path = '';
    if(req.file) {
        const file = req.file;
        let file_name = file.filename;

        //remove old file if have new file
        let item = await castRes.getById(id);
        old_logo_path = item ? item.profile_path : '';

        //only update if have new file
        data_update['profile_path'] = file_name;
    }

    let update = await castRes.update(id, data_update);

    if(old_logo_path) {
        console.log('Remove file start:', _path_img_upload + old_logo_path);
        fs.stat(_path_img_upload + old_logo_path, function (err, stats) {
            if (err) {
                console.error('Remove file error:', err);
            } else {
                fs.unlink(_path_img_upload + old_logo_path,function(err){
                    if(err) return console.log(err);
                    console.log('Remove file successfully');
                });
            }
        });
    }

    res.redirect('/admin/cast')
});



router.post('/delete', async (req, res, next) => {
    try {
        let body = req.body,
            id = body._id;
        let item = await castRes.getById(id);
        old_profile_path = item ? item.profile_path : '';

        const ob =   await cast.findByIdAndRemove(id);


        if(old_profile_path) {
            fs.stat(_path_img_upload + old_profile_path, function (err, stats) {
                if (err) {
                    console.error('Remove file error:', err);
                } else {
                    fs.unlink(_path_img_upload + old_profile_path,function(err){
                        if(err) return console.log(err);
                        console.log('Remove file successfully');
                    });
                }
            });
        }
        var response = {
            status: false,
            msg: 'delete success'
        };
        res.status(200).send(response)

    } catch (e) {
        res.status(400).send(e.message)
    }
});





module.exports = router;