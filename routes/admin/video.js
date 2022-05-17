var express = require('express');
var router = express.Router();
const bodyParser = require("body-parser");
const videoRes = require('../../controller/VideoController');
const countryRes = require('../../controller/CountryController');
const spokenRes = require('../../controller/SpokenLangueController');

router.get('/', function (req, res, next) {
    res.render('admin/video/index', {title: 'video list'});
});

router.post('/list', async function (req, res, next) {
    var listVideo = await videoRes.getList();
    //     .then(list => {
    //     res.status(200).send(list);
    // });
    var listCountry = await countryRes.getList();
    var listSpoken = await spokenRes.getList();
    var list = {};
    list.videos = listVideo;
    list.countrys =  listCountry;
    list.spokens =  listSpoken;
    console.log(list);
    res.status(200).send(list)

});

router.post('/getItem', async function (req, res, next) {
    try {
        let body = req.body,
            id = body.id;
        let item = await videoRes.getById(id);
        res.status(200).send(item);

    } catch (e) {
        console.log('video get one:', e.message);
        res.status(400);
    }
});


router.post('/insert', async function (req, res, next) {
    const body = req.body;
    console.log(body);
    var data = {
        iso_639_1: body.iso_639_1,
        iso_3166_1: body.iso_3166_1,
        name: body.name,
        key: body.key,
        site: body.site,
        size: body.size,
        type: body.type
    };
    let insert = await videoRes.insert(data);
    res.status(200).send(insert);
});

router.post('/update', async function (req, res, next) {
    let body = req.body,
        id = body.id;

    let update = await videoRes.update(id, {
        iso_639_1: body.iso_639_1,
        iso_3166_1: body.iso_3166_1,
        name: body.name,
        key: body.key,
        site: body.site,
        size: body.size,
        type: body.type
    });
    res.status(200).send(update);
});


router.post('/delete', async function (req, res, next) {
    let body = req.body,
        id = body._id;
    try {
        let remove = await videoRes.delete(id);
        var response = {
            status: false,
            msg: 'delete success'
        };
        res.status(200).send(response)
    } catch (e) {
        res.status(400).send("err");

    }

});
module.exports = router;
