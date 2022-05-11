const express = require('express');
const router = express.Router();
const config = require('config');
const bodyParser = require("body-parser");
const g_var = require('../../modules/varible');
const imageDownloader = require('node-image-downloader');
const model = require("../../model");
const cast = model.model('cast');
const castRes = require('../../controller/CastsController');

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


router.post('/insert', async function (req, res, next) {
    const body = req.body;
    var data = {
        id:-1,
        name : body.name,
        adult : body.adult,
        gender : body.gender,
        known_for_department : body.known_for_department,
        original_name : body.original_name,
        popularity : body.popularity,
        profile_path : body.profile_path,
        cast_id : body.cast_id,
        character : body.character,
        credit_id : body.credit_id,
        order : body.order
    };
    let insert = await castRes.insert(data);
    res.status(200).send(insert);
});

router.post('/update', async function (req, res, next) {
    let body = req.body,
        id = body.id;

    let update = await castRes.update(id, {
        name : body.name,
        adult : body.adult,
        gender : body.gender,
        known_for_department : body.known_for_department,
        original_name : body.original_name,
        popularity : body.popularity,
        profile_path : body.profile_path,
        cast_id : body.cast_id,
        character : body.character,
        credit_id : body.credit_id,
        order : body.order
    });
    res.status(200).send(update);
});



router.post('/delete',castRes.delete);


module.exports = router;