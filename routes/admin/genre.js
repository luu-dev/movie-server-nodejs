var express = require('express');
var router = express.Router();
const config = require('config');
const bodyParser = require("body-parser");
const model = require("../../model");
const genre = model.model('genre');

const genreRes = require('../../controller/GenreController');

router.get('/', function(req, res, next) {
    res.render('admin/genre/index', { title: 'genre list' });
});

router.post('/list', function (req, res, next) {
    try {
        var data = genre.find().exec()
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
        let item = await genreRes.getById(id);
        res.status(200).send(item);

    }catch (e) {
        console.log('genre get one:', e.message);
        res.status(400);
    }
});


router.post('/insert', async function (req, res, next) {
    const body = req.body;
    var data = {
        id:-1,
        name: body.name,
    };
    let insert = await genreRes.insert(data);
    res.status(200).send(insert);
});

router.post('/update', async function (req, res, next) {
    let body = req.body,
        id = body.id;

    let update = await genreRes.update(id, {
        name: body.name,
    });
    res.status(200).send(update);
});



router.post('/delete',genreRes.delete);


module.exports = router;
