var express = require('express');
var router = express.Router();
const bodyParser = require("body-parser");
const reviewRes = require('../../controller/ReviewControllter');
const userRes = require('../../controller/CountryController');
const spokenRes = require('../../controller/SpokenLangueController');

router.get('/', function (req, res, next) {
    res.render('admin/video/index', {title: 'video list'});
});

router.post('/list', async function (req, res, next) {
    let body = req.body,
        movie_id = body.movieId;
    let list = await reviewRes.getListbyMovieId(movie_id).then(list =>{
        res.status(200).send(list);
    });


});


router.post('/insert', async function (req, res, next) {
    const body = req.body;
    var data = {
        content: body.content,
        movie_id: body.movie_id,
        created_at: body.created_at,
    };
    let insert = await reviewRes.insert(data);
    res.status(200).send(insert);
});

router.post('/update', async function (req, res, next) {
    let body = req.body,
        movie_id = body.id;

    let update = await reviewRes.update(id, {
        content: body.comment,
        created_at: body.created_at
    });
    res.status(200).send(update);
});


router.post('/delete', async function (req, res, next) {
    let body = req.body,
        id = body._id;
    try {
        let remove = await reviewRes.delete(id);
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
